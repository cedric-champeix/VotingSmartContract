# DApp de Vote

Ce projet consiste à créer une application décentralisée (**DApp**) de vote via un contrat intelligent Solidity, destinée à une petite organisation. Le système de vote est simple et transparent : les votants sont préalablement enregistrés dans une liste blanche et peuvent proposer de nouvelles idées lors d'une session dédiée, puis voter sur les propositions lors de la session de vote.

## Contexte et Objectifs

L'objectif principal est de développer un contrat intelligent de vote respectant les règles suivantes :

- **Transparence :** Le vote n'est pas confidentiel pour les utilisateurs ajoutés à la liste blanche.
- **Visibilité :** Chaque votant peut consulter les votes des autres.
- **Décision à la majorité simple :** La proposition ayant obtenu le plus grand nombre de votes l'emporte.
- **Quorum :** Un pourcentage minimal de participation est requis pour que le vote soit valide.
- **Blacklistage des abstentionnistes :** Les votants qui n'ont pas participé à un vote sont exclus du prochain scrutin, tandis que ceux qui étaient blacklistés précédemment retrouvent leur droit de vote.

Ce projet s'adresse à une petite organisation dont les votants sont préalablement identifiés par leurs adresses Ethereum.

## Fonctionnalités

- **Liste Blanche (Whitelist) :**  
  L'administrateur peut ajouter des adresses Ethereum afin d'autoriser uniquement les votants connus à participer.

- **Enregistrement des Propositions :**  
  Pendant la session d'enregistrement, les votants peuvent proposer de nouvelles idées.

- **Session de Vote :**  
  Lors de la session de vote, chaque votant peut consulter l'ensemble des propositions et voter pour celle de son choix.

- **Détermination du Gagnant :**  
  La proposition qui reçoit le plus de votes l'emporte.

- **Quorum :**  
  Un pourcentage minimal de participation est requis pour valider le vote.

- **Gestion des Abstentionnistes :**  
  Les votants qui n'ont pas participé à un scrutin sont blacklistés pour le prochain vote. Ceux qui étaient blacklistés lors du vote précédent retrouvent leur droit de vote.

## Processus de Vote

Le déroulement global du vote se fait en plusieurs étapes :

1. **Inscription des Votants :**  
   L'administrateur inscrit les votants sur la liste blanche.

2. **Enregistrement des Propositions :**  
   Les votants soumettent leurs propositions lors de la période d'enregistrement.

3. **Session de Vote :**  
   Pendant la période de vote, chaque votant peut consulter les propositions et voter.

4. **Vérification du Quorum :**  
   Si le nombre de votes enregistrés est inférieur au quorum requis, le vote est invalide.

5. **Décompte et Déclaration du Gagnant :**  
   Si le quorum est atteint, la proposition avec le plus de votes est déclarée gagnante.

## Architecture du Projet

Le projet repose sur :

- **Backend :** Hardhat pour le développement, le test et le déploiement du contrat Solidity.
- **Frontend :** Web3.js pour l'interaction avec la blockchain depuis l'interface utilisateur.
- **Blockchain :** Réseau Ethereum (testnet/local via Hardhat).

## Contributeurs

-[VILLET Téo](https://github.com/teovlt)  
-[DEMÉ Gabin](https://github.com/Onibagg/Onibagg)  
-[CHAMPEIX Cédric](https://github.com/cedric-champeix)

## Vidéo démo

**CLIQUEZ SUR L'IMAGE POUR ACCÉDER À LA VIDÉO DE DÉMONSTRATION :**

[![DApp de Vote](/client/public/images/logo-padding.png)](https://youtu.be/dMRIWz_rd_U)
