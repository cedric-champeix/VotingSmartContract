// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {

    enum WorkflowStatus {
        VotersRegisteration,
        ProposalsRegistrationStart,
        ProposalsRegistrationEnd,
        VotingSessionStart,
        VotingSessionEnd,
        VotesTallied
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

    WorkflowStatus public workflowStatus;
    Proposal[] public proposals;
    mapping(address => Voter) public voters;
    uint public winningProposalId;

    // Events
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);

    modifier onlyRegisteredVoter {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }

    // === ADMIN ACTIONS ===

    function registerVoter(address _address) external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotersRegisteration, "Voter registration not open");
        require(!voters[_address].isRegistered, "Voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotersRegisteration, "Cannot start proposals registration now");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStart;
        emit WorkflowStatusChange(WorkflowStatus.VotersRegisteration, workflowStatus);
    }

    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStart, "Proposals registration not started");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnd;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStart, workflowStatus);
    }

    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnd, "Proposals registration not ended");
        workflowStatus = WorkflowStatus.VotingSessionStart;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnd, workflowStatus);
    }

    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStart, "Voting session not started");
        workflowStatus = WorkflowStatus.VotingSessionEnd;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStart, workflowStatus);
    }

    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnd, "Voting session not ended");
        uint winningVoteCount = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnd, workflowStatus);
    }

    // === VOTER ACTIONS ===

    function addProposal(string memory _description) external onlyRegisteredVoter {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStart, "Proposals registration not started");
        proposals.push(Proposal({ description: _description, voteCount: 0 }));
        emit ProposalRegistered(proposals.length - 1);
    }

    function vote(uint proposalId) external onlyRegisteredVoter {
        Voter storage sender = voters[msg.sender];
        require(!sender.hasVoted, "You have already voted");
        require(workflowStatus == WorkflowStatus.VotingSessionStart, "Voting session not started");
        require(proposalId < proposals.length, "Invalid proposal");

        sender.hasVoted = true;
        sender.votedProposalId = proposalId;
        proposals[proposalId].voteCount++;
        emit Voted(msg.sender, proposalId);
    }

    // === VIEW FUNCTIONS ===

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getVoter(address _address) external view returns (Voter memory) {
        return voters[_address];
    }

    function getWinningProposal() external view returns (Proposal memory) {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        return proposals[winningProposalId];
    }
}
