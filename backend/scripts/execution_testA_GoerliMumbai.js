const hre = require("hardhat");

async function main() {
    nftDummyAddr = '0x01B2D451063C52f4918c604FDf2b69A8A451C0d4'  // Goerli
	nftReaderAddr = '0xFc9A86c1716259a36e0ce285e415D3E9f6b68E7e' // Goerli
	nftCreatorAddr = '0x642C3C7c88f75B22947aa5b77bA5084bc0261f70' // Mumbai

	const nftDummy = await ethers.getContractAt("NftDummy", nftDummyAddr);
	const nftReader = await ethers.getContractAt("NftReader", nftReaderAddr);

	
	// Goerli
    const chainId_A = 10121
	const chainA_endpoint = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'
	// Mumbai
	const chainId_B = 10109
	const chainB_endpoint = '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'

    const minGasToStore = 150000
    const batchSizeLimit = 1
    const defaultAdapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])

	// set each contracts source address so it can send to each other
	// console.log("---------------------------------");
	// console.log("Start execution_testA");
	// await nftReader.setTrustedRemote(chainId_B, ethers.utils.solidityPack(["address", "address"], [nftCreatorAddr, nftReaderAddr]))

    // console.log("Trust Remote Set");
    // await nftReader.setDstChainIdToBatchLimit(chainId_B, batchSizeLimit)
	// await nftReader.setMinDstGas(chainId_B, 1, 150000)
	// console.log("Complete");
	// console.log("=================================");	

	// await nftReader.setTrustedRemote(chainId_B, ethers.utils.solidityPack(["address", "address"], [nftReaderAddr, nftCreatorAddr]))


    // temp = await nftReader.getTrustedRemoteAddress(chainId_B);
    // console.log(temp);
    // temp = await nftReader.isTrustedRemote(chainId_B, nftCreatorAddr);
    // console.log(temp);
    // console.log("Complete");
	// console.log("=================================");	


    const [owner] = await ethers.getSigners();
	// console.log("---------------------------------");
	// await nftDummy.mint(owner.address);
	// console.log("Minted to: " + owner.address);

	// const nftTokenId = 0;
	// let nativeFee = (await nftReader.estimateSendFee(chainId_B, owner.address, 1, false, defaultAdapterParams)).nativeFee

	// console.log("Native Fee: " + nativeFee);

	// await nftReader.portForPvp(
	// 	owner.address,
	// 	chainId_B,
	// 	owner.address,
	// 	nftDummy.address,
	// 	nftTokenId,
	// 	owner.address,
	// 	ethers.constants.AddressZero,
	// 	defaultAdapterParams,
	// 	{value: nativeFee}
	// );
	
	// console.log("Ported tokenId: " + nftTokenId + " | Over to chain: " + chainId_B);

	// console.log("Complete");
	// console.log("=================================");	


    payload = await nftReader.mockPayload(owner.address, nftDummy.address, 0);
    console.log(payload);


}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

  // npx hardhat run --network goerli scripts/execution_testA_GoerliMumbai.js