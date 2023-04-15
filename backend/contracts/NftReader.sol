// SPDX-License-Identifier: MIT

/// @title: NFT Bridge POC
/// @author: PxGnome
/// @notice: POC
/// @dev: This is Version 1.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "hardhat/console.sol";

import "./token/onft/ONFT721.sol";

import "./INftCreator.sol";

contract NftReader is Ownable, ONFT721 {

    INftCreator public NFTCREATOR;
    
    constructor(string memory _name, string memory _symbol, uint256 _minGasToTransfer, address _lzEndpoint) ONFT721(_name, _symbol, _minGasToTransfer, _lzEndpoint) {}

    function setNftCreator(address _addr) public onlyOwner {
        NFTCREATOR = INftCreator(_addr);
    }

    ///@dev For testing
    function mockPayload(address _toAddress, address _nftAddress, uint256 _tokenId) public view returns(bytes memory) {
        bytes memory payload = abi.encode(_toAddress, _nftAddress);
        // uint[] memory tokenIds = new uint[](1);
        // tokenIds[0] = _tokenId;
        // bytes memory payload = abi.encode(_toAddress, _nftAddress, tokenIds);

        return payload;
    }

    ///@dev Send NFT information here to be sent to another chain
    function portForPvp(address _from, uint16 _dstChainId, bytes memory _toAddress, address _nftAddress, uint _tokenId, address payable _refundAddress, address _zroPaymentAddress, bytes memory _adapterParams) public payable {
        require(IERC721(_nftAddress).ownerOf(_tokenId) == msg.sender, "NftReader: Message needs to be from owner of NFT");

        bytes memory payload = abi.encode(_toAddress, _nftAddress);

        _checkGasLimit(_dstChainId, FUNCTION_TYPE_SEND, _adapterParams, dstChainIdToTransferGas[_dstChainId]);
        _lzSend(_dstChainId, payload, _refundAddress, _zroPaymentAddress, _adapterParams, msg.value);


        uint[] memory tokenIds = new uint[](1);
        tokenIds[0] = _tokenId;

        emit SendToChain(_dstChainId, _from, _toAddress, tokenIds);
    }

    
    ///@dev Send NFT information here to be sent to another chain
    function mockPortForPvp(address _from, uint16 _dstChainId, bytes memory _toAddress, address _nftAddress, uint _tokenId, address payable _refundAddress, address _zroPaymentAddress, bytes memory _adapterParams) public payable {
        require(IERC721(_nftAddress).ownerOf(_tokenId) == msg.sender, "NftReader: Message needs to be from owner of NFT");

        bytes memory payload = abi.encode(_toAddress, _nftAddress);
        bytes memory addr = abi.encode(address(this));
        NFTCREATOR.mockNonblockingLzReceive(_dstChainId, '', 0, payload);
    }

    /// @dev Empty override as we don't need this
    function _debitFrom(address _from, uint16, bytes memory, uint _tokenId) internal virtual override {
        revert("NftCreator: _debitFrom not implemented");
    }

    /// @dev Empty override as we don't need this but it is in IONFT721
    function _creditTo(uint16, address _toAddress, uint _tokenId) internal virtual override {
        revert("NftCreator: _creditTo not implemented");
    }
}


// 0x0000000000000000000000007b239486bb165d44825ea1db7f05871c34dd7ae6
// 0x0000000000000000000000007786708b7e93b19411973a077e3bafaef5887456

// 0000000000000000000000000000000000000000000000000000000000000060
// 0000000000000000000000000000000000000000000000000000000000000001
// 0000000000000000000000000000000000000000000000000000000000000001



// 0x0000000000000000000000007b239486bb165d44825ea1db7f05871c34dd7ae6
// 0x0000000000000000000000007786708b7e93b19411973a077e3bafaef5887456
// 0x0000000000000000000000000000000000000000000000000000000000000001