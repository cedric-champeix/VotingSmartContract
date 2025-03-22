import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const storageModule = buildModule('MyVotingModule', (m: any) => {
  const storage = m.contract('Voting');

  return { storage };
});

export default storageModule;
