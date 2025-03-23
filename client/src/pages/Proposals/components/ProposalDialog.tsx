import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormLabel, FormItem, FormControl } from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { newProposalSchema } from "@/lib/zod";
import { Input } from "@/components/ui/input";
import { useAccount, useWriteContract } from "wagmi";
import { contractABI, contractAddress } from "@/constants";
import { hardhat } from "wagmi/chains";

export default function ProposalDialog({refetchProposals}) {
  const { t } = useTranslation();

  const account = useAccount();
  const { writeContract } = useWriteContract();
  
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newProposalSchema>>({
    resolver: zodResolver(newProposalSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const createProposal = (data: z.infer<typeof newProposalSchema>) => {
      writeContract({
        address: contractAddress,
        abi: contractABI.abi,
        functionName: "addProposal",
        scopeKey: "proposals",
        chain: hardhat,
        chainId: 31337,
        account: account.address,
        args: [data.title, data.description],
      }, {
        onSuccess: () => {
          refetchProposals();
        }
      });
  
      setOpen(false);
    }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="dark:hover:bg-accent hover:bg-accent">
        {t("proposal.createProposal")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[625px]'>
          <DialogHeader>
            <DialogTitle>{t("proposal.dialog.title")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createProposal)} className='space-y-8'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("proposal.dialog.titleLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder='Your title' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("proposal.dialog.descriptionLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder='Your description' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type='submit'>{t("proposal.dialog.create")}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}