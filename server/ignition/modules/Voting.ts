import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const storageModule = buildModule('Voting', (m: any) => {
  const voting = m.contract('Voting');

  return { voting };
});

export default storageModule;
