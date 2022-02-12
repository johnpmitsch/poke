// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract HotDogSender {
    uint256 totalHotDogs;
    uint256 private seed;

    event NewHotDog(address indexed from, uint256 timestamp, string message);

    struct HotDog {
        address HotDogSender; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    HotDog[] hotdogs;
    mapping(address => uint256) public lastHotDogSent;

    constructor() payable {
        console.log("Deploying the hot dog portal!");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function sendHotDog(string memory _message) public {
        require(
            lastHotDogSent[msg.sender] + 30 seconds < block.timestamp,
            "Cooldown period: Wait 30 seconds"
        );

        lastHotDogSent[msg.sender] = block.timestamp;
        totalHotDogs += 1;
        console.log("%s has sent a hot dog!", msg.sender);
        hotdogs.push(HotDog(msg.sender, _message, block.timestamp));

        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random # generated: %d", seed);
        if (seed <= 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeAmount = 0.0001 ether;

            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewHotDog(msg.sender, block.timestamp, _message);
    }

    function getAllHotDogs() public view returns (HotDog[] memory) {
        return hotdogs;
    }

    function getTotalHotDogs() public view returns (uint256) {
        console.log("We have %d total hot dogs sent!", totalHotDogs);
        return totalHotDogs;
    }
}
