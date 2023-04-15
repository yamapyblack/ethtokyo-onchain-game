const hre = require("hardhat");

async function main() {
	const NftCreator = await ethers.getContractFactory("NftCreator");

	// zk Polygon (Testnet)
	const chainId_B = 10158
	const chainB_endpoint = '0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab'

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

//npx hardhat run --network mumbai scripts/deploy_testB.js
//npx hardhat run --network localhost scripts/deploy_testB.js
// npx hardhat run --network POLYGON_ZKEVM_TESTNET scripts/deploy_testB.js