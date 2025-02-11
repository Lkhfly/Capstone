"use client"
//new imports
import {db} from "../firebase/config";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
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
    status: string,
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
    category : string[],
    description : string, 
    important : string, 
    uid : string, 
    priority_score : number
    rank : number
}

export const columns: ColumnDef<Task>[] = [

  // // Task ID
  // {
  //   accessorKey: "priority_score",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant = "ghost"
  //         // onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
  //         className="ml-2"
  //       >
  //         Priority score
  //       </Button>
  //     )
  //   },
  // },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          variant = "ghost"
          // onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
          className="flex justify-center w-full"
        >
          Rank
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
          className="flex justify-center w-full"
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
          className = "flex justify-center w-full"  
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
                    className="flex justify-center w-full"
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
          className="flex justify-center w-full"
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
                    className="flex justify-center w-full"
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
                    className="flex justify-center w-full"                    
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
                    className="flex justify-center w-full"
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
                    className="flex justify-center w-full"
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
    cell: ({ row, table}) => {
      const task = row.original
      // Function to delete task from Firestore
      // Function to delete task based on stored `uid`
      const handleDelete = async () => {
        if (!task.uid) {
          console.error("No UID found for task!");
          return;
        }

        const confirmDelete = window.confirm(`Delete "${task.title}"?`);
        if (!confirmDelete) return;

        try {
          // Query Firestore to find the document with the matching UID
          const taskQuery = query(collection(db, "pfc"), where("uid", "==", task.uid));
          const querySnapshot = await getDocs(taskQuery);

          if (querySnapshot.empty) {
            console.error("No matching document found for UID:", task.uid);
            return;
          }

          // Delete the first matching document (assuming UID is unique)
          const docToDelete = querySnapshot.docs[0].ref;
          await deleteDoc(docToDelete);
        } catch (error) {
          console.error("Error deleting task:", error);
        }
      };
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
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
