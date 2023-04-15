const hre = require("hardhat");

async function main() {
    nftDummyAddr = '0x807451c908Af2dC5f80c2eaECd9205d995a11271'  // Mumbai
	nftReaderAddr = '0x01B2D451063C52f4918c604FDf2b69A8A451C0d4' // Mumbai
	nftCreatorAddr = '0x642C3C7c88f75B22947aa5b77bA5084bc0261f70' // Mumbai

	const nftCreator = await ethers.getContractAt("NftCreator", nftCreatorAddr);
    const nftDummy = await ethers.getContractAt("NftDummy", nftDummyAddr);
	const nftReader = await ethers.getContractAt("NftReader", nftReaderAddr);


	// Goerli
    const chainId_A = 10121
	const chainA_endpoint = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'
    const minGasToStore = 150000
	// Mumbai
	const chainId_B = 10109
	const chainB_endpoint = '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'
    const batchSizeLimit = 1


    const [owner] = await ethers.getSigners();
	console.log("---------------------------------");

	// await nftDummy.mint(owner.address);
	// console.log("Minted to: " + owner.address);

	const nftTokenId = 0;
    payload = await nftReader.mockPayload(owner.address, nftDummy.address, nftTokenId);
    console.log("Payload:" + payload);

    await nftCreator.mockNonblockingLzReceive(chainId_A, nftReaderAddr, 0, payload);
    console.log('mockNonblockingLzReceive executed');

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




    // console.log("---------------------------------");
	// console.log("Start execution_testB");
	// await nftCreator.setTrustedRemote(chainId_A, ethers.utils.solidityPack(["address", "address"], [nftReaderAddr, nftCreatorAddr]));
    // // await nftCreator.setTrustedRemote(chainId_A, ethers.utils.solidityPack(["address", "address"], [nftCreatorAddr, nftReaderAddr]));
    // console.log("Trust Remote Set");
	// await nftCreator.setDstChainIdToBatchLimit(chainId_A, batchSizeLimit);
    // console.log("setDstChainIdToBatchLimit");

	// await nftCreator.setMinDstGas(chainId_A, 1, 150000)
    // console.log("setMinDstGas");
    // temp = await nftCreator.getTrustedRemoteAddress(chainId_A);
    // console.log(temp);
    // temp = await nftCreator.isTrustedRemote(chainId_A, nftReaderAddr);
    // console.log(temp);
    // console.log("Complete");
	// console.log("=================================");	


}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

  // npx hardhat run --network mumbai scripts/execution_test_Hack.js


//   0x000000000000000000000000abc5259370f5d1e479b0db8a8de004398eb5151700000000000000000000000001b2d451063c52f4918c604fdf2b69a8a451c0d40000000000000000000000000000000000000000000000000000000000000000