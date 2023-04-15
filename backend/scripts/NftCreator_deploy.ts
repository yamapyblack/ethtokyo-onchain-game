import { ethers } from "hardhat";

async function main() {
  // zk Polygon (Testnet)
  const chainId_B = 10158;
  const chainB_endpoint = "0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab";
  const minGasToStore = 150000;

  const factory = await ethers.getContractFactory("NftCreator");
  const contract = await factory.deploy(
    "Creator",
    "CREATOR",
    minGasToStore,
    chainB_endpoint
  );
  await contract.deployed();
  console.log("NftCreator deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
