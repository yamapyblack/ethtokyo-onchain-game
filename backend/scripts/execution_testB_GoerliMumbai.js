const hre = require("hardhat");

async function main() {
    nftDummyAddr = '0x01B2D451063C52f4918c604FDf2b69A8A451C0d4'  // Goerli
	nftReaderAddr = '0xFc9A86c1716259a36e0ce285e415D3E9f6b68E7e' // Goerli
	nftCreatorAddr = '0x642C3C7c88f75B22947aa5b77bA5084bc0261f70' // Mumbai

    // 0x606d43b14defe76e23740e6413e8d93b82030954
    // 0xded4f72da81b05c682f38a726fe393e4d1e35887
	const nftCreator = await ethers.getContractAt("NftCreator", nftCreatorAddr);
    
	// Goerli
    const chainId_A = 10121
	const chainA_endpoint = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23'
    const minGasToStore = 150000
	// Mumbai
	const chainId_B = 10109
	const chainB_endpoint = '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8'
    const batchSizeLimit = 1

    console.log("---------------------------------");
	console.log("Start execution_testB");
	await nftCreator.setTrustedRemote(chainId_A, ethers.utils.solidityPack(["address", "address"], [nftReaderAddr, nftCreatorAddr]));
    // await nftCreator.setTrustedRemote(chainId_A, ethers.utils.solidityPack(["address", "address"], [nftCreatorAddr, nftReaderAddr]));
    console.log("Trust Remote Set");
	await nftCreator.setDstChainIdToBatchLimit(chainId_A, batchSizeLimit);
    console.log("setDstChainIdToBatchLimit");

	await nftCreator.setMinDstGas(chainId_A, 1, 150000)
    console.log("setMinDstGas");
    temp = await nftCreator.getTrustedRemoteAddress(chainId_A);
    console.log(temp);
    temp = await nftCreator.isTrustedRemote(chainId_A, nftReaderAddr);
    console.log(temp);
    console.log("Complete");
	console.log("=================================");	

    payload = '0x000000000000000000000000abc5259370f5d1e479b0db8a8de004398eb5151700000000000000000000000001b2d451063c52f4918c604fdf2b69a8a451c0d40000000000000000000000000000000000000000000000000000000000000000';
    await nftCreator.mockNonblockingLzReceive(chainId_A, nftReaderAddr, 0, payload);

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

  // npx hardhat run --network mumbai scripts/execution_testB_GoerliMumbai.js


  0x000000000000000000000000abc5259370f5d1e479b0db8a8de004398eb5151700000000000000000000000001b2d451063c52f4918c604fdf2b69a8a451c0d40000000000000000000000000000000000000000000000000000000000000000