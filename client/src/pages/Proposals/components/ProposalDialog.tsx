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
import { ProposalFragment } from "@/hooks/useProposal";

export type ProposalProps = {
  createProposal: (proposal: ProposalFragment) => void;
};

export default function ProposalDialog({createProposal}: ProposalProps) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newProposalSchema>>({
    resolver: zodResolver(newProposalSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const proposalSubmit = (data: z.infer<typeof newProposalSchema>) => {
    createProposal({title: data.title ?? "", description: data.description ?? ""});
    setOpen(false);
  };

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
            <form onSubmit={form.handleSubmit(proposalSubmit)} className='space-y-8'>
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