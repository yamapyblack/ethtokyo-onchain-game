import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("BattleCommitAndReveal");
  const contract = await factory.deploy();
  await contract.deployed();
  console.log("BattleCommitAndReveal deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
