'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";

import useProposal from '@/hooks/useProposal';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Proposaldialog from "../Proposals/components/ProposalDialog";
import useVoter from "@/hooks/useVoter";
import { useAccount, useWriteContract } from "wagmi";
import { contractABI, contractAddress } from "@/constants";
import { hardhat } from "wagmi/chains";
import { useWorkflowStatus, WorkflowStatus } from "@/hooks/useWorkflowStatus";

export type Vote = {
  id: string;
  title: string;
  description: string;
  voteCount: number;
};

export const VoteForm = () => {
  const { t } = useTranslation();

  const account = useAccount();
  const { writeContract } = useWriteContract();
  const { data: voter, refetch: refetchVoter } = useVoter();
  const { data: proposals, refetch: refetchProposals } = useProposal();
  const { data: workflowStatus } = useWorkflowStatus();

  const [selectedVoteId, setSelectedVoteId] = useState<number | null>(null);

  const handleVote = () => {
    if (voter?.hasVoted)
      return;

    writeContract({
      address: contractAddress,
      abi: contractABI.abi,
      functionName: "vote",
      chain: hardhat,
      chainId: 31337,
      account: account.address,
      args: [selectedVoteId],
    }, {
      onSuccess: () => {
        refetchVoter();
        refetchProposals();
      }
    });

    setSelectedVoteId(null);
  };

  return (
    <div className="container mx-auto p-6 text-center relative">
      {workflowStatus === WorkflowStatus.ProposalsRegistrationStart && (<Proposaldialog refetchProposals={refetchProposals} />)}
      {voter?.hasVoted && (
        <div className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 p-4 rounded-md mb-6">
          {t("vote.thankYou")} {t("vote.for")} {proposals[voter?.votedProposalId]?.title}
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-5 text-primary">
        {t("vote.pageTitle")}
      </h1>
      <p className="text-secondary-foreground mb-10">
        {t("vote.pageSubtitle")}
      </p>
      { !voter?.hasVoted && selectedVoteId != null && (
        <div className="text-center bg-transname parent p-4 bottom-20">
          <Button onClick={handleVote} className="dark:hover:bg-accent hover:bg-accent">
            {t("vote.submit")}
          </Button>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {proposals.map((proposition, index) => (
          <Card
            key={index}
            className={`p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-800 cursor-pointer transition hover:bg-gray-100 ${
              voter?.votedProposalId === index || selectedVoteId === index ? "border-primary bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => {
              !voter?.hasVoted ? setSelectedVoteId(index) : undefined
            }}
          >
            <CardContent>
              <h2 className="text-xl text-primary dark:text-primary-foreground font-bold mb-2">{proposition.title}</h2>
              <p className="text-gray-400 mb-4">{proposition.description}</p>
              <p className="text-gray-500">Votes: {proposition.voteCount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VoteForm;
