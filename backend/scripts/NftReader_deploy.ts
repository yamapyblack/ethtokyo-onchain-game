import { ethers } from "hardhat";

async function main() {
  // zk Polygon (Testnet)
  const chainId_A = 10109;
  const chainA_endpoint = "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8";
  const minGasToStore = 150000;

  const factory = await ethers.getContractFactory("NftReader");
  const contract = await factory.deploy(
    "Reader",
    "READER",
    minGasToStore,
    chainA_endpoint
  );
  await contract.deployed();
  console.log("NftReader deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
