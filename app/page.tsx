import Image from "next/image";
import DemoPage from "./data_table/page";
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h2 className="font-bold text-2xl">Welcome to our PFC Management Tool</h2>
      <Button variant = "destructive" className = "mt-10">
        <Link href="/data_table">Data Table</Link>
      </Button>
      <Button variant = "destructive" className = "mt-10 ml-10">
        <Link href="/chart">Chart</Link>
      </Button>
      <Button variant = "destructive" className = "mt-10 ml-10">
        <Link href="/add-data">Add new PFC</Link>
      </Button>
    </div>
  );
}


