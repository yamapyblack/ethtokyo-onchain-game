const hre = require("hardhat");

async function main() {
    const NftDummy = await ethers.getContractFactory("NftDummy");
	const NftReader = await ethers.getContractFactory("NftReader");
	const NftCreator = await ethers.getContractFactory("NftCreator");

	// Goerli
    const chainId_A = 10121
	const chainA_endpoint = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'
    const minGasToStore = 150000

	// On Chain A -- Mumbai
    console.log("---------------------------------");
    // nftDummy = await NftDummy.deploy();
    // console.log("nftDummy deployed to:", nftDummy.address);
    nftReader = await NftReader.deploy('Reader', 'READER', minGasToStore, chainA_endpoint);	
	console.log("nftReader deployed to:", nftReader.address);
	console.log("on chain:", chainId_A, "at endpoint:", chainA_endpoint)
	console.log("=================================");
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// npx hardhat verify --network mumbai '0x4E7E7D34d1aE17549BD11541d20321eFCF66e1c4' 'Reader', 'READER', 150000, '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'

// npx hardhat run --network localhost scripts/deploy_testA_Goerli.js
// npx hardhat run --network mumbai scripts/deploy_testA_Goerli.js
// npx hardhat run --network goerli scripts/deploy_testA_Goerli.js
