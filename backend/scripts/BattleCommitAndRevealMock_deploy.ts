import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("BattleCommitAndRevealMock");
  const contract = await factory.deploy();
  await contract.deployed();
  console.log("BattleCommitAndRevealMock deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
