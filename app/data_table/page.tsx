import { columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "1",
      budget: 100,
      status: "Submitted",
      department : "Assembly",
      type : "Quality", 
      priority : 3, 
      impact : 5, 
      effort : 10,
      pie : 3 * 5 * 10,
    },
    {
      id: "2",
      budget: 200,
      status: "Under Review",
      department : "QA",
      type : "Quality",
      priority : 2, 
      impact : 3, 
      effort : 6,
      pie : 3 * 2 * 6,
    },
    {
      id: "3",
      budget: 13100,
      status: "Declined",
      department : "Manufacturing",
      type : "Defect",
      priority : 3, 
      impact : 2, 
      effort : 1,
      pie : 3 * 2 * 1,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 1, 
      impact : 8, 
      effort : 2,
      pie : 1*8*2,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Safety",
      priority : 3, 
      impact : 2, 
      effort : 2,
      pie : 3*2*2,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 1, 
      impact : 8, 
      effort : 2,
      pie : 1*8*2,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 5, 
      impact : 4, 
      effort : 2,
      pie : 40,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 3, 
      impact : 3, 
      effort : 3,
      pie : 9,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 2, 
      impact : 2, 
      effort : 2,
      pie : 6,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 3, 
      impact : 6, 
      effort : 1,
      pie : 18,
    },
    {
      id: "4",
      budget: 100,
      status: "Approved",
      department : "OA",
      type : "Throughput",
      priority : 4, 
      impact : 3, 
      effort : 1,
      pie : 12,
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h2 className="font-bold text-2xl">Data Table of PFCs</h2>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
