"use client"
import React, { PureComponent, useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Label,ZAxis, ZAxisProps, ResponsiveContainer } from 'recharts';
import { getData } from "../data_table/page"
import { Task } from '../data_table/columns';


export default function Example() {
    const [data, setData] = useState()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const docSnap = await getData()
                setData(docSnap)
            } catch (error) {
                console.error("Error fetching the document: ", error);
            }
        };
        fetchData();
    }, []);


    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`ID: ${payload[0].payload.id}`}</p>
                    <p>{`Priority: ${payload[0].payload.priority}`}</p>
                </div>
            );
        }
        return null;
    };
    return (
      <ResponsiveContainer width={400} height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey="impact" name="impact"  ticks = {[0,2,4,6,8,10]} domain = {[0,10]} allowDuplicatedCategory={false}>
            <Label value="Impact" offset={5} position="bottom" className='font-bold'/>
          </XAxis>
          <YAxis type="number" dataKey="effort" name="effort" ticks = {[0,2,4,6,8,10]} domain = {[0,10]}>
            <Label value="Effort" offset={10} position="left" angle="-90" className='font-bold'/>
          </YAxis>
          <ZAxis type="number" dataKey="priority" name="priority" range = {[30,100]}>
          </ZAxis>
          <Tooltip content={<CustomTooltip />}cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }
