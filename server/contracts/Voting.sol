// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting
 * @dev A decentralized voting system that allows voters to register, submit proposals, and vote on them.
 *      The contract is managed by an owner who controls the different stages of the voting process.
 */
contract Voting is Ownable {
    /**
     * @dev Enum representing the different phases of the voting workflow.
     * - `VotersRegisteration`: The phase where voters can be registered.
     * - `ProposalsRegistrationStart`: The phase where proposals can be submitted.
     * - `ProposalsRegistrationEnd`: The phase where proposal submission ends.
     * - `VotingSessionStart`: The phase where voting begins.
     * - `VotingSessionEnd`: The phase where voting ends.
     * - `VotesTallied`: The phase where votes are counted and the winner is determined.
     */
    enum WorkflowStatus {
        VotersRegisteration,
        ProposalsRegistrationStart,
        ProposalsRegistrationEnd,
        VotingSessionStart,
        VotingSessionEnd,
        VotesTallied
    }

    /**
     * @dev Struct representing a voter.
     */
    struct Voter {
        bool isRegistered;  ///< Indicates whether the voter is registered.
        bool hasVoted;      ///< Indicates whether the voter has already voted.
        uint votedProposalId; ///< The ID of the proposal the voter has voted for.
    }

    /**
     * @dev Struct representing a proposal.
     */
    struct Proposal {
        string description; ///< The textual description of the proposal.
        uint voteCount; ///< The number of votes the proposal has received.
    }

    WorkflowStatus public workflowStatus; ///< The current status of the voting process.
    Proposal[] public proposals; ///< List of all registered proposals.
    mapping(address => Voter) public voters; ///< Mapping of registered voters and their details.
    uint public winningProposalId; ///< The ID of the winning proposal after vote tallying.

    // === EVENTS ===
    /**
     * @dev Event emitted when a voter is successfully registered.
     * @param voterAddress The address of the registered voter.
     */
    event VoterRegistered(address voterAddress);

    /**
     * @dev Event emitted when the workflow status changes.
     * @param previousStatus The previous status of the workflow.
     * @param newStatus The new status of the workflow.
     */
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /**
     * @dev Event emitted when a proposal is successfully registered.
     * @param proposalId The ID of the registered proposal.
     */
    event ProposalRegistered(uint proposalId);

    /**
     * @dev Event emitted when a voter casts a vote.
     * @param voter The address of the voter.
     * @param proposalId The ID of the proposal voted for.
     */
    event Voted(address voter, uint proposalId);

    modifier onlyRegisteredVoter {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }

    // === ADMIN ACTIONS ===
    /**
     * @dev Registers a voter by their address.
     * @param _address The Ethereum address of the voter to register.
     */
    function registerVoter(address _address) external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotersRegisteration, "Voter registration not open");
        require(!voters[_address].isRegistered, "Voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    /**
     * @dev Starts the proposal registration phase.
     */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotersRegisteration, "Cannot start proposals registration now");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStart;
        emit WorkflowStatusChange(WorkflowStatus.VotersRegisteration, workflowStatus);
    }

    /**
     * @dev Ends the proposal registration phase.
     */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStart, "Proposals registration not started");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnd;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStart, workflowStatus);
    }

    /**
     * @dev Starts the voting session.
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnd, "Proposals registration not ended");
        workflowStatus = WorkflowStatus.VotingSessionStart;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnd, workflowStatus);
    }

    /**
     * @dev Ends the voting session.
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStart, "Voting session not started");
        workflowStatus = WorkflowStatus.VotingSessionEnd;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStart, workflowStatus);
    }

    /**
     * @dev Tallies votes and determines the winning proposal.
     */
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
    /**
     * @dev Adds a new proposal.
     * @param _description The description of the proposal.
     */
    function addProposal(string memory _description) external onlyRegisteredVoter {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStart, "Proposals registration not started");
        proposals.push(Proposal({ description: _description, voteCount: 0 }));
        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @dev Allows a registered voter to vote for a proposal.
     * @param proposalId The ID of the proposal to vote for.
     */
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
    /**
     * @dev Returns the list of all proposals.
     * @return An array of Proposal structs containing description and vote count.
     */
    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    /**
     * @dev Returns voter details for a given address.
     * @param _address The Ethereum address of the voter.
     * @return A Voter struct containing registration status, voting status, and voted proposal ID.
     */
    function getVoter(address _address) external view returns (Voter memory) {
        return voters[_address];
    }

    /**
     * @dev Returns the details of the winning proposal after votes have been tallied.
     * @return A Proposal struct containing the winning proposal's description and vote count.
     */
    function getWinningProposal() external view returns (Proposal memory) {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Votes not tallied yet");
        return proposals[winningProposalId];
    }
}
