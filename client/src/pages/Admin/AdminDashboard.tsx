import { Button } from "@/components/ui/button";
import { contractABI, contractAddress } from "@/constants";
import useIsOwner from "@/hooks/useIsOwner";
import { useWorkflowStatus, getNextWorkflow } from "@/hooks/useWorkflowStatus";
import { hardhat } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";

export default function AdminDashboard() {
  const account = useAccount();
  const { data: workflowStatus } = useWorkflowStatus();
  const { writeContract } = useWriteContract();
  const { data: isOwner } = useIsOwner();
  

  const handleNextWorkflow = () => {
    console.log("Account to write:", account);
    console.log("Next workflow:", getNextWorkflow(workflowStatus));

    writeContract({
      address: contractAddress,
      abi: contractABI.abi,
      functionName: getNextWorkflow(workflowStatus),
      scopeKey: 'workflowStatus',
      chain: hardhat,
      account: account.address
    });
  }

  return (
    <div>
      <h1 className='text-4xl'>Admin Dashboard</h1>
      <div>
        <h2>Is Owner: { isOwner ? 'Yes' : 'No' }</h2>
      </div>
      <div>
        <h2>Workflow Status: { `${workflowStatus}` } </h2>
      </div>
      <Button onClick={handleNextWorkflow}>Next workflow</Button>
    </div>
  );
}