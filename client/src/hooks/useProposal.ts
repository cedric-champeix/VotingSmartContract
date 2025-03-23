import { useAccount, useReadContract } from 'wagmi';
import type { UseReadContractReturnType } from 'wagmi';

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

export default function useProposal(): Omit<UseReadContractReturnType, 'data'> & { data: Proposal[] } {
  const account = useAccount();

  const res = useReadContract({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'getProposals',
    scopeKey: 'proposals',
    account: account?.address,
  });

  return {...res, data: res.data as Proposal[] ?? []};
}
