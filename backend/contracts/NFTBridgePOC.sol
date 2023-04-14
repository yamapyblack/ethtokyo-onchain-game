// SPDX-License-Identifier: MIT

/// @title: NFT Bridge POC
/// @author: PxGnome
/// @notice: POC
/// @dev: This is Version 1.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "hardhat/console.sol";

contract NFTBridgePOC {
    using ECDSA for bytes32;


    function recover(bytes32 hash, bytes memory signature) public view returns (address) {
        console.log("bwb");
        string memory foo = string(abi.encodePacked(hash));
        console.log(foo);
        return ECDSA.recover(hash, signature);
    }



    // function _verify(bytes32 data, address account) pure returns (bool) {
    //     return keccack256(data)
    //         .toEthSignedMessageHash()
    //         .recover(signature) == account;
    // }

    // function foo() external pure returns (bool) {
    //     address recovered = ECDSA.recover(
    //         0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede, // messageHash
    //         0x1c, // v
    //         0x285e6fbb504b57dca3ceacc851a7bfa37743c79b5c53fb184f4cc0b10ebff6ad, // r
    //         0x245f558fa13540029f0ee2dc0bd73264cf04f28ba9c2520ad63ddb1f2e7e9b24 // s
    //     );
        
    //     return recovered == address(0x0647EcF0D64F65AdA7991A44cF5E7361fd131643);
    // }



}
