// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract BattleCommitAndReveal is Ownable {
    // ------------------------- event -------------------------
    event Matching();

    // ------------------------- enum -------------------------
    enum Choice {
        None,
        Fire,
        Leaf,
        Water
    }

    enum Stage {
        None,
        Matching,
        Commit,
        Reveal
    }

    // ------------------------- structs -------------------------
    struct CommitChoice {
        address playerAddress;
        Choice choice;
        bytes32 commitment;
    }

    struct Result {
        address player0;
        int8 player0Score;
        address player1;
        int8 player1Score;
    }

    // ------------------------- parameters -------------------------
    uint40 public stageSpan;
    uint8 public maxLoop;

    // ------------------------- state -------------------------
    address[2] public matchings;
    CommitChoice[2] public players;
    Stage public stage = Stage.None;
    uint40 public stageDeadline;
    uint8 public loopCount = 0;
    // [[0x0, +1][0x2, -1]],[[0x0, -1][0x2, +1]]...
    Result[] public results;

    // ------------------------- constructor -------------------------
    constructor() {
        stageSpan = 15;
        maxLoop = 2;
    }

    // ------------------------- onwers functions -------------------------
    function setstageSpan(uint40 _stageSpan) external onlyOwner {
        stageSpan = _stageSpan;
    }

    function setMaxLoop(uint8 _maxLoop) external onlyOwner {
        maxLoop = _maxLoop;
    }

    function forceReset() external onlyOwner {
        _resetStage();
    }

    // ------------------------- external functions -------------------------
    function enter() external virtual {
        if (stage == Stage.None) {
            //player 0 enter
            matchings[0] = msg.sender;
            stage = Stage.Matching;
            stageDeadline = uint40(block.timestamp) + stageSpan;
        } else if (stage == Stage.Matching) {
            //player 1 enter
            if (stageDeadline <= block.timestamp) {
                revert("cannot enter after deadline");
            }
            matchings[1] = msg.sender;
            stage = Stage.Commit;
            stageDeadline += stageSpan;
            emit Matching();
        } else {
            revert("cannot enter");
        }
    }

    function resetMatching() external {
        if (stage == Stage.Matching && stageDeadline <= block.timestamp) {
            matchings[0] = address(0);
            matchings[1] = address(0);
            stage = Stage.None;
            stageDeadline = 0;
        }
    }

    function commit(bytes32 _commitment) external virtual {
        if (stageDeadline <= block.timestamp) {
            revert("cannot commit after deadline");
        }

        if (msg.sender == matchings[0]) {
            players[0] = CommitChoice(msg.sender, Choice.None, _commitment);
        } else if (msg.sender == matchings[1]) {
            players[1] = CommitChoice(msg.sender, Choice.None, _commitment);
        } else {
            revert("not a player");
        }

        //both players committed and go to next stage
        if (
            players[0].playerAddress != address(0) &&
            players[1].playerAddress != address(0)
        ) {
            stage = Stage.Reveal;
            stageDeadline += stageSpan;
        }
    }

    // // if both players or one player didn't reveal by deadline, judge and reset stage
    // function resetCommint() external {
    //     if (stage == Stage.Commit && stageDeadline <= block.timestamp) {
    //         //TODO
    //         judge();
    //         stage = Stage.None;
    //         stageDeadline = 0;
    //     }
    // }

    function reveal(Choice _choice, bytes32 _salt) public virtual {
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
        } else if (msg.sender == matchings[1]) {
            _playerIdx = 1;
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

        //both players revealed and judging and go to next stage
        if (
            players[0].choice != Choice.None && players[1].choice != Choice.None
        ) {
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
    }

    //if one player didn't reveal by deadline, judge and go to next stage
    function forceReveal() external {
        if (stage == Stage.Reveal && stageDeadline <= block.timestamp) {
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
    }

    // ------------------------- internal functions -------------------------
    function _resetStage() internal {
        matchings[0] = address(0);
        matchings[1] = address(0);
        players[0] = CommitChoice(address(0), Choice.None, bytes32(0));
        players[1] = CommitChoice(address(0), Choice.None, bytes32(0));
        stage = Stage.None;
        stageDeadline = 0;
        loopCount = 0;
    }

    function _judge() internal virtual {
        CommitChoice memory player0Choice = players[0];
        CommitChoice memory player1Choice = players[1];

        console.log(uint256(player0Choice.choice), "player0Choice.choice");
        console.log(uint256(player1Choice.choice), "player1Choice.choice");

        //draw
        if (player0Choice.choice == player1Choice.choice) {
            //nothing to do
        } else {
            uint8 _winnerIdx;
            if (player0Choice.choice == Choice.None) {
                _winnerIdx = 1;
            } else if (player1Choice.choice == Choice.None) {
                _winnerIdx = 0;
            } else if (player0Choice.choice == Choice.Fire) {
                if (player1Choice.choice == Choice.Water) {
                    _winnerIdx = 1;
                } else if (player1Choice.choice == Choice.Leaf) {
                    _winnerIdx = 0;
                }
            } else if (player0Choice.choice == Choice.Water) {
                if (player1Choice.choice == Choice.Fire) {
                    _winnerIdx = 0;
                } else if (player1Choice.choice == Choice.Leaf) {
                    _winnerIdx = 1;
                }
            } else if (player0Choice.choice == Choice.Leaf) {
                if (player1Choice.choice == Choice.Fire) {
                    _winnerIdx = 1;
                } else if (player1Choice.choice == Choice.Water) {
                    _winnerIdx = 0;
                }
            }
            //set results
            uint _len = results.length;
            if (_winnerIdx == 0) {
                Result memory _result = Result(
                    matchings[0],
                    1,
                    matchings[1],
                    -1
                );
                results.push(_result);
            } else if (_winnerIdx == 1) {
                Result memory _result = Result(
                    matchings[0],
                    -1,
                    matchings[1],
                    1
                );
                results.push(_result);
            }
        }

        //clear players choices
        players[0] = CommitChoice(address(0), Choice.None, bytes32(0));
        players[1] = CommitChoice(address(0), Choice.None, bytes32(0));
    }

    // ------------------------- read functions -------------------------
    function getEncodePacked(
        address _sender,
        Choice _choice,
        bytes32 _salt
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(_sender, _choice, _salt));
    }

    function getLastResult(address _player) external view returns (int8) {
        Result memory _result = getLastResults();
        if (_result.player0 == _player) {
            return _result.player0Score;
        } else if (_result.player1 == _player) {
            return _result.player1Score;
        }
    }

    function getLastResults() public view returns (Result memory) {
        uint _len = results.length;
        if (_len == 0) revert("no result");
        return results[results.length - 1];
    }
}
