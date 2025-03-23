import { contractABI, contractAddress } from "@/constants";
import { useAccount, useReadContract, UseReadContractReturnType } from "wagmi";

export default function useIsOwner(): Omit<UseReadContractReturnType, 'data'> & { data: boolean | undefined } {

  const account = useAccount();

  const result = useReadContract({
    abi: contractABI.abi,
    address: contractAddress,
    functionName: 'isOwner',
    chainId: 31337,
    account: account?.address,
  });

  return {
    ...result,
    data: Boolean(result.data) ?? undefined,
  };
}