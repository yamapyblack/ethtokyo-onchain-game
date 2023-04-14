const { expect } = require("chai");
const {keccak256, toBuffer,  ecsign, bufferToHex, privateToAddress} = require("ethereumjs-util");
const crypto = require("crypto");

var currentdate = new Date(); 
var datetime =  currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

describe('Aggregate Testing on: ' + datetime, function () {
    var testContract;

    before(async function () {
        // Get the ContractFactory and Signers here.
        const NFTContract = await ethers.getContractFactory("NFTBridgePOC");
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        testContract = await NFTContract.deploy();
        const blockNumBefore = await ethers.provider.getBlockNumber();
        const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    });
    describe("Initial Tests", function () {
        it("Example generate Signature and verify", async function () {
        message = 'Hello world';
        msg = ethers.utils.formatBytes32String(message);
        const signature = await owner.signMessage(
            msg,
            owner.privateKey
        );
        console.log("Signature: " + signature);
        const verifyAddr = await ethers.utils.verifyMessage(message, signature);
        console.log("Addr:" + verifyAddr);
        expect(verifyAddr).to.equal(owner.address);
        });
        it("Generate Signature and verify on contract", async function () {
        message = 'Hello world';
        msg = ethers.utils.formatBytes32String(message);
        const signature = await owner.signMessage(
            msg,
            owner.privateKey
        );
        console.log("Signature: " + signature);
        // msg = ethers.utils.formatBytes32String(message);
        // console.log(msg);

        // h = ethers.utils.toUtf8Bytes('Hello world');
        // let decision = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('M'));

        // let decision = ethers.utils.hexlify(ethers.utils.toUtf8Bytes('M'));

        // signature = signature.substr(0, 130) + (signature.substr(130) == "00" ? "1b" : "1c"); // v: 0,1 => 27,28
        const verifyAddr = await testContract.recover(msg, signature);
        console.log(verifyAddr);
        expect(verifyAddr).to.equal(owner.address);
        });
        it("Send message to other chain", async function () {

        });
        it("Receive message on other chain", async function () {

        });
        it("Mint NFT on other chain", async function () {

        });
    });
});
