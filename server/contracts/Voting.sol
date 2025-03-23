// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

/**
 * @title Voting
 * @dev A decentralized voting system that allows voters to register, submit proposals, and vote on them.
 *      The contract is managed by an owner who controls the different stages of the voting process.
 */
contract Voting is Ownable {
    /**
     * @dev Enum representing the different phases of the voting workflow.
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
     * @param isRegistered Indicates whether the voter is registered.
     * @param hasVoted Indicates whether the voter has already voted.
     * @param lastCycleVoted The cycle number of the last vote.
     * @param votedProposalId The ID of the proposal the voter has voted for.
     */
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint64 lastCycleVoted;
        uint votedProposalId;
    }

    /**
     * @dev Struct representing a proposal.
     * @param title The title of the proposal.
     * @param description The textual description of the proposal.
     * @param voteCount The number of votes the proposal has received.
     */
    struct Proposal {
        string title;
        string description;
        uint voteCount;
    }

    /**
     * @dev Struct representing a vote.
     * @param cycle The cycle number of the vote.
     * @param winningProposalId The ID of the winning proposal.
     * @param minQuorumPercentage The minimum percentage of votes required for a proposal to win.
     * @param voteCanceled Indicates whether the vote has been canceled.
     */
    struct Vote {
        uint64 cycle;
        uint32 winningProposalId;
        uint8 minQuorumPercentage;
        bool voteCanceled;
    }

    WorkflowStatus public workflowStatus = WorkflowStatus.VotersRegisteration; ///< The current status of the voting process.
    Proposal[] public proposals; ///< List of all registered proposals.
    mapping(address => Voter) public voters; ///< Mapping of registered voters and their details.
    Vote public currentVote; ///< The current vote details.

    constructor() Ownable(msg.sender) {
        console.log("Owner: %s", msg.sender);

        currentVote = Vote(0, 20, 0, false);
        voters[msg.sender].isRegistered = true;
    }

    // ===================== EVENTS =====================

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
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    /**
     * @dev Event emitted when a vote ends.
     * @param vote The vote that ended.
     * @param proposal The winning proposal.
     */
    event VoteEnd(Vote vote, Proposal proposal);

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

    modifier ensureValidVoter() {
        require(voters[msg.sender].isRegistered, "Voter is not registered");

        // The voter can't vote if he didn't vote in the previous cycle
        if (currentVote.cycle > 1) {
            if (voters[msg.sender].lastCycleVoted != currentVote.cycle - 1) {
                revert("Not eligible to vote in this cycle");
            }
        }
        _;
    }

    // ===================== ADMIN ACTIONS =====================

    /**
     * @dev Registers a voter by their address.
     * @param _address The Ethereum address of the voter to register.
     */
    function registerVoter(address _address) external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotersRegisteration,
            "Voter registration not open"
        );
        require(!voters[_address].isRegistered, "Voter already registered");
        voters[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    /**
     * @dev Starts the voter registration phase.
     */
    function startVoterRegistration() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotesTallied,
            "The previous vote has not been tallied yet"
        );

        proposals = new Proposal[](0);

        workflowStatus = WorkflowStatus.VotersRegisteration;
        emit WorkflowStatusChange(
            WorkflowStatus.VotersRegisteration,
            workflowStatus
        );
    }

    /**
     * @dev Starts the proposal registration phase.
     */
    function startProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotersRegisteration,
            "Cannot start proposals registration now"
        );

        workflowStatus = WorkflowStatus.ProposalsRegistrationStart;
        emit WorkflowStatusChange(
            WorkflowStatus.VotersRegisteration,
            workflowStatus
        );
    }

    /**
     * @dev Ends the proposal registration phase.
     */
    function endProposalsRegistering() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStart,
            "Proposals registration not started"
        );

        workflowStatus = WorkflowStatus.ProposalsRegistrationEnd;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStart,
            workflowStatus
        );
    }

    /**
     * @dev Starts the voting session.
     */
    function startVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationEnd,
            "Proposals registration not ended"
        );

        Vote storage _vote = currentVote;
        _vote.cycle++;
        _vote.voteCanceled = false;
        _vote.winningProposalId = 0;

        workflowStatus = WorkflowStatus.VotingSessionStart;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnd,
            workflowStatus
        );
    }

    /**
     * @dev Ends the voting session.
     */
    function endVotingSession() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStart,
            "Voting session not started"
        );

        workflowStatus = WorkflowStatus.VotingSessionEnd;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStart,
            workflowStatus
        );
    }

    /**
     * @dev Tallies votes and determines the winning proposal.
     */
    function tallyVotes() external onlyOwner {
        require(
            workflowStatus == WorkflowStatus.VotingSessionEnd,
            "Voting session not ended"
        );

        uint nbVotes = 0;
        uint winningVoteCount = 0;
        uint32 winningProposalId = 0;
        for (uint32 i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalId = i;
            }

            nbVotes += proposals[i].voteCount;
        }

        // Check if their was enough participants to validate the vote
        if (nbVotes >= ((nbVotes * currentVote.minQuorumPercentage) / 100)) {
            currentVote.winningProposalId = winningProposalId;
        } else {
            currentVote.winningProposalId = 0;
        }

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnd,
            workflowStatus
        );
        emit VoteEnd(currentVote, proposals[currentVote.winningProposalId]);
    }

    // ===================== VOTER ACTIONS =====================

    /**
     * @dev Adds a new proposal.
     * @param _title The title of the proposal.
     * @param _description The description of the proposal.
     */
    function addProposal(
        string memory _title,
        string memory _description
    ) external ensureValidVoter {
        require(
            workflowStatus == WorkflowStatus.ProposalsRegistrationStart,
            "Proposals registration not started"
        );

        proposals.push(Proposal(_title, _description, 0));
        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @dev Allows a registered voter to vote for a proposal.
     * @param proposalId The ID of the proposal to vote for.
     */
    function vote(uint proposalId) external ensureValidVoter {
        require(
            workflowStatus == WorkflowStatus.VotingSessionStart,
            "Voting session not started"
        );
        require(proposalId < proposals.length, "Invalid proposal");

        Voter storage voter = voters[msg.sender];
        require(!voter.hasVoted, "You have already voted");

        voter.hasVoted = true;
        voter.votedProposalId = proposalId;
        voter.lastCycleVoted = currentVote.cycle;

        proposals[proposalId].voteCount++;

        emit Voted(msg.sender, proposalId);
    }

    // ===================== VIEW FUNCTIONS =====================

    /**
     * @dev Returns the minimum quorum required for a proposal to win.
     * @return The minimum quorum value.
     */
    function getWinningQuorum() external view returns (uint) {
        return currentVote.minQuorumPercentage;
    }

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
        require(
            workflowStatus == WorkflowStatus.VotesTallied,
            "Votes not tallied yet"
        );

        return proposals[currentVote.winningProposalId];
    }

    /**
     * @dev Returns the current status of the voting workflow.
     * @return The current WorkflowStatus value.
     */
    function getWorkflowStatus() external view returns (WorkflowStatus) {
        return workflowStatus;
    }

    /**
     * @dev Returns whether the caller is the owner of the contract.
     * @return A boolean indicating whether the caller is the owner.
     */
    function isOwner() external view returns (bool) {
        return msg.sender == owner();
    }
}
