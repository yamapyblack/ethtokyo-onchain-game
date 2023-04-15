const hre = require("hardhat");

async function main() {
	const NftCreator = await ethers.getContractFactory("NftCreator");

	// Mumbai
    const chainId_B = 10109
	const chainB_endpoint = '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'
    const minGasToStore = 150000

	// On Chain B -- zk Polygon (Testnet)
    console.log("---------------------------------");
	nftCreator = await NftCreator.deploy('Creator', 'CREATOR', minGasToStore, chainB_endpoint)
	console.log("nftCreator deployed to:", nftCreator.address);
	console.log("on chain:", chainId_B, "at endpoint:", chainB_endpoint);
	console.log("=================================");

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// npx hardhat verify --network mumbai '0x642C3C7c88f75B22947aa5b77bA5084bc0261f70' 'Creator', 'CREATOR', 150000, '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'
// npx hardhat verify --network mumbai '0x642C3C7c88f75B22947aa5b77bA5084bc0261f70' 'Creator' 'CREATOR' 150000 '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'

//npx hardhat run --network mumbai scripts/deploy_testB_Mumbai.js
//npx hardhat run --network localhost scripts/deploy_testB_Mumbai.js

// nftCreator deployed to: 0xDED4f72dA81B05C682F38a726FE393E4D1E35887
// on chain: 10109 at endpoint: 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8

// nftCreator deployed to: 0x2F382f4C85c3fF22AE53674faF28F06F592AEAD0
// on chain: 10109 at endpoint: 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8