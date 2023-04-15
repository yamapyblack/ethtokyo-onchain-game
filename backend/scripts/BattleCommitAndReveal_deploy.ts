import { ethers } from "hardhat";

async function main() {
  const nftCreatorAddress = "0xAc34Ca9A89D717108CA81A5f67A9e169bA56Cd2a";
  // const nftReaderAddress = "0x95Fa1f5f2d37Ac32bec9AD8A9B81fba85443B7fb";

  const factory = await ethers.getContractFactory("BattleCommitAndReveal");
  const contract = await factory.deploy(nftCreatorAddress);
  await contract.deployed();
  console.log("BattleCommitAndReveal deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
