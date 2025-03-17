// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable{

    enum WorkflowStatus {
        VotersRegisteration,
        ProposalsRegistrationStart,
        ProposalsRegistrationEnd,
        VotingSessionStart,
        VotingSessionEnd,
        CountVotes
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }

    function registerVoter(address _address) external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotersRegisteration, "Voters registration is not allowed at this time");
        require(!voters[_address].isRegistered, "Voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

}
