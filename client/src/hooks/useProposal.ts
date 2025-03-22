import { useState, useEffect } from "react";
import { readContract, writeContract } from "@wagmi/core";
import { useAccount, useConfig } from 'wagmi'

import { contractABI, contractAddress } from "@/constants/index";

export type Proposal = {
  title: string;
  description: string;
  voteCount: number;
};

export type ProposalFragment = {
  title: string;
  description: string;
};

export default function useProposal() {
  const account = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const config = useConfig();

  useEffect(() => {
    getProposals();
  }, [account]);

  const getProposals = async () => {
    const proposals = await readContract(config, {
      abi: contractABI.abi,
      address: contractAddress,
      functionName: 'getProposals',
      chainId: 31337
    });

    console.log('Contract value:', proposals);
    setProposals(proposals as Proposal[]);
  }

  const createProposal = async ({title, description}: ProposalFragment) => {
    try {
      const result = await writeContract(config, {
        abi: contractABI.abi,
        address: contractAddress,
        functionName: 'addProposal',
        args: [
          title,
          description,
        ],
        chain: undefined,
        account: account.address
      })

      getProposals();
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  }

  return { proposals, getProposals, createProposal };
}
  