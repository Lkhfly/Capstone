"use client";
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Legend, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps, Label, ZAxis, ResponsiveContainer, Cell } from 'recharts';
import { getData } from '../firebase/config';
import { Task } from '../data_table/columns';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

export default function Example() {
    const [data, setData] = useState<Task[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docSnap = await getData();
                console.log("Fetched Data: ", docSnap);
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
        { name: 'Jan', uv: 4000, pfc: 2400, amt: 2400 },
        { name: 'Feb', uv: 3000, pfc: 1398, amt: 2210 },
        { name: 'Mar', uv: 2000, pfc: 9800, amt: 2290 },
        { name: 'Apr', uv: 2780, pfc: 3908, amt: 2000 },
        { name: 'May', uv: 1890, pfc: 4800, amt: 2181 },
        { name: 'Jun', uv: 2390, pfc: 3800, amt: 2500 },
        { name: 'Jul', uv: 3490, pfc: 4300, amt: 2100 },
    ];

    const data4 = [
        { impact: 7, effort: 7.5, priority: 3.64, uid: '1' },
        { impact: 8, effort: 3.79, priority: 0.23, uid: '2' },
        { impact: 8.9, effort: 0.99, priority: 1.32, uid: '3' },
        { impact: 1.82, effort: 2.02, priority: 0.89, uid: '4' },
        { impact: 0.33, effort: 3.29, priority: 2.69, uid: '5' },
        { impact: 1.5, effort: 8.3, priority: 1.7, uid: '6' },
        { impact: 8.7, effort: 3.0, priority: 0.9, uid: '7' },
        { impact: 2.1, effort: 1.8, priority: 2.5, uid: '8' },
        { impact: 3, effort: 7.8, priority: 1.2, uid: '9' },
        { impact: 8, effort: 8, priority: 3.3, uid: '10' },
        // Add more data points as needed
    ];

    const COLORS = ["#FFD166", "#90BE6D", "#F67280", "#A2CFFF", "#FFF59D", "#7EA7D6", "#2C3E50"];

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
            {/* Bar Chart */}
            <p className="font-bold mb-5">Number of PFCs over the months</p>
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
                    <Bar dataKey="pfc" fill="#8884d8" background={{ fill: '#eee' }} />
                </BarChart>
            </ResponsiveContainer>

            {/* Pie Chart */}
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
                    >
                        {data01.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Pie
                        dataKey="value"
                        data={data02}
                        cx="70%"
                        cy="50%"
                        outerRadius={80}
                        fill="#82ca9d"
                        label={renderCustomLabel}
                    >
                        {data02.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Scatter Effort x Impact Chart */}
            <p className="font-bold mb-5">Effort x Impact Chart of all the PFCs</p>
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
                    <Scatter name="PFCs" data={data4} fill="#8884d8" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}