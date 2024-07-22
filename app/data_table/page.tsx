"use client"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getData } from "../firebase/config";
import Home  from "../page"


export default async function DemoPage() {
  const data = await getData()
  return (

    <div className="container mx-auto py-10">
        <Home />
      <h2 className="font-bold text-2xl">Data Table of PFCs</h2>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
