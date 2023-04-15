const hre = require("hardhat");

async function main() {
    const NftDummy = await ethers.getContractFactory("NftDummy");
	const NftReader = await ethers.getContractFactory("NftReader");
	const NftCreator = await ethers.getContractFactory("NftCreator");

	// Mumbai
    const chainId_A = 10109
	const chainA_endpoint = '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'
    const minGasToStore = 150000

	// On Chain A -- Mumbai
    console.log("---------------------------------");
    nftDummy = await NftDummy.deploy();
    console.log("nftDummy deployed to:", nftDummy.address);
    nftReader = await NftReader.deploy('Reader', 'READER', minGasToStore, chainA_endpoint);	
	console.log("nftReader deployed to:", nftReader.address);
	console.log("on chain:", chainId_A, "at endpoint:", chainA_endpoint)
	console.log("=================================");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// npx hardhat run --network localhost scripts/deploy_testA.js
// npx hardhat run --network mumbai scripts/deploy_testA.js
// npx hardhat run --network goerli scripts/deploy_testA.js