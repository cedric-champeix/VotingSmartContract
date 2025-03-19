const { expect } = require("chai");
const { ethers } = require("hardhat");
const { expectRevert } = require('@openzeppelin/test-helpers');


describe("Voting Contract", function () {
  let Voting, voting, owner, voter1, voter2, addr1;

  beforeEach(async function () {
    [owner, voter1, voter2, addr1] = await ethers.getSigners();
    Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  it("Should register a voter and emit event", async function () {
    await expect(voting.connect(owner).registerVoter(voter1.address))
      .to.emit(voting, "VoterRegistered")
      .withArgs(voter1.address);

    const voterInfo = await voting.getVoter(voter1.address);
    expect(voterInfo.isRegistered).to.be.true;
  });

  it("Should not register a voter if not owner", async function () {
    await expect(
      voting.connect(voter1).registerVoter(voter2.address)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should go through workflow and emit correct events", async function () {
    await expect(voting.connect(owner).startProposalsRegistering())
      .to.emit(voting, "WorkflowStatusChange")
      .withArgs(0, 1);

    await expect(voting.connect(owner).endProposalsRegistering())
      .to.emit(voting, "WorkflowStatusChange")
      .withArgs(1, 2);

    await expect(voting.connect(owner).startVotingSession())
      .to.emit(voting, "WorkflowStatusChange")
      .withArgs(2, 3);

    await expect(voting.connect(owner).endVotingSession())
      .to.emit(voting, "WorkflowStatusChange")
      .withArgs(3, 4);
  });

  it("Should add a proposal and emit event", async function () {
    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(owner).startProposalsRegistering();

    await expect(
      voting.connect(voter1).addProposal("Proposal 1")
    )
      .to.emit(voting, "ProposalRegistered")
      .withArgs(0);

    const proposals = await voting.getProposals();
    expect(proposals[0].description).to.equal("Proposal 1");
  });

  it("Should allow registered voter to vote", async function () {
    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(owner).startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.connect(owner).endProposalsRegistering();
    await voting.connect(owner).startVotingSession();

    await expect(voting.connect(voter1).vote(0))
      .to.emit(voting, "Voted")
      .withArgs(voter1.address, 0);

    const proposal = (await voting.getProposals())[0];
    expect(proposal.voteCount).to.equal(1);
  });

  it("Should tally votes and set winner", async function () {
    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(owner).registerVoter(voter2.address);
    await voting.connect(owner).startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.connect(voter2).addProposal("Proposal 2");
    await voting.connect(owner).endProposalsRegistering();
    await voting.connect(owner).startVotingSession();
    await voting.connect(voter1).vote(1); // Vote for Proposal 2
    await voting.connect(voter2).vote(1); // Vote for Proposal 2
    await voting.connect(owner).endVotingSession();

    await expect(voting.connect(owner).tallyVotes())
      .to.emit(voting, "WorkflowStatusChange")
      .withArgs(4, 5);

    const winningProposal = await voting.getWinningProposal();
    expect(winningProposal.description).to.equal("Proposal 2");
    expect(winningProposal.voteCount).to.equal(2);
  });

  it("Should revert voting if voter has already voted", async function () {
    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(owner).startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.connect(owner).endProposalsRegistering();
    await voting.connect(owner).startVotingSession();

    await voting.connect(voter1).vote(0);
    await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("You have already voted");
  });

  it("Should revert if trying to vote with invalid proposal", async function () {
    await voting.connect(owner).registerVoter(voter1.address);
    await voting.connect(owner).startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.connect(owner).endProposalsRegistering();
    await voting.connect(owner).startVotingSession();

    await expect(voting.connect(voter1).vote(99)).to.be.revertedWith("Invalid proposal");
  });

  it("Should revert adding proposal if not in proposal registration phase", async function () {
    await voting.connect(owner).registerVoter(voter1.address);
    await expect(
      voting.connect(voter1).addProposal("Test")
    ).to.be.revertedWith("Proposals registration not started");
  });

  it("Should revert getting winner if not tallied yet", async function () {
    await expect(voting.getWinningProposal()).to.be.revertedWith("Votes not tallied yet");
  });
});

describe("Voting Branch Tests", function () {
  let voting, owner, voter1, voter2;

  beforeEach(async () => {
    [owner, voter1, voter2] = await ethers.getSigners();
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  it("should revert registering voter when not in registration phase", async () => {
    await voting.startProposalsRegistering();
    await expect(voting.registerVoter(voter1.address)).to.be.revertedWith("Voter registration not open");
  });

  it("should revert registering already registered voter", async () => {
    await voting.registerVoter(voter1.address);
    await expect(voting.registerVoter(voter1.address)).to.be.revertedWith("Voter already registered");
  });

  it("should revert start proposals registration in wrong phase", async () => {
    await voting.startProposalsRegistering();
    await voting.endProposalsRegistering();
    await expect(voting.startProposalsRegistering()).to.be.revertedWith("Cannot start proposals registration now");
  });

  it("should revert end proposals registration in wrong phase", async () => {
    await expect(voting.endProposalsRegistering()).to.be.revertedWith("Proposals registration not started");
  });

  it("should revert start voting session in wrong phase", async () => {
    await expect(voting.startVotingSession()).to.be.revertedWith("Proposals registration not ended");
  });

  it("should revert end voting session in wrong phase", async () => {
    await expect(voting.endVotingSession()).to.be.revertedWith("Voting session not started");
  });

  it("should revert tally votes in wrong phase", async () => {
    await expect(voting.tallyVotes()).to.be.revertedWith("Voting session not ended");
  });

  it("should revert add proposal in wrong phase", async () => {
    await voting.registerVoter(voter1.address);
    await expect(voting.connect(voter1).addProposal("Proposal 1")).to.be.revertedWith("Proposals registration not started");
  });

  it("should revert voting if already voted", async () => {
    await voting.registerVoter(voter1.address);
    await voting.startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.endProposalsRegistering();
    await voting.startVotingSession();
    await voting.connect(voter1).vote(0);
    await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("You have already voted");
  });

  it("should revert voting if not in voting session", async () => {
    await voting.registerVoter(voter1.address);
    await voting.startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.endProposalsRegistering();
    // on n’a pas startVotingSession ici
    await expect(voting.connect(voter1).vote(0)).to.be.revertedWith("Voting session not started");
  });

  it("should revert voting on invalid proposal id", async () => {
    await voting.registerVoter(voter1.address);
    await voting.startProposalsRegistering();
    await voting.connect(voter1).addProposal("Proposal 1");
    await voting.endProposalsRegistering();
    await voting.startVotingSession();
    await expect(voting.connect(voter1).vote(999)).to.be.revertedWith("Invalid proposal");
  });

  it("should revert getWinningProposal if votes not tallied yet", async () => {
    await expect(voting.getWinningProposal()).to.be.revertedWith("Votes not tallied yet");
  });
  
});