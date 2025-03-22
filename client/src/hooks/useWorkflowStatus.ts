import { useState, useEffect } from "react";
import { readContract, writeContract } from "@wagmi/core";
import { useAccount, useConfig } from 'wagmi'

import { contractABI, contractAddress } from "@/constants/index";

enum WorkflowStatus {
  VotersRegisteration,
  ProposalsRegistrationStart,
  ProposalsRegistrationEnd,
  VotingSessionStart,
  VotingSessionEnd,
  VotesTallied
}

export default function useWorkflowStatus() {
  const account = useAccount();
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>();

  const config = useConfig();

  useEffect(() => {
    getWorkflowStatus();
  }, [account]);

  const getWorkflowStatus = async () => {
    if (!account) return;

    const value = await readContract(config, {
      abi: contractABI.abi,
      address: contractAddress,
      functionName: 'getWorkflowStatus',
      chainId: 31337
    });

    console.log('Contract value:', value);
    setWorkflowStatus(value as WorkflowStatus);
  }

  const startNextWorkflow = async () => {
    try {
      if (!account) return;

      const { hash } = await writeContract(config, {
        abi: contractABI.abi,
        address: contractAddress,
        functionName: getNextWorkflow(),
        args: [],
        account: account.address
      });
      
      // getWorkflowStatus();
    } catch (error) {
      console.error('Error starting proposals registration:', error);
    }
  }

  const getNextWorkflow = () => {
    switch (workflowStatus) {
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

  return { workflowStatus, getWorkflowStatus, getNextWorkflow, startNextWorkflow };
}
  