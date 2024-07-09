"use client"
import { Task, columns } from "./columns"
import { DataTable } from "./data-table"
import { collection, getDocs } from "firebase/firestore"; 

import db from "../firebase/config";


export async function getData(): Promise<Task[]> {
  // Fetch data from your API here.
const querySnapshot = await getDocs(collection(db, "pfc"));
const return_stuff = []
querySnapshot.forEach((doc) => {
  console.log(`${doc.id} => ${doc.data()}`);
  return_stuff.push(doc.data())
});
if(typeof window !== 'undefined'){
  localStorage.setItem('data', return_stuff);
}
  return return_stuff
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
