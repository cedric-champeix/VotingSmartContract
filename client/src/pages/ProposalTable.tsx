'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

import { createPublicClient, http } from 'viem';
import { localhost } from 'viem/chains';
import constants from '@/constants/index';

export type Proposal = {
  description: string;
  voteCount: number;
};

export function ProposalTable() {
  const { t } = useTranslation();
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const client = createPublicClient({
    chain: localhost,
    transport: http('http://127.0.0.1:8545'),
  });

  async function fetchProposals() {
    try {
      const value = await client.readContract({
        address: constants.contractAddress,
        abi: constants.contractAbi,
        functionName: 'getProposals',
      });

      console.log('Contract value:', value);
      // Si value est un tableau de propositions, tu peux les mettre à jour ici
      setProposals(value);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  }

  React.useEffect(() => {
    fetchProposals();
  }, []);

  const columns: ColumnDef<Proposal>[] = [
    {
      id: 'description',
      header: t('table.votes.collumn.desc'),
      cell: (cell) => <div>{cell.getValue() as string}</div>,
    },
    {
      id: 'voteCount',
      header: t('table.votes.collumn.voteCount'),
      cell: (cell) => <div>{cell.getValue() as number}</div>,
    },
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
    <div className='w-full p-16'>
      <h1 className='text-4xl'>{t('table.votes.title')}</h1>
      <div className='flex w-full items-center justify-between py-4'>
        <div className='flex gap-4 items-center'>
          <Input
            placeholder={t('table.votes.searchProposal')}
            value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
            className='max-w-sm'
          />
          <Button variant='outline' onClick={() => fetchProposals()}>
            <RefreshCw className='w-4 h-4' />
          </Button>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  {t('table.votes.content.noVoteFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Separator />
        <div className='flex flex-col items-center justify-between gap-4 p-4 md:flex-row'>
          <div className='text-sm text-gray-600'>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> {t('table.votes.footer.pageNb')}{' '}
            <strong>{table.getPageCount()}</strong> • {proposals.length} {t('table.votes.footer.totalPage')}
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              {t('table.votes.footer.button.first')}
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              {t('table.votes.footer.button.previous')}
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {t('table.votes.footer.button.next')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {t('table.votes.footer.button.last')}
            </Button>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(value === 'Infinity' ? proposals.length : Number(value))}
            >
              <SelectTrigger className='w-36'>
                <SelectValue placeholder='Lignes'>
                  {table.getState().pagination.pageSize === proposals.length
                    ? t('table.votes.footer.select.displayAll')
                    : `${table.getState().pagination.pageSize} ${t('table.votes.footer.select.perPage')}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} {t('table.votes.footer.select.perPage')}
                  </SelectItem>
                ))}
                <SelectItem value='Infinity'>{t('table.votes.footer.select.displayAll')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
