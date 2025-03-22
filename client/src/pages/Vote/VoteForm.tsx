'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";

import useProposal from '@/hooks/useProposal';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Proposaldialog from "../Proposals/components/ProposalDialog";

export type Vote = {
  id: string;
  title: string;
  description: string;
  voteCount: number;
};

const fallbackProposals = [
  {
    id: "proposition1",
    title: "Proposition 1",
    description: "Vote for your favorite proposition",
    voteCount: 0,
  },
  {
    id: "proposition2",
    title: "Proposition 2",
    description: "Vote for your favorite proposition",
    voteCount: 1,
  },
  {
    id: "proposition3",
    title: "Proposition 3",
    description: "Vote for your favorite proposition",
    voteCount: 2,
  },
  {
    id: "proposition4",
    title: "Proposition 4",
    description: "Vote for your favorite proposition",
    voteCount: 0,
  },
  {
    id: "proposition5",
    title: "Proposition 5",
    description: "Vote for your favorite proposition",
    voteCount: 1,
  },
  {
    id: "proposition6",
    title: "Proposition 6",
    description: "Vote for your favorite proposition",
    voteCount: 2,
  }
];

export const VoteForm = () => {
  const { t } = useTranslation();

  const { proposals, createProposal } = useProposal();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  // const [propositions, setPropositions] = useState<Vote[]>(fallbackProposals);


  // const handleVote = () => {
  //   if (selectedOption) {
  //     setPropositions(prevPropositions =>
  //       prevPropositions.map((proposition) =>
  //         proposition.id === selectedOption
  //           ? { ...proposition, voteCount: proposition.voteCount + 1 }
  //           : proposition
  //       )
  //     );
  //     setVotedOption(selectedOption); // on "fixe" l'option votée
  //     setSubmitted(true);
  //   }
  // };

  return (
    <div className="container mx-auto p-6 text-center relative">
      <Proposaldialog createProposal={createProposal}/>
      {submitted && votedOption && (
        <div className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 p-4 rounded-md mb-6">
          {t("vote.thankYou")} {t("vote.for")} {proposals[0]?.title}
        </div>
      )}
      <h1 className="text-4xl font-extrabold mb-5 text-primary">
        {t("vote.pageTitle")}
      </h1>
      <p className="text-secondary-foreground mb-10">
        {t("vote.pageSubtitle")}
      </p>
      {selectedOption && !submitted && (
        <div className="text-center bg-transname parent p-4 bottom-20">
          <Button onClick={null} className="dark:hover:bg-accent hover:bg-accent">
            {t("vote.submit")}
          </Button>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {proposals.map((proposition, index) => (
          <Card
            key={index}
            className={`p-6 shadow-xl rounded-2xl bg-white dark:bg-gray-800 cursor-pointer transition hover:bg-gray-100 ${
              selectedOption === index ? "border-primary bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => setSelectedOption(index)}
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
