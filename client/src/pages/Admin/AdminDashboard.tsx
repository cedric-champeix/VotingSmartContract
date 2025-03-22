import { Button } from "@/components/ui/button";
import useWorkflowStatus from "@/hooks/useWorkflowStatus";

export default function AdminDashboard() {
  const { workflowStatus, getNextWorkflow, startNextWorkflow } = useWorkflowStatus();

  const handleNextWorkflow = () => {
    startNextWorkflow();
  }


  return (
    <div>
      <h1 className='text-4xl'>Admin Dashboard</h1>
      <div>
        <h2>Workflow Status: {workflowStatus}</h2>
      </div>
      <Button onClick={handleNextWorkflow}>Next workflow</Button>
    </div>
  );
}