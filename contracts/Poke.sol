// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Poke {
  mapping(address => mapping(address => bool)) private pokeMap;
  mapping(address => uint256) private lastPokeSent;
  mapping(address => address[]) private interactions;

  event NewPoke(address indexed from, uint256 timestamp, address to);

  function poke(address to) public {
    // check for poke yourself
    /*require(
      lastPokeSent[msg.sender] + 60 seconds < block.timestamp,
      "You've poked in the last 60 seconds! You can poke again after the cooldown period"
    );*/
    lastPokeSent[msg.sender] = block.timestamp;

    pokeMap[to][msg.sender] = true;
    interactions[to].push(msg.sender);
    pokeMap[msg.sender][to] = false;

    emit NewPoke(msg.sender, block.timestamp, to);
  }

  function fetchInteractionsPaginated(
    address addr,
    uint256 cursor,
    uint256 howMany
  ) public view returns (address[] memory valueset, uint256 newCursor) {
    uint256 length = howMany;
    if (length > interactions[addr].length - cursor) {
      length = interactions[addr].length - cursor;
    }

    address[] memory values = new address[](length);
    for (uint256 i = 0; i < length; i++) {
      values[i] = interactions[addr][cursor + i];
    }

    return (values, cursor + length);
  }

  function getInteractionsForAddress(address addr)
    public
    view
    returns (address[] memory)
  {
    return interactions[addr];
  }

  function checkForPoke(address poker, address recipient)
    public
    view
    returns (bool)
  {
    return pokeMap[recipient][poker];
  }
}
