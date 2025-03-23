import { useAccount, useReadContract, UseReadContractReturnType } from 'wagmi';

import { contractABI, contractAddress } from "@/constants/index";
 
export enum WorkflowStatus {
  VotersRegisteration,
  ProposalsRegistrationStart,
  ProposalsRegistrationEnd,
  VotingSessionStart,
  VotingSessionEnd,
  VotesTallied
}

export const useWorkflowStatus = (): Omit<UseReadContractReturnType, 'data'> & { data: WorkflowStatus | undefined } => {
  const account = useAccount();

  const res = useReadContract({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'getWorkflowStatus',
    scopeKey: 'workflowStatus',
    account: account?.address,
  });

  console.log('Workflow status:', res.data);
  return { ...res, data: (res.data as WorkflowStatus) ?? undefined };
};

export const getNextWorkflow = (currentWorkflow: WorkflowStatus) => {
  switch (currentWorkflow) {
    case WorkflowStatus.VotersRegisteration:
      return 'startProposalsRegistering';
    case WorkflowStatus.ProposalsRegistrationStart:
      return 'endProposalsRegistering';
    case WorkflowStatus.ProposalsRegistrationEnd:
      return 'startVotingSession';
    case WorkflowStatus.VotingSessionStart:
      return 'endVotingSession';
    case WorkflowStatus.VotingSessionEnd:
      return 'tallyVotes';
    default:
      return 'startVoterRegistration';
  }
}