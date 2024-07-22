"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,TooltipProps, Label, ZAxis, ResponsiveContainer } from 'recharts';
import { getData } from '../firebase/config';
import { Task } from '../data_table/columns';

export default function Example() {
    const [data, setData] = useState<Task[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docSnap = await getData();
                setData(docSnap);
            } catch (error) {
                console.error("Error fetching the document: ", error);
            }
        };
        fetchData();
    }, []);

    const data01 = [
        { name: 'Safety', value: 400 },
        { name: 'Quality', value: 300 },
        { name: 'Throughput', value: 300 },
        { name: 'PIP', value: 200 },
    ];

    const data02 = [
        { name: 'In Progress', value: 2400 },
        { name: 'Complete', value: 4567 },
        { name: 'Will not implement', value: 1398 },
        { name: 'Future Consideration', value: 9800 },
        { name: 'Already exists', value: 3908 },
        { name: 'Needs Review', value: 4800 },
    ];

    const data03 = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
        { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
        { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
        { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    ];

    const renderCustomLabel = ({ name }: { name: string }) => name;

    const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
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
            <p className="font-bold">Effort x Impact Chart of all the PFCs</p>
            <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="impact" name="impact" ticks={[0, 2, 4, 6, 8, 10]} domain={[0, 10]} allowDuplicatedCategory={false}>
                        <Label value="Impact" offset={5} position="bottom" className='font-bold' />
                    </XAxis>
                    <YAxis type="number" dataKey="effort" name="effort" ticks={[0, 2, 4, 6, 8, 10]} domain={[0, 10]}>
                        <Label value="Effort" offset={10} position="left" angle={-90} className='font-bold' />
                    </YAxis>
                    <ZAxis type="number" dataKey="priority" name="priority" range={[30, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="A school" data={data} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>

            <p className="font-bold">PFC Volume Categorization</p>
            <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                    <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={data01}
                        cx="20%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={renderCustomLabel}
                    />
                    <Pie dataKey="value" data={data02} cx="70%" cy="50%" outerRadius={80} fill="#82ca9d" label={renderCustomLabel} />
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
            <p className="font-bold">Number of PFCs over the months</p>
            <ResponsiveContainer width="90%" height={500}>
            <BarChart
                    data={data03}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                >
                    <XAxis dataKey="name" scale="point" padding={{ left: 80, right: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="pv" fill="#8884d8" background={{ fill: '#eee' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
