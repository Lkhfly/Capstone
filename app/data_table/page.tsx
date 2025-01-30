export const dynamic = "force-dynamic";
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getData } from "../firebase/config";
import NavBar from "@/components/ui/navbar";


export default async function DemoPage() {
  const data = await getData()
  return (
    <div>
    <NavBar />
    <div className="container mx-auto py-5">
        
      <h2 className="font-bold text-2xl mb-5">Data Table of PFCs</h2>
      <DataTable columns={columns} data={data} />
    </div>
    </div>
  )
}
