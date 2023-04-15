const hre = require("hardhat");

async function main() {
	const NftReader = await ethers.getContractFactory("NftReader");
	const NftCreator = await ethers.getContractFactory("NftCreator");

	// Mumbai LZ info
    const chainId_A = 10109
	const chainA_endpoint = '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'
	// zk Polygon (Testnet) LZ info
	const chainId_B = 10158
	const chainB_endpoint = '0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab'

    const minGasToStore = 150000

	// On Chain A -- Mumbai
	nftReader = await NftReader.deploy('Reader', 'READER', minGasToStore, chainA_endpoint);	
	console.log("---------------------------------");
	console.log("nftReader deployed to:", nftReader.address);
	console.log("on chain:", chainId_A, "at endpoint:", chainA_endpoint)
	// On Chain B -- zk Polygon (Testnet)
	nftCreator = await NftCreator.deploy('Creator', 'CREATOR', minGasToStore, chainB_endpoint)
	console.log("nftCreator deployed to:", nftCreator.address);
	console.log("on chain:", chainId_B, "at endpoint:", chainB_endpoint);
	console.log("=================================");	
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

  // npx hardhat run --network localhost scripts/deploy_local.js