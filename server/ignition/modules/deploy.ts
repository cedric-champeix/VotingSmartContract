import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Déploiement du contrat avec le compte:", deployer.address);

  const Voting = await ethers.getContractFactory("Voting");

  const votingContract = await Voting.deploy();

  return await votingContract.getAddress();
}

// Exécuter le script
main()
  .then((contractAddress) => {
    console.log("Adresse du contrat déployé:", contractAddress);
  })
  .catch((error) => {
    console.error("Erreur lors du déploiement:", error);
    process.exitCode = 1;
  });
