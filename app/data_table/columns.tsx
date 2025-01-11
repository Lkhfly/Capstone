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
    title : string, 
    station : string,
    date_sub : string,
    date_comp : string,
    emp_name : string,
    gm_id : string,
    job : string,
    department : string,
    group : number,
    shift_number : number,
    team : number,
    recurring : string,
    frequency : string,
    category : string,
    description : string,
    important : string,
    budget : number,
    uid : string, 
    status : string
}

export const columns: ColumnDef<Task>[] = [

  // Task ID
  {
    accessorKey: "uid",
    header: ({ column }) => {
      return (
        <Button
          variant = "ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-2"
        >
          Task ID
        </Button>
      )
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-1 pl-6"
        >
          Title
        </Button>
      )
    },
  },
  {
    accessorKey: "date_sub",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className = "ml-4"  
        >
          Date Submitted
        </Button>
      )
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-5"
        >
        Type
        </Button>
      )
    },
  },

// Weighted
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="ml-1"
        >
        Status
        </Button>
      )
    },
  },
  {
    accessorKey: "group",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-2"
        >
        Group
        </Button>
      )
    },
  },
  {
    accessorKey: "team",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-1"
        >
        Team
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
                    className="ml-2"
        >
        Department
        </Button>
      )
    },
  },
  {
    accessorKey: "station",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="ml-1"
        >
        Station
        </Button>
      )
    },
  },
//   {
//     accessorKey: "description",
//     header: ({ column }) => {
//       return (
// <Popover >
//   <PopoverTrigger className="ml-12">Description</PopoverTrigger>
//   <PopoverContent>To view Description in detail, please check out Task Details</PopoverContent>
// </Popover>

//       )
//     },
//   },
  // {
  //   accessorKey: "budget",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         className="ml-5"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >Budget
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     const budget = parseFloat(row.getValue("budget"))
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(budget)
 
  //     return <div className="text-center font-medium">{formatted}</div>

  //   },
  // },
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
              onClick={() => navigator.clipboard.writeText(task.uid)}
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
