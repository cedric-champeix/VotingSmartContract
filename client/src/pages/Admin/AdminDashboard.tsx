import { Button } from "@/components/ui/button";
import { contractABI, contractAddress } from "@/constants";
import { useWorkflowStatusQuery, getNextWorkflow } from "@/queries/workflowQuery";
import { hardhat } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";

export default function AdminDashboard() {
  // const { workflowStatus, getNextWorkflow, startNextWorkflow } = useWorkflowStatus();

  const account = useAccount();
  const { data: workflowStatus } = useWorkflowStatusQuery();
  const { writeContract } = useWriteContract();
  

  const handleNextWorkflow = () => {
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
        <h2>Workflow Status: { workflowStatus }</h2>
      </div>
      <Button onClick={handleNextWorkflow}>Next workflow</Button>
    </div>
  );
}