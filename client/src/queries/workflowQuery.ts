import { useReadContract, UseReadContractReturnType } from 'wagmi';

import { contractABI, contractAddress } from "@/constants/index";
 
enum WorkflowStatus {
  VotersRegisteration,
  ProposalsRegistrationStart,
  ProposalsRegistrationEnd,
  VotingSessionStart,
  VotingSessionEnd,
  VotesTallied
}

export const useWorkflowStatusQuery = (): UseReadContractReturnType & {data: WorkflowStatus} => {
  const res =  useReadContract({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'getWorkflowStatus',
    scopeKey: 'workflowStatus',
  });

  console.log('Workflow status:', res.data);
  return res;
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