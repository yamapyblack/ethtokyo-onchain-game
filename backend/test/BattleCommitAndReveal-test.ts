import { expect } from "chai";
import { ethers } from "hardhat";
import { BattleCommitAndReveal } from "../typechain-types/contracts/BattleCommitAndReveal";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { arrayify } from "ethers/lib/utils";

const encodeParameters = (types: string[], values: any[]): string => {
  const abi = new ethers.utils.AbiCoder();
  return ethers.utils.solidityKeccak256(types, values);
};

describe("BattleCommitAndReveal", function () {
  let owner: SignerWithAddress;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let contract: BattleCommitAndReveal;

  beforeEach(async () => {
    // Contracts are deployed using the first signer/account by default
    [owner, alice, bob] = await ethers.getSigners();

    const BattleCommitAndReveal = await ethers.getContractFactory(
      "BattleCommitAndReveal"
    );
    contract = (await BattleCommitAndReveal.deploy()) as BattleCommitAndReveal;
  });

  describe("commit and reveal", function () {
    it("success", async function () {
      //enter
      await contract.connect(alice).enter();
      await contract.connect(bob).enter();

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
      await contract.connect(alice).enter();
      await contract.connect(bob).enter();

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
      await contract.connect(alice).enter();
      await contract.connect(bob).enter();

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
      await contract.connect(alice).enter();
      await contract.connect(bob).enter();

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
