// import Example from "./chart"
// import { getData } from "../data_table/page"

// export default async function chart () {
// const data1 = [
//   { impact : 10, effort : 2, priority : 1 },
//   { impact : 2, effort : 3, priority : 5 },
//   { impact : 6, effort : 2, priority : 10},
// ];
//   const data = await getData()
//   console.log(data)
//   return (
//     <div className="container mx-auto py-10">
//       <h2 className="font-bold text-2xl">I'm chart</h2>
//       <Example data={data1}/>
//     </div>
//   )
// }

import React, { PureComponent } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label,ResponsiveContainer } from 'recharts';
import { getData } from "../data_table/page"
import Example from './chart';



export default function Chart() {
return (
  <div className="container mx-auto py-10">
    <p className = "font-bold">Effort x Impact Chart of all the PFCs</p>
    <Example />
    <p className = "font-light mt-2">(To be implemented : allow users able to choose and customize the axes)</p>
  </div>
)
  }

