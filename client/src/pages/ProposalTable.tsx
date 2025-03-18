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

export type Proposal = {
  description: string;
  voteCount: number;
};

export function ProposalTable() {
  const [proposals, setProposals] = React.useState<Proposal[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  async function fetchProposals() {
    //TODO: Récupérer les propositions depuis l'API
    return [];
  }

  React.useEffect(() => {
    fetchProposals();
  }, []);

  const columns: ColumnDef<Proposal>[] = [
    {
      id: 'description',
      header: 'Description',
      cell: (cell) => <div>{cell.getValue() as string}</div>,
    },
    {
      id: 'voteCount',
      header: 'Nombre de votes',
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
      <h1 className='text-4xl'>Liste des votes</h1>
      <div className='flex w-full items-center justify-between py-4'>
        <div className='flex gap-4 items-center'>
          <Input
            placeholder='Rechercher une proposition...'
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
                  Aucun vote trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Separator />
        <div className='flex flex-col items-center justify-between gap-4 p-4 md:flex-row'>
          <div className='text-sm text-gray-600'>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> sur <strong>{table.getPageCount()}</strong> •{' '}
            {proposals.length} entrées au total
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
                <SelectValue placeholder='Lignes'>
                  {table.getState().pagination.pageSize === proposals.length
                    ? 'Tout afficher'
                    : `${table.getState().pagination.pageSize} par page`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} par page
                  </SelectItem>
                ))}
                <SelectItem value='Infinity'>Tout afficher</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
