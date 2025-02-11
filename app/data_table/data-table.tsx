"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Task } from "./columns.jsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
const [data, setData] = React.useState(initialData);
  // Priority Mapping
  const categoryPriority: Record<string, number> = {
    safety: 4,
    pipcost: 3,
    quality: 2,
    throughput: 1,
  };

    // Function to Rank PFCs
  const rankPFCs = () => {
    const sortedData = [...data].sort((a: any, b: any) => {
      // Ensure category is an array, or default to an empty array
      const aCategories = Array.isArray(a.category) ? a.category : [];
      const bCategories = Array.isArray(b.category) ? b.category : [];
      // Get the highest priority category for both items
      const highestPriorityA = Math.max(
        ...(aCategories.map((cat: string) => categoryPriority[cat.toLowerCase()] || 0) || [0])
      );
      const highestPriorityB = Math.max(
        ...(bCategories.map((cat: string) => categoryPriority[cat.toLowerCase()] || 0) || [0])
      );

      // First sort by the highest category priority (e.g., "safety" > "cost")
      if (highestPriorityA !== highestPriorityB) {
        return highestPriorityB - highestPriorityA; // Highest priority first
      }

      // If categories are the same, sort by priority score
      return (b.priority_score || 0) - (a.priority_score || 0);
    });

    // Add ranking numbers to the sorted data
    const rankedData = sortedData.map((item, index) => ({
      ...item,
      rank: index + 1, // Add rank starting from 1
    }));

    // Update the table's data state
    setData(rankedData);
  };
  // // Define columns (add a rank column)
  // const columnsWithRank: ColumnDef<TData, TValue>[] = [
  //   {
  //     accessorKey: "rank",
  //     header: "Rank",
  //     cell: ({ row }) => <span>{row.original.rank}</span>,
  //   },
  //   ...columns, // Include all other columns
  // ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <Button variant="link" size="sm" onClick={rankPFCs}>
  Rank PFCs
</Button>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by status..."
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("status")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by department..."
          value={(table.getColumn("department")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("department")?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-3"
        />
        <Input
          placeholder="Filter by type..."
          value={(table.getColumn("category")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("category")?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-3"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader className = "bg-slate-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody >
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"} 
              >
                {row.getVisibleCells().map((cell) => 
                  {

                    // Custom rendering for "type" and "status" columns
          if (cell.column.id === "category") {
            const categories = cell.getValue();
            if (!Array.isArray(categories)) return null;
            const categoryColors: Record<string, string> = {
              safety: "bg-red-500",
              quality: "bg-green-500",
              throughput: "bg-yellow-500",
              cost: "bg-orange-500",
            };

            return (
              <TableCell key={cell.id} className="text-center">
                <div className="flex flex-col space-y-1">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center">
                      <span className={`w-2 h-2 ${categoryColors[category] || "bg-gray-500"} rounded-full mr-2`}></span>
                      <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </TableCell>
            );
          }
                    if (cell.column.id === "status") {
                      const status = cell.getValue() as string;
                      let bgColor = "";
                      if (status === "In Progress") {
                        bgColor = "bg-green-100 text-green-800";
                      } else if (status === "Awaiting Review") {
                        bgColor = "bg-yellow-100 text-yellow-800";
                      } else if (status === "Reviewed") {
                        bgColor = "bg-red-100 text-red-800";
                      }
                      return (
                        <TableCell key={cell.id} className="text-center">
                          <div className={`${bgColor} px-2 py-1 rounded-full`}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </div>
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h- text-center line-clamp-1">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
