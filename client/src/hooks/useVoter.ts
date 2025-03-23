import { contractABI, contractAddress } from "@/constants";
import { useAccount, useReadContract } from "wagmi";
import type { UseReadContractReturnType } from "wagmi";

export type Voter = {
  isRegistered: boolean;
  hasVoted: boolean;
  lastCycleVoted: number;
  votedProposalId: number;
}

export default function useVoter(): Omit<UseReadContractReturnType, 'data'> & { data: Voter } {
  const account = useAccount();
  
  const res = useReadContract({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'getVoter',
    scopeKey: 'voters',
    account: account?.address,
    args: [account?.address],
  });
  

  return {
    ...res,
    data: res.data as Voter ?? undefined
  };
}