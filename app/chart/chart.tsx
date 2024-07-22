"use client"
import React, { PureComponent, useEffect, useState } from 'react';
import { PieChart, Pie, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,TooltipProps, Label,ZAxis, ZAxisProps, ResponsiveContainer } from 'recharts';
import {
    ValueType,
    NameType,
} from 'recharts/types/component/DefaultTooltipContent';
import { getData } from '../firebase/config';
import { Task } from '../data_table/columns';


export default function Example() {
    const [data, setData] = useState(Array<Task >)
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

    const data01 = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        { name: 'Group C', value: 300 },
        { name: 'Group D', value: 200 },
        { name: 'Group E', value: 278 },
        { name: 'Group F', value: 189 },
    ];

    const data02 = [
        { name: 'Group A', value: 2400 },
        { name: 'Group B', value: 4567 },
        { name: 'Group C', value: 1398 },
        { name: 'Group D', value: 9800 },
        { name: 'Group E', value: 3908 },
        { name: 'Group F', value: 4800 },
    ];

const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<ValueType, NameType>) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`ID: ${payload[0].payload.uid}`}</p>
                    <p>{`Priority: ${payload[0].payload.priority}`}</p>
                    <p>{`Budget: ${payload[0].payload.budget}`}</p>
                </div>
            );
        }
        return null;
    };
    return (
        <div>
      <ResponsiveContainer width={800} height={400}>
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
            <Label value="Effort" offset={10} position="left" angle={-90} className='font-bold'/>
          </YAxis>
          <ZAxis type="number" dataKey="priority" name="priority" range = {[30,100]}>
          </ZAxis>
          <Tooltip content={<CustomTooltip />}cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="A school" data={data} fill="#8884d8" />
        </ScatterChart>
          <PieChart width={400} height={400}>
              <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={data01}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
              />
              <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
              <Tooltip />
          </PieChart>
          <PieChart width={400} height={400}>
              <Pie
                  dataKey="value"
                  isAnimationActive={false}
                  data={data01}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
              />
              <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
              <Tooltip />
          </PieChart>
      </ResponsiveContainer>


        </div>
    );
  }
