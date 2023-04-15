// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {BattleCommitAndReveal} from "./BattleCommitAndReveal.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract BattleCommitAndRevealMock is BattleCommitAndReveal {
    constructor(address _nft) BattleCommitAndReveal(_nft) {}

    // ------------------------- external functions -------------------------
    function enter(uint _tokenId) external override {
        require(IERC721(nft).ownerOf(_tokenId) == msg.sender, "not nft owner");

        if (stage == Stage.None) {
            //player 0 enter
            matchings[0] = msg.sender;
            stage = Stage.Commit;
            stageDeadline = uint40(block.timestamp) + stageSpan;
            emit Matching();
        } else {
            revert("cannot enter");
        }
    }

    function commit(bytes32 _commitment) external override {
        if (stageDeadline <= block.timestamp) {
            revert("cannot commit after deadline");
        }

        if (msg.sender == matchings[0]) {
            players[0] = CommitChoice(msg.sender, Choice.None, _commitment);
        } else {
            revert("not a player");
        }

        stage = Stage.Reveal;
        stageDeadline += stageSpan;
    }

    function reveal(Choice _choice, bytes32 _salt) public override {
        //valication check
        require(
            _choice == Choice.Fire ||
                _choice == Choice.Water ||
                _choice == Choice.Leaf,
            "invalid choice"
        );

        uint _playerIdx;
        if (msg.sender == matchings[0]) {
            _playerIdx = 0;
        } else {
            revert("not a player");
        }

        // Update choice
        CommitChoice storage commitChoice = players[_playerIdx];
        require(
            keccak256(abi.encodePacked(msg.sender, _choice, _salt)) ==
                commitChoice.commitment,
            "invalid hash"
        );
        commitChoice.choice = _choice;

        _judge();
        if (loopCount < maxLoop - 1) {
            //go to next game
            stage = Stage.Commit;
            stageDeadline += stageSpan;
            loopCount++;
        } else {
            _resetStage();
        }
    }

    // ------------------------- internal functions -------------------------
    function _judge() internal override {
        CommitChoice memory player0Choice = players[0];

        //set results
        uint _len = results.length;
        Result memory _result = Result(matchings[0], 1, address(0), -1);
        results.push(_result);

        //clear players choices
        players[0] = CommitChoice(address(0), Choice.None, bytes32(0));
    }
}
