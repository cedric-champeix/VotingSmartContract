import { z } from "zod";

export const newProposalSchema = z.object({
  title: z.string(),
  description: z.string(),
});