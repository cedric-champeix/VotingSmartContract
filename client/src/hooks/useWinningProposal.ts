import { contractABI, contractAddress } from '@/constants';
import { useAccount, useReadContract } from 'wagmi';

import type { UseReadContractReturnType } from 'wagmi';
import type { Proposal } from './useProposal';

export default function useWinningProposal(): Omit<UseReadContractReturnType, 'data'> & { data: Proposal | undefined } {
  const account = useAccount();

  const res = useReadContract({
    address: contractAddress,
    abi: contractABI.abi,
    functionName: 'getWinningProposal',
    scopeKey: 'winningProposal',
    account: account?.address,
  });

  return { ...res, data: (res.data as Proposal) ?? undefined };
}
