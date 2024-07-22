import Image from "next/image";
import DemoPage from "./data_table/page";
import { Button } from "@/components/ui/button"
import Link from "next/link"


    const Home =() =>{
        return (
            <div className="container mx-auto py-10">
                <h1 className="font-bold text-2xl">GM PFC Management Tool</h1>
                <Button  className = "mt-10 bg-blue-950">
                    <Link href="/data_table">Data Table</Link>
                </Button>
                <Button  className = "mt-10 ml-10 bg-blue-950">
                    <Link href="/chart">Chart</Link>
                </Button>
                <Button  className = "mt-10 ml-10 bg-blue-950">
                    <Link href="/add-data">Add new PFC</Link>
                </Button>
            </div>
        );
    }




export default Home;
