import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { hardhat } from "viem/chains";
import { useAccount, useWriteContract } from "wagmi";
import { z } from "zod";
import { newVoterSchema } from "@/lib/zod";

import { contractABI, contractAddress } from "@/constants";

export default function VoterDialog() {
  const { t } = useTranslation();
  
  const account = useAccount();
  const { writeContract } = useWriteContract();

  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newVoterSchema>>({
    resolver: zodResolver(newVoterSchema),
    defaultValues: {
      address: '',
    },
  });

  const createVoter = (data: z.infer<typeof newVoterSchema>) => {
    writeContract({
      address: contractAddress,
      abi: contractABI.abi,
      functionName: "registerVoter",
      chain: hardhat,
      chainId: 31337,
      account: account.address,
      args: [data.address],
    });

    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="dark:hover:bg-accent hover:bg-accent">
        {t("voter.createVoter")}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='sm:max-w-[625px]'>
          <DialogHeader>
            <DialogTitle>{t("voter.dialog.title")}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(createVoter)} className='space-y-8'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("voter.dialog.addressLabel")}</FormLabel>
                    <FormControl>
                      <Input placeholder='Your title' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type='submit'>{t("voter.dialog.create")}</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}