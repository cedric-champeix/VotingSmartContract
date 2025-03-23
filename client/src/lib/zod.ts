import { z } from "zod";

export const newProposalSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const newVoterSchema = z.object({
  address: z.string(),
});