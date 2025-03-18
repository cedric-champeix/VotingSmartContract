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
    Proposal[] public proposals;

    WorkflowStatus public workflowStatus;

    uint public winningProposalId;
    address public administator;
    mapping(address => Voter) public voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    modifier onlyRegisteredVoter {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }

    function registerVoter(address _address) external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotersRegisteration, "Voters registration is not allowed at this time");
        require(!voters[_address].isRegistered, "Voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    function vote(uint proposal) public onlyRegisteredVoter{
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "Voter already voted");
        require(workflowStatus == WorkflowStatus.VotingSessionStart, "Voting session is not allowed at this time");

    }



}
