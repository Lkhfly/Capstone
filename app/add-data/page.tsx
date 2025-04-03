"use client"
//new imports
import {db} from "../firebase/config";
import { collection, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
//imports 
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { useState } from "react";
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
  // Task ID
  {
    accessorKey: "priority_score",
    header: ({ column }) => {
      return (
        <Button
          variant = "ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex justify-center w-full"
        >
          Calculations
        </Button>
      )
    },
  },
  {
    accessorKey: "rank",
    header: ({ column }) => {
      return (
        <Button
          variant = "ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
  {
    id: "actions",
    cell: ({ row, table}) => {
      const task = row.original
      const [isPopoverOpen, setIsPopoverOpen] = useState(false);
      const [dateComp, setDateComp] = useState<string>(task.date_comp || '');
      
      // Function to delete task from Firestore
      const handleDelete = async () => {
        if (!task.uid) {
          console.error("No UID found for task!");
          return;
        }

        const confirmDelete = window.confirm(`Delete "${task.title}"?`);
        if (!confirmDelete) return;

        try {
          const taskQuery = query(collection(db, "pfc"), where("uid", "==", task.uid));
          const querySnapshot = await getDocs(taskQuery);

          if (querySnapshot.empty) {
            console.error("No matching document found for UID:", task.uid);
            return;
          }

          const docToDelete = querySnapshot.docs[0].ref;
          await deleteDoc(docToDelete);

        } catch (error) {
          console.error("Error deleting task:", error);
        }
      };

      // Function to update task status in Firestore
      const updateStatus = async (newStatus: string) => {
        if (!task.uid) {
          console.error("No UID found for task!");
          return;
        }

        try {
          const taskQuery = query(collection(db, "pfc"), where("uid", "==", task.uid));
          const querySnapshot = await getDocs(taskQuery);

          if (querySnapshot.empty) {
            console.error("No matching document found for UID:", task.uid);
            return;
          }

          const docToUpdate = querySnapshot.docs[0].ref;
          await updateDoc(docToUpdate, {
            status: newStatus,
            ...(newStatus === "Completed" && !task.date_comp && { 
              date_comp: new Date().toISOString().split('T')[0] 
            })
          });

        } catch (error) {
          console.error("Error updating task status:", error);
        }
      };

      // Function to update completion date in Firestore
      const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDateComp(newDate);
        
        if (!task.uid) return;
        
        try {
          const taskQuery = query(collection(db, "pfc"), where("uid", "==", task.uid));
          const querySnapshot = await getDocs(taskQuery);

          if (querySnapshot.empty) {
            console.error("No matching document found for UID:", task.uid);
            return;
          }

          const docToUpdate = querySnapshot.docs[0].ref;
          await updateDoc(docToUpdate, {
            date_comp: newDate
          });

        } catch (error) {
          console.error("Error updating completion date:", error);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsPopoverOpen(true)}>
                View PFC ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Separate Popover outside of dropdown */}
          {isPopoverOpen && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setIsPopoverOpen(false)}
            >
              <div 
                className="bg-white dark:bg-slate-800 w-[85vw] max-w-4xl h-[80vh] max-h-[80vh] overflow-y-auto rounded-lg shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button in absolute position at top right */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-4 right-4 h-8 w-8 rounded-full p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </Button>
                
                <div className="p-6">
                  {/* Centered header */}
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-medium">PFC Details</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Detailed information about this PFC
                    </p>
                  </div>
                  
                  {/* Content with improved spacing and styling */}
                  <div className="grid gap-6 max-w-2xl mx-auto">
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">PFC ID:</span>
                      <span className="col-span-2 text-sm font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded">{task.uid}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">Title:</span>
                      <span className="col-span-2 text-sm">{task.title}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="col-span-2 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.status === "Completed" ? "bg-green-100 text-green-800" :
                          task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {task.status}
                        </span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">Submitted:</span>
                      <span className="col-span-2 text-sm">{task.date_sub}</span>
                    </div>
                    {task.status === "Completed" && (
                      <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                        <span className="text-sm font-medium">Completed:</span>
                        <div className="col-span-2">
                          <input
                            type="date"
                            value={dateComp}
                            onChange={handleDateChange}
                            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"
                          />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">Type of PFC</span>
                      <div className="col-span-2 flex flex-wrap gap-2 justify-center text-center">
                        {task.category.map((cat, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">Description:</span>
                      <span className="col-span-2 text-sm">{task.description}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="text-sm font-medium">Why it's important</span>
                      <span className="col-span-2 text-sm">{task.important}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 8v4l3 3"></path>
                            </svg>
                            Change Status
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateStatus("Submitted")}>
                            Submitted
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus("In Progress")}>
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus("Completed")}>
                            Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {
                          navigator.clipboard.writeText(task.uid);
                          // Optional: show a small toast or feedback
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        </svg>
                        Copy PFC ID
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )
    },
  },
]