// SPDX-License-Identifier: MIT

/// @title: NFT Bridge POC
/// @author: PxGnome
/// @notice: POC
/// @dev: This is Version 1.0

pragma solidity ^0.8.19;

import "./token/onft/ONFT721.sol";
import "hardhat/console.sol";

import "./lzApp/NonblockingLzApp.sol";

contract NftCreator is ONFT721 {
    constructor(string memory _name, string memory _symbol, uint256 _minGasToTransfer, address _lzEndpoint) ONFT721(_name, _symbol, _minGasToTransfer, _lzEndpoint) {}

    uint256 currentTokenId;
    mapping(uint256 => address) public tokenIdToOriginalAddress;

    /// @dev Empty override as we don't need this
    function _debitFrom(address _from, uint16, bytes memory, uint _tokenId) internal virtual override {
        revert("NftCreator: _debitFrom not implemented");
    }

    /// @dev Empty override as we don't need this but it is in IONFT721
    function _creditTo(uint16, address _toAddress, uint _tokenId) internal virtual override {
        revert("NftCreator: _creditTo not implemented");
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal virtual override {
        // decode and load the toAddress
        (address toAddress, address nftAddress) = abi.decode(_payload, (address, address));

        _mint(toAddress, currentTokenId);
        tokenIdToOriginalAddress[currentTokenId] = nftAddress;
        currentTokenId = currentTokenId + 1;
    }

    function getOriginalTokenAddress(uint256 _tokenId) public view returns(address) {
        return tokenIdToOriginalAddress[_tokenId];
    }

    ///@dev Mock for testing use PLEASE COMMENT OUT ON LIVE
    function mockNonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) public returns (uint256) {
        _nonblockingLzReceive(_srcChainId, _srcAddress, 0, _payload);
        return currentTokenId - 1;
    }

    ///@dev to find out NFT type
    function getNftType(uint256 _tokenId) public view returns (uint256) {
        uint256 tokenTypeId = (uint256(keccak256(abi.encodePacked(_tokenId)))) % (4);
        return tokenTypeId;
    }

}
