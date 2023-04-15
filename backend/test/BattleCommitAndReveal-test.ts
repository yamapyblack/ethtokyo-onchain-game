import { expect } from "chai";
import { ethers } from "hardhat";
import { BattleCommitAndReveal } from "../typechain-types/contracts/BattleCommitAndReveal";
import { NftCreator } from "../typechain-types/contracts/NftCreator";
import { NftReader } from "../typechain-types/contracts/NftReader";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { arrayify } from "ethers/lib/utils";

const dummyNft1 = "0x0000000000000000000000000000000000000001";

const encodeParameters = (types: string[], values: any[]): string => {
  const abi = new ethers.utils.AbiCoder();
  return ethers.utils.solidityKeccak256(types, values);
};

describe("BattleCommitAndReveal", function () {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let contract: BattleCommitAndReveal;
  let nftReader: NftReader;
  let nftCreator: NftCreator;

  beforeEach(async () => {
    // Contracts are deployed using the first signer/account by default
    [owner, alice, bob] = await ethers.getSigners();

    //nfts
    const chainA_endpoint = "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8";
    const chainB_endpoint = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab";
    const minGasToStore = 150000;

    const NftReader = await ethers.getContractFactory("NftReader");
    nftReader = (await NftReader.deploy(
      "Reader",
      "READER",
      minGasToStore,
      chainA_endpoint
    )) as NftReader;
    await nftReader.deployed();

    const NftCreator = await ethers.getContractFactory("NftCreator");
    nftCreator = (await NftCreator.deploy(
      "Creator",
      "CREATOR",
      minGasToStore,
      chainB_endpoint
    )) as NftCreator;
    await nftCreator.deployed();

    const payload0 = await nftReader.mockPayload(alice.address, dummyNft1, 1);
    const payload1 = await nftReader.mockPayload(bob.address, dummyNft1, 2);

    await nftCreator
      .connect(alice)
      .mockNonblockingLzReceive(
        10109,
        "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
        0,
        payload0
      );
    await nftCreator
      .connect(bob)
      .mockNonblockingLzReceive(
        10109,
        "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8",
        0,
        payload1
      );

    const BattleCommitAndReveal = await ethers.getContractFactory(
      "BattleCommitAndReveal"
    );
    contract = (await BattleCommitAndReveal.deploy(
      nftCreator.address
    )) as BattleCommitAndReveal;
    await contract.deployed();
  });

  describe("commit and reveal", function () {
    it("success", async function () {
      //enter
      await contract.connect(alice).enter(0);
      await contract.connect(bob).enter(1);

      const blindingFactor1 = ethers.utils.formatBytes32String("hoge");
      const blindingFactor2 = ethers.utils.formatBytes32String("fuga");

      const commitment1 = await contract.getEncodePacked(
        alice.address,
        1,
        blindingFactor1
      );
      const commitment2 = await contract.getEncodePacked(
        bob.address,
        2,
        blindingFactor2
      );

      //commit
      await contract.connect(alice).commit(commitment1);
      await contract.connect(bob).commit(commitment2);
      //reveal
      await contract.connect(alice).reveal(1, blindingFactor1);
      await contract.connect(bob).reveal(2, blindingFactor2);
      // assertion
      expect(await contract.getLastResult(alice.address)).to.equal(1);
      expect(await contract.getLastResult(bob.address)).to.equal(-1);
    });

    it("success twice", async function () {
      //enter
      await contract.connect(alice).enter(0);
      await contract.connect(bob).enter(1);

      let blindingFactor1 = ethers.utils.formatBytes32String("hoge");
      let blindingFactor2 = ethers.utils.formatBytes32String("fuga");

      let commitment1 = await contract.getEncodePacked(
        alice.address,
        1,
        blindingFactor1
      );
      let commitment2 = await contract.getEncodePacked(
        bob.address,
        2,
        blindingFactor2
      );

      //commit
      await contract.connect(alice).commit(commitment1);
      await contract.connect(bob).commit(commitment2);
      //reveal
      await contract.connect(alice).reveal(1, blindingFactor1);
      await contract.connect(bob).reveal(2, blindingFactor2);
      // assertion
      expect(await contract.getLastResult(alice.address)).to.equal(1);
      expect(await contract.getLastResult(bob.address)).to.equal(-1);

      blindingFactor1 = ethers.utils.formatBytes32String("hogehoge");
      blindingFactor2 = ethers.utils.formatBytes32String("fugafuga");

      commitment1 = await contract.getEncodePacked(
        alice.address,
        3,
        blindingFactor1
      );
      commitment2 = await contract.getEncodePacked(
        bob.address,
        2,
        blindingFactor2
      );

      //commit
      await contract.connect(alice).commit(commitment1);
      await contract.connect(bob).commit(commitment2);
      //reveal
      await contract.connect(alice).reveal(3, blindingFactor1);
      await contract.connect(bob).reveal(2, blindingFactor2);
      // assertion
      expect(await contract.getLastResult(alice.address)).to.equal(-1);
      expect(await contract.getLastResult(bob.address)).to.equal(1);

      // assert address0
      expect(await contract.matchings(0)).to.equal(
        ethers.constants.AddressZero
      );
      expect(await contract.matchings(1)).to.equal(
        ethers.constants.AddressZero
      );
      expect((await contract.players(0))[0]).to.equal(
        ethers.constants.AddressZero
      );
      expect((await contract.players(1))[0]).to.equal(
        ethers.constants.AddressZero
      );
      expect(await contract.stage()).to.equal(0);
      expect(await contract.stageDeadline()).to.equal(0);
      expect(await contract.loopCount()).to.equal(0);
    });

    it("success draw", async function () {
      //enter
      await contract.connect(alice).enter(0);
      await contract.connect(bob).enter(1);

      const blindingFactor1 = ethers.utils.formatBytes32String("hoge");
      const blindingFactor2 = ethers.utils.formatBytes32String("fuga");

      const commitment1 = await contract.getEncodePacked(
        alice.address,
        3,
        blindingFactor1
      );
      const commitment2 = await contract.getEncodePacked(
        bob.address,
        3,
        blindingFactor2
      );

      //commit
      await contract.connect(alice).commit(commitment1);
      await contract.connect(bob).commit(commitment2);
      //reveal
      await contract.connect(alice).reveal(3, blindingFactor1);
      await contract.connect(bob).reveal(3, blindingFactor2);
      //  will revert with message "no result"
      await expect(contract.getLastResult(alice.address)).to.revertedWith(
        "no result"
      );
      await expect(contract.getLastResult(bob.address)).to.revertedWith(
        "no result"
      );
    });
    it("success by encodeParameters", async function () {
      //enter
      await contract.connect(alice).enter(0);
      await contract.connect(bob).enter(1);

      const blindingFactor1 = ethers.utils.formatBytes32String("hoge");
      const blindingFactor2 = ethers.utils.formatBytes32String("fuga");

      const commitment1 = encodeParameters(
        ["address", "uint8", "bytes32"],
        [alice.address, 1, blindingFactor1]
      );
      const commitment2 = encodeParameters(
        ["address", "uint8", "bytes32"],
        [bob.address, 2, blindingFactor2]
      );

      //commit
      await contract.connect(alice).commit(commitment1);
      await contract.connect(bob).commit(commitment2);
      //reveal
      await contract.connect(alice).reveal(1, blindingFactor1);
      await contract.connect(bob).reveal(2, blindingFactor2);
    });
  });
});
