const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Voting Contract", function () {
  let Voting, voting, owner, voter, voter1, voter2, voter3, others;

  beforeEach(async () => {
    [owner, voter, voter1, voter2, voter3, ...others] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
    await voting.registerVoter(voter.address);

  });

  it("should not allow registering voter outside registration phase", async function () {
    await voting.connect(owner).startProposalsRegistering();
    await expect(voting.registerVoter(voter1.address)).to.be.revertedWith(
      "Voter registration not open"
    );
  });

  it("should revert if adding proposal when not in ProposalsRegistrationStart status", async function () {
    await expect(
      voting.connect(voter).addProposal("Title", "Description")
    ).to.be.revertedWith("Proposals registration not started");
  });

  it("should start in VotersRegisteration phase", async () => {
    expect(await voting.workflowStatus()).to.equal(0);
  });

  describe("Voter registration", function () {
    it("should register voters by owner only", async () => {
      await voting.registerVoter(voter1.address);
      const voter = await voting.getVoter(voter1.address);
      expect(voter.isRegistered).to.be.true;
    });

    it("should not register voters from non-owner", async () => {
      await expect(voting.connect(voter1).registerVoter(voter2.address)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should not register the same voter twice", async () => {
      await voting.registerVoter(voter1.address);
      await expect(voting.registerVoter(voter1.address)).to.be.revertedWith("Voter already registered");
    });
  });


  describe("getWinningQuorum function", function () {

    it("should return the correct minQuorumPercentage", async function () {
      // Let's assume `currentVote`'s `minQuorumPercentage` is set to 50% for this test
      const expectedQuorum = 0;  // Replace this with the actual expected value

      // Call the `getWinningQuorum` function
      const winningQuorum = await voting.getWinningQuorum();
      
      // Check if the returned value is the same as the expected value
      expect(winningQuorum).to.equal(expectedQuorum);
    });
  });

  describe("Proposal registration phase", function () {
    beforeEach(async () => {
      await voting.registerVoter(voter1.address);
      await voting.startProposalsRegistering();
    });

    it("should start proposal registration", async () => {
      expect(await voting.workflowStatus()).to.equal(1);
    });

    it("should allow registered voters to submit proposals", async () => {
      await voting.connect(voter1).addProposal("Proposal 1", "Desc 1");
      const proposals = await voting.getProposals();
      expect(proposals.length).to.equal(1);
      expect(proposals[0].title).to.equal("Proposal 1");
    });

    it("should not allow unregistered voters to add proposals", async () => {
      await expect(voting.connect(voter2).addProposal("Fail", "Fail")).to.be.revertedWith("Voter is not registered");
    });

    it("should end proposal registration", async () => {
      await voting.endProposalsRegistering();
      expect(await voting.workflowStatus()).to.equal(2);
    });
  });

  describe("Voting process", function () {
    beforeEach(async () => {
      await voting.registerVoter(voter1.address);
      await voting.registerVoter(voter2.address);
      await voting.registerVoter(voter3.address);
      await voting.startProposalsRegistering();
      await voting.connect(voter1).addProposal("Proposal 1", "Desc 1");
      await voting.connect(voter1).addProposal("Proposal 2", "Desc 2");
      await voting.endProposalsRegistering();
      await voting.startVotingSession();
    });

    it("should start voting session", async () => {
      expect(await voting.workflowStatus()).to.equal(3);
    });

    it("should allow voters to vote", async () => {
      await voting.connect(voter1).vote(0);
      const voter = await voting.getVoter(voter1.address);
      expect(voter.hasVoted).to.be.true;
      expect(voter.votedProposalId).to.equal(0);
    });

    it("should prevent double voting", async () => {
      await voting.connect(voter1).vote(0);
      await expect(voting.connect(voter1).vote(1)).to.be.revertedWith("You have already voted");
    });

    it("should not allow voting on invalid proposal", async () => {
      await expect(voting.connect(voter2).vote(999)).to.be.revertedWith("Invalid proposal");
    });

    it("should end voting session", async () => {
      await voting.endVotingSession();
      expect(await voting.workflowStatus()).to.equal(4);
    });
  });

  describe("Tallying votes", function () {
    beforeEach(async () => {
      await voting.registerVoter(voter1.address);
      await voting.registerVoter(voter2.address);
      await voting.startProposalsRegistering();
      await voting.connect(voter1).addProposal("Proposal A", "Description A");
      await voting.connect(voter1).addProposal("Proposal B", "Description B");
      await voting.endProposalsRegistering();
      await voting.startVotingSession();
      await voting.connect(voter1).vote(0);
      await voting.connect(voter2).vote(1);
      await voting.endVotingSession();
    });

    it("should tally votes and select a winner", async () => {
      await voting.tallyVotes();
      expect(await voting.workflowStatus()).to.equal(5);

      const winner = await voting.getWinningProposal();
      // There might be a tie; it will take the last highest
      expect(["Proposal A", "Proposal B"]).to.include(winner.title);
    });

    it("should revert getWinningProposal if not tallied yet", async () => {
      await expect(voting.getWinningProposal()).to.be.revertedWith("Votes not tallied yet");
    });
  });

  describe("Workflow transitions", function () {
    it("should revert starting proposals if not in voter registration phase", async () => {
      await voting.startProposalsRegistering();
      await expect(voting.startProposalsRegistering()).to.be.revertedWith("Cannot start proposals registration now");
    });

    it("should revert ending proposals if not started", async () => {
      await expect(voting.endProposalsRegistering()).to.be.revertedWith("Proposals registration not started");
    });

    it("should revert starting voting session if proposals not ended", async () => {
      await expect(voting.startVotingSession()).to.be.revertedWith("Proposals registration not ended");
    });

    it("should revert ending voting session if not started", async () => {
      await expect(voting.endVotingSession()).to.be.revertedWith("Voting session not started");
    });

    it("should revert tallyVotes if voting session not ended", async () => {
      await expect(voting.tallyVotes()).to.be.revertedWith("Voting session not ended");
    });
  });

  describe("Edge cases", function () {
    it("should not allow unregistered voter to vote", async () => {
      await voting.startProposalsRegistering();
      await voting.endProposalsRegistering();
      await voting.startVotingSession();
      await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Voter is not registered");
    });

    it("should emit proper events for workflow changes", async () => {
      await expect(voting.startProposalsRegistering())
        .to.emit(voting, "WorkflowStatusChange")
        .withArgs(0, 1);
    });
  });
});




