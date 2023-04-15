const { expect } = require("chai");
const {keccak256, toBuffer,  ecsign, bufferToHex, privateToAddress} = require("ethereumjs-util");
const crypto = require("crypto");
const { ethers } = require("hardhat");

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

describe('Aggregate Testing on: ' + datetime, function () {

    var nftReader;
    var nftDummy;
    var nftCreator;
    const nftTokenId = 1;
    // const receiverChainId = 1;
    // Testnet: eth = 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23, zk Polygon = 0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab
    // const receiveChainAddr = '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23';


    const chainId_A = 1
    const chainId_B = 2
    const minGasToStore = 150000
    const batchSizeLimit = 1
    const defaultAdapterParams = ethers.utils.solidityPack(["uint16", "uint256"], [1, 200000])


    before(async function () {
        // Get the ContractFactory and Signers here.
        const NftReader = await ethers.getContractFactory("NftReader");
        const NftCreator = await ethers.getContractFactory("NftCreator");
        const NftDummy = await ethers.getContractFactory("NftDummy");
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        
        LZEndpointMock = await ethers.getContractFactory("LZEndpointMock")

        lzEndpointMockA = await LZEndpointMock.deploy(chainId_A)
        lzEndpointMockB = await LZEndpointMock.deploy(chainId_B)

        nftDummy = await NftDummy.deploy();
        // On Chain A
        nftReader = await NftReader.deploy('Reader', 'READER', minGasToStore, lzEndpointMockA.address);
        
        // On Chain B
        nftCreator = await NftCreator.deploy('Creator', 'CREATOR', minGasToStore, lzEndpointMockB.address);

        // wire the lz endpoints to guide msgs back and forth
        lzEndpointMockA.setDestLzEndpoint(nftCreator.address, lzEndpointMockB.address)
        lzEndpointMockB.setDestLzEndpoint(nftReader.address, lzEndpointMockA.address)

        // set each contracts source address so it can send to each other
        await nftReader.setTrustedRemote(chainId_B, ethers.utils.solidityPack(["address", "address"], [nftCreator.address, nftReader.address]))
        await nftCreator.setTrustedRemote(chainId_A, ethers.utils.solidityPack(["address", "address"], [nftReader.address, nftCreator.address]))

        // set batch size limit
        await nftReader.setDstChainIdToBatchLimit(chainId_B, batchSizeLimit)
        await nftCreator.setDstChainIdToBatchLimit(chainId_A, batchSizeLimit)

        // set min dst gas for swap
        await nftReader.setMinDstGas(chainId_B, 1, 150000)
        await nftCreator.setMinDstGas(chainId_A, 1, 150000)
        
    });
    describe("Initial Tests", function () {
        // Steps:
        // 1. Get NFT Info
        // 2. Generate signed message from NFT Selection
        // 3. Send message to other chain
        // 4. Verify message on other chain
        // 5. Mint NFT on other chain

        it("Mint Dummy NFT", async function () {
            await nftDummy.mintSpecificTokenId(owner.address, nftTokenId);
            expect(await nftDummy.balanceOf(owner.address)).to.equal(1);
        });

        // it("Encode NFT Info", async function () {
        //     var nftAddress = nftDummy.address;
        //     payload = await nftReader.preparePayload(nftAddress, nftTokenId);
        //     console.log("Payload: " + payload);

        //     result = await nftReader.readPayload(payload);
        //     console.log("Result: " + result);
        //     expect(result[0]).to.equal(nftAddress);
        //     expect(result[1]).to.equal(nftTokenId);
        // });
        it("portForPvp() - NFT to new chain", async function () {    
            // // zk Polygon (Testnet)
            // uint16 dstChainId = 10158;
            // address _lzEndpoint = '0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab';
            
            let nativeFee = (await nftReader.estimateSendFee(chainId_B, owner.address, nftTokenId, false, defaultAdapterParams)).nativeFee

            await nftReader.portForPvp(
                owner.address,
                chainId_B,
                owner.address,
                nftDummy.address,
                nftTokenId,
                owner.address,
                ethers.constants.AddressZero,
                defaultAdapterParams,
                {value: nativeFee}
            );
        });

        // xit(" sendFrom() - NFT to new chain", async function () {
        //     // estimate nativeFees
        //     let nativeFee = (await nftReader.estimateSendFee(chainId_B, owner.address, nftTokenId, false, defaultAdapterParams)).nativeFee

        //     // swaps token to other chain
        //     await nftReader.connect(owner).portForPvp(
        //         owner.address,
        //         chainId_B,
        //         owner.address,
        //         nftDummy.address,
        //         nftTokenId,
        //         owner.address,
        //         ethers.constants.AddressZero,
        //         defaultAdapterParams,
        //         { value: nativeFee }
        //     )

        //     // token received on the dst chain
        //     // expect(await nftCreator.ownerOf(0)).to.be.equal(owner.address)

        //     // token still owned by owner
        //     expect(await nftDummy.ownerOf(nftTokenId)).to.be.equal(owner.address)
        // });

        it(" Receive() - NFT to new chain", async function () {
            
            payload = await nftReader.mockPayload(owner.address, nftDummy.address, nftTokenId);

            console.log(payload);
            await nftCreator.mockNonblockingLzReceive(10109, '0xf69186dfBa60DdB133E91E9A4B5673624293d8F8', 0, payload);

            // token still owned by owner
            // expect(await nftCreator.ownerOf(nftTokenId)).to.be.equal(owner.address)
            // expect(await nftCreator.getOriginalTokenAddress(0)).to.be.equal(nftDummy.address)
        });

    });
});


// random(tokenId) = Fire, Water, Leaf

// Actions:
// Fire, Water, Leaf



// Fire + Fire = 3
// Fire + Water = 0
// Fire + Leaf = 


