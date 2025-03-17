// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import 'hardhat/console.sol';
struct Voter {
    bool isRegistered;
    bool hasVoted;
    uint votedProposalId;
}
struct Proposal {
    string description;
    uint voteCount;
}
