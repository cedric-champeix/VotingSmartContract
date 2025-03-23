// 'use client';

// import { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Check, ChevronRight, Vote } from 'lucide-react';

// import useProposal from '@/hooks/useProposal';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import Proposaldialog from '../Proposals/components/ProposalDialog';
// import useVoter from '@/hooks/useVoter';
// import { useAccount, useWriteContract } from 'wagmi';
// import { contractABI, contractAddress } from '@/constants';
// import { hardhat } from 'wagmi/chains';
// import { useWorkflowStatus, WorkflowStatus } from '@/hooks/useWorkflowStatus';
// import { Badge } from '@/components/ui/badge';
// import { cn } from '@/lib/utils';

// export const VoteForm = () => {
//   const { t } = useTranslation();
//   const account = useAccount();
//   const { writeContract } = useWriteContract();
//   const { data: voter, refetch: refetchVoter } = useVoter();
//   const { data: proposals, refetch: refetchProposals } = useProposal();
//   const { data: workflowStatus } = useWorkflowStatus();
//   const [selectedVoteId, setSelectedVoteId] = useState<number | null>(null);

//   const handleVote = () => {
//     if (voter?.hasVoted) return;

//     writeContract(
//       {
//         address: contractAddress,
//         abi: contractABI.abi,
//         functionName: 'vote',
//         chain: hardhat,
//         chainId: 31337,
//         account: account.address,
//         args: [selectedVoteId],
//       },
//       {
//         onSuccess: () => {
//           refetchVoter();
//           refetchProposals();
//         },
//       }
//     );

//     setSelectedVoteId(null);
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-b from-primary/5 to-background dark:from-primary/10 dark:to-background'>
//       <div className='container mx-auto px-4 py-12 max-w-7xl'>
//         {workflowStatus === WorkflowStatus.ProposalsRegistrationStart && <Proposaldialog refetchProposals={refetchProposals} />}

//         <header className='text-center mb-16'>
//           <div className='inline-block mb-4 p-2 rounded-full bg-primary/10'>
//             <Vote className='w-8 h-8 text-primary' />
//           </div>
//           <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3'>{t('vote.pageTitle')}</h1>
//           <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>{t('vote.pageSubtitle')}</p>
//         </header>

//         <AnimatePresence>
//           {voter?.hasVoted && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0 }}
//               className='max-w-xl mx-auto mb-12'
//             >
//               <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 p-6 rounded-xl shadow-sm'>
//                 <div className='flex items-center gap-3'>
//                   <div className='bg-green-100 dark:bg-green-800 rounded-full p-1.5'>
//                     <Check className='w-5 h-5 text-green-600 dark:text-green-300' />
//                   </div>
//                   <div>
//                     <p className='font-medium'>
//                       {t('vote.thankYou')} {t('vote.for')}
//                     </p>
//                     <p className='font-bold text-lg'>{proposals[voter?.votedProposalId]?.title}</p>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className='grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
//           {proposals.map((proposal, index) => {
//             const isSelected = selectedVoteId === index;
//             const isVoted = voter?.votedProposalId === index;

//             return (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.05 }}
//                 whileHover={{ y: -5 }}
//               >
//                 <Card
//                   onClick={() => !voter?.hasVoted && setSelectedVoteId(index)}
//                   className={cn(
//                     'h-full cursor-pointer border-2 transition-all duration-200',
//                     isSelected || isVoted ? 'border-primary shadow-lg shadow-primary/10' : 'border-transparent hover:border-primary/30',
//                     voter?.hasVoted && !isVoted && 'opacity-70'
//                   )}
//                 >
//                   <CardContent className='p-6 h-full flex flex-col'>
//                     <div className='flex justify-between items-start mb-4'>
//                       <h2 className='text-xl font-bold text-foreground'>{proposal.title}</h2>
//                       {(isSelected || isVoted) && (
//                         <div className='bg-primary text-primary-foreground rounded-full p-1'>
//                           <Check className='w-4 h-4' />
//                         </div>
//                       )}
//                     </div>

//                     <p className='text-muted-foreground mb-6 flex-grow'>{proposal.description}</p>

//                     <div className='flex items-center justify-between mt-auto'>
//                       <Badge variant='outline' className='flex items-center gap-1.5'>
//                         <span className='text-primary'>🗳️</span>
//                         <span>
//                           {proposal.voteCount || 0} {t('votes')}
//                         </span>
//                       </Badge>

//                       {!voter?.hasVoted && (
//                         <Button
//                           variant='ghost'
//                           size='sm'
//                           className={cn('text-muted-foreground', isSelected && 'text-primary')}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setSelectedVoteId(index);
//                           }}
//                         >
//                           {isSelected ? 'Séléctionné' : 'Voter'}
//                         </Button>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>

//         <AnimatePresence>
//           {!voter?.hasVoted && selectedVoteId !== null && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               className='fixed bottom-8 left-0 right-0 z-50 flex justify-center'
//             >
//               <Button
//                 size='lg'
//                 onClick={handleVote}
//                 className='px-8 py-6 rounded-full shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 group'
//               >
//                 {t('vote.submit')}
//                 <ChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-1' />
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default VoteForm;
