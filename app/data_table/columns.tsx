"use client"

//imports 
import { ColumnDef } from "@tanstack/react-table"
 import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Shape of data
export type Task = {
  id: string
  budget: number
  status: "Submitted" | "Under Review" | "Approved" | "Declined"
  department: string,
  priority : number
  impact : number
  effort : number
  type: string,
  pie : number, 
  description : string
}

export const columns: ColumnDef<Task>[] = [

  // Task ID
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant = "destructive"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-1"
        >
          Task ID
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-0"
        >
          Status
        </Button>
      )
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  
        >
          Department
        </Button>
      )
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-1"
        >
        Type
        </Button>
      )
    },
  },

// Weighted
  {
    accessorKey: "pie",
    header: ({ column }) => {
      return (
        <Button
          variant="default"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-0"
        >
        PIE Score
        </Button>
      )
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-0"
        >
        Priority
        </Button>
      )
    },
  },
  {
    accessorKey: "impact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-0"
        >
        Impact
        </Button>
      )
    },
  },
  {
    accessorKey: "effort",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-0"
        >
        Effort
        </Button>
      )
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
<Popover >
  <PopoverTrigger className="ml-12">Description</PopoverTrigger>
  <PopoverContent>To view Description in detail, please check out Task Details</PopoverContent>
</Popover>

      )
    },
  },
  {
    accessorKey: "budget",
    header: ({ column }) => {
      return (
        <Button
          variant="default"
          className="ml-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >Budget
        </Button>
      )
    },
    cell: ({ row }) => {
      const budget = parseFloat(row.getValue("budget"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(budget)
 
      return <div className="text-center font-medium">{formatted}</div>

    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const task = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(task.id)}
            >
              Copy PFC ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View PFC details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
