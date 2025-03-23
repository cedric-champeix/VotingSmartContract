'use client';

import { useState, useCallback } from 'react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Check, Copy, MoreHorizontal, PlusCircle, RefreshCw, Vote } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import useProposal from '@/hooks/useProposal';
import useVoter from '@/hooks/useVoter';
import { useAccount, useWriteContract } from 'wagmi';
import { contractABI, contractAddress } from '@/constants';
import { hardhat } from 'wagmi/chains';
import { useWorkflowStatus, WorkflowStatus } from '@/hooks/useWorkflowStatus';
import type { Proposal } from '@/hooks/useProposal';
import ProposalDialog from './Proposals/components/ProposalDialog';
import useWinningProposal from '@/hooks/useWinningProposal';

export function ProposalTable() {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const { data: voter, refetch: refetchVoter } = useVoter();
  const { data: proposals, refetch: refetchProposals } = useProposal();
  const { data: workflowStatus } = useWorkflowStatus();
  const { data: winningProposal } = useWinningProposal();

  const [selectedVoteId, setSelectedVoteId] = useState<number | null>(null);
  const [confirmVoteOpen, setConfirmVoteOpen] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const handleVote = useCallback(() => {
    if (voter?.hasVoted || selectedVoteId === null) return;

    writeContract(
      {
        address: contractAddress,
        abi: contractABI.abi,
        functionName: 'vote',
        chain: hardhat,
        chainId: 31337,
        account: account.address,
        args: [selectedVoteId],
      },
      {
        onSuccess: () => {
          refetchVoter();
          refetchProposals();
          toast.success(`Vote soumis pour ${proposals[selectedVoteId]?.title}`, {
            description: 'Votre vote a été enregistré avec succès',
            position: 'top-center',
          });
          setSelectedVoteId(null);
          setConfirmVoteOpen(false);
        },
        onError: (error) => {
          toast.error('Échec du vote', {
            description: error.message,
            position: 'top-center',
          });
          setConfirmVoteOpen(false);
        },
      }
    );
  }, [account.address, proposals, refetchProposals, refetchVoter, selectedVoteId, voter?.hasVoted, writeContract]);

  const columnHelper = createColumnHelper<Proposal>();

  const columns: ColumnDef<Proposal>[] = [
    columnHelper.accessor('title', {
      header: 'Titre',
      cell: (cell) => <div className='font-medium'>{cell.getValue()}</div>,
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (cell) => <div className='max-w-md truncate'>{cell.getValue()}</div>,
    }),
    columnHelper.accessor('voteCount', {
      header: 'Nombre de votes',
      cell: (cell) => (
        <Badge variant='outline' className='flex items-center gap-1.5 w-fit'>
          <span>{Number(cell.getValue()) || '0'} </span>
          <span className='text-primary'>🗳️</span>
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const index = row.index;
        const isVoted = voter?.hasVoted && Number(voter?.votedProposalId) === index;
        const isSelected = selectedVoteId === index;

        if (isVoted) {
          return (
            <Badge className='bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex items-center gap-1.5'>
              <Check className='w-3 h-3' />
              Voté
            </Badge>
          );
        } else if (isSelected) {
          return (
            <Badge variant='secondary' className='flex items-center gap-1.5'>
              Sélectionné
            </Badge>
          );
        } else {
          return (
            <Badge variant='secondary' className='flex items-center gap-1.5'>
              Non voté
            </Badge>
          );
        }
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const index = row.index;
        const proposal = row.original;
        const canVote = !voter?.hasVoted && workflowStatus === WorkflowStatus.VotingSessionStart;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Ouvrir le menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              {canVote ? (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedVoteId(index);
                    setConfirmVoteOpen(true);
                  }}
                  className='text-primary flex items-center gap-2'
                >
                  <Vote className='w-4 h-4' />
                  Voter pour cette proposition
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className='text-muted-foreground' disabled>
                  <Vote className='w-4 h-4' />
                  Vous avez déjà voté
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: proposals,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full p-6 md:p-8 lg:p-10'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Propositions</h1>
        {workflowStatus === WorkflowStatus.VotesTallied && winningProposal && (
          <div className='max-w-2xl mx-auto mt-8 p-6 bg-gradient-to-r from-green-100/60 to-green-200/60 dark:from-green-900/40 dark:to-green-800/40 border border-green-300 dark:border-green-700 rounded-3xl shadow-xl flex items-center gap-5 relative overflow-hidden'>
            <div className='flex-shrink-0 bg-green-500 dark:bg-green-600 p-3 rounded-full shadow-md'>
              <Check className='w-6 h-6 text-white' />
            </div>
            <div>
              <h3 className='text-xl font-bold text-green-700 dark:text-green-100 mb-1'>🎉 Proposition gagnante</h3>
              <p className='text-lg text-green-800 dark:text-green-200 mb-1'>{winningProposal.title}</p>
              <p className='text-sm text-green-700 dark:text-green-300'>{Number(winningProposal.voteCount)} votes</p>
            </div>
          </div>
        )}

        {voter?.hasVoted && (
          <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-100 p-4 rounded-lg mt-4 flex items-center gap-3'>
            <div className='bg-green-100 dark:bg-green-800 rounded-full p-1'>
              <Check className='w-4 h-4 text-green-600 dark:text-green-300' />
            </div>
            <div>
              <p className='font-medium'>Merci pour votre vote</p>
              <p className='font-bold'>{proposals[voter?.votedProposalId]?.title}</p>
            </div>
          </div>
        )}
      </div>

      <div className='flex flex-col md:flex-row w-full items-center justify-between py-4 gap-4'>
        <div className='flex gap-4 items-center w-full md:w-auto'>
          <Input
            placeholder='Rechercher des propositions...'
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <Button variant='outline' onClick={() => refetchProposals()}>
            <RefreshCw className='w-4 h-4' />
            <span className='sr-only'>Actualiser</span>
          </Button>
        </div>

        <div className='flex items-center gap-4'>
          {workflowStatus === WorkflowStatus.ProposalsRegistrationStart && (
            <ProposalDialog refetchProposals={refetchProposals}></ProposalDialog>
          )}

          {!voter?.hasVoted && workflowStatus === WorkflowStatus.VotingSessionStart && selectedVoteId !== null && (
            <Button onClick={() => setConfirmVoteOpen(true)} className='bg-primary hover:bg-primary/90 text-primary-foreground'>
              Soumettre le vote
            </Button>
          )}
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={
                    voter?.votedProposalId === row.index
                      ? 'bg-green-50/50 dark:bg-green-900/10'
                      : selectedVoteId === row.index
                        ? 'bg-primary/5'
                        : undefined
                  }
                  onClick={() => {
                    if (!voter?.hasVoted && workflowStatus === WorkflowStatus.VotingSessionStart) {
                      setSelectedVoteId(row.index);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Aucune proposition trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Separator />
        <div className='flex flex-col items-center justify-between gap-4 p-4 md:flex-row'>
          <div className='text-sm text-muted-foreground'>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> sur <strong>{table.getPageCount()}</strong> •{' '}
            {proposals.length} propositions au total
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              Première
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Précédente
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Suivante
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Dernière
            </Button>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(value === 'Infinity' ? proposals.length : Number(value))}
            >
              <SelectTrigger className='w-36'>
                <SelectValue placeholder='Lignes par page'>
                  {table.getState().pagination.pageSize === proposals.length
                    ? 'Afficher tout'
                    : `${table.getState().pagination.pageSize} par page`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} par page
                  </SelectItem>
                ))}
                <SelectItem value='Infinity'>Afficher tout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <AlertDialog open={confirmVoteOpen} onOpenChange={setConfirmVoteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer votre vote</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir voter pour <strong>{selectedVoteId !== null ? proposals[selectedVoteId]?.title : ''}</strong> ? Cette
              action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleVote} className='bg-primary text-primary-foreground'>
              Confirmer le vote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
