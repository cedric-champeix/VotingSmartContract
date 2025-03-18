const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");

contract("Voting", (accounts) => {
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];

  beforeEach(async function () {
    this.voting = await Voting.new({ from: owner });
  });

  it("should allow the owner to register voters", async function () {
    await this.voting.registerVoter(voter1, { from: owner });
    const voter = await this.voting.voters(voter1);
    expect(voter.isRegistered).to.be.true;
  });

  it("should prevent non-owners from registering voters", async function () {
    await expectRevert(
      this.voting.registerVoter(voter2, { from: voter1 }),
      "Ownable: caller is not the owner"
    );
  });

  it("should emit an event when a voter is registered", async function () {
    const receipt = await this.voting.registerVoter(voter1, { from: owner });
    expectEvent(receipt, "VoterRegistered", { voterAddress: voter1 });
  });
});
