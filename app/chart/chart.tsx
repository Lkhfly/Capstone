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


    // // Transform the data to count PFCs per month
    // const pfcCountByMonth: Record<string, number> = data.reduce((acc, item) => {
    //     const month = new Date(item.date_sub).toLocaleString('default', { month: 'long' });
    //     acc[month] = (acc[month] || 0) + 1;
    //     return acc;
    // }, {} as Record<string, number>);

    // // Convert the transformed data into an array of objects for Recharts
    // const chartData = Object.keys(pfcCountByMonth).map((month) => ({
    //     name: month,
    //     pfc: pfcCountByMonth[month],
    // }));


// Transform the data to count submitted and completed PFCs per month and year
const pfcCountByMonthYear: Record<string, { submitted: number; completed: number }> = data.reduce((acc, item) => {
    const subDate = new Date(item.date_sub);
    const compDate = new Date(item.date_comp);

    const subKey = `${subDate.toLocaleString('default', { month: 'long' })} ${subDate.getFullYear()}`;
    const compKey = `${compDate.toLocaleString('default', { month: 'long' })} ${compDate.getFullYear()}`;

    if (!acc[subKey]) acc[subKey] = { submitted: 0, completed: 0 };
    if (!acc[compKey]) acc[compKey] = { submitted: 0, completed: 0 };

    acc[subKey].submitted += 1;
    acc[compKey].completed += 1;

    return acc;
}, {} as Record<string, { submitted: number; completed: number }>);

// Convert the transformed data into an array of objects for Recharts
const chartData = Object.keys(pfcCountByMonthYear)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()) // Sort by date
    .map((monthYear) => ({
        name: monthYear,
        submitted: pfcCountByMonthYear[monthYear].submitted,
        completed: pfcCountByMonthYear[monthYear].completed,
    }));
// Sample data transformation functions
const transformDataByCategory = (data: Task[]) => {
    const categoryCounts: Record<string, number> = {};

    data.forEach(item => {
        const categories = Array.isArray(item.category) ? item.category : [item.category];
        categories.forEach(cat => {
            if (!categoryCounts[cat]) {
                categoryCounts[cat] = 0;
            }
            categoryCounts[cat]++;
        });
    });

    return Object.keys(categoryCounts).map(category => ({
        name: category,
        value: categoryCounts[category]
    }));
};
const categoryData = transformDataByCategory(data);

const transformDataByStatus = (data: Task[]) => {
    const statusCounts: Record<string, number> = {};

    data.forEach(item => {
        const status = item.status;
        if (!statusCounts[status]) {
            statusCounts[status] = 0;
        }
        statusCounts[status]++;
    });

    return Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
    }));
};
const statusData = transformDataByStatus(data);

const transformDataByShift = (data: Task[]) => {
    const shiftCounts: Record<number, number> = {};

    data.forEach(item => {
        const shift = item.shift_number; // Assuming `shift` is a number (1, 2, 3)
        if (!shiftCounts[shift]) {
            shiftCounts[shift] = 0;
        }
        shiftCounts[shift]++;
    });

    return Object.keys(shiftCounts).map(shift => ({
        name: `Shift ${shift}`, // Label as "Shift 1", "Shift 2", etc.
        value: shiftCounts[Number(shift)] // Convert back to number for lookup
    }));
};

const shiftData = transformDataByShift(data);
// const COLORS = [
//     '#4A90E2', // Bright Blue
//     '#5BC0BE', // Soft Teal
//     '#FFD166', // Sunny Yellow
//     '#FF6F61', // Coral
//     '#A283C4', // Lavender
//     '#77DDA6', // Mint Green
//     '#FF9F5A', // Soft Orange
//     '#87CEEB', // Sky Blue
// ];

const COLORS = 
["#003f5c", "#374c80", "#7a5195", "#bc5090", "#ef5675", "#ff764a", "#ffa600"]



    const renderCustomLabel = ({ name }: { name: string }) => name;
// // Custom label renderer
// const renderCustomLabel = ({
//     cx,
//     cy,
//     midAngle,
//     innerRadius,
//     outerRadius,
//     percent,
// }: {
//     cx: number;
//     cy: number;
//     midAngle: number;
//     innerRadius: number;
//     outerRadius: number;
//     percent: number;
// }) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//     const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
//     const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

//     return (
//         <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };
    // const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    //     if (active && payload && payload.length) {
    //         return (
    //             <div className="custom-tooltip">
    //                 <p>{`ID: ${payload[0].payload.uid}`}</p>
    //                 <p>{`Priority: ${payload[0].payload.priority}`}</p>
    //                 <p>{`Budget: ${payload[0].payload.budget}`}</p>
    //             </div>
    //         );
    //     }
    //     return null;
    // };

    return (
        <div>
           {/* Bar Chart
            <p className="font-bold mb-5">Number of PFCs over the months</p>
            <ResponsiveContainer width="90%" height={500}>
                <BarChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                >
                    <XAxis dataKey="name" scale="point" padding={{ left: 80, right: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        formatter={(value) => (value === 'pfc' ? 'Number of PFCs' : value)} // Update legend label
                    />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="pfc" fill="#8884d8" background={{ fill: '#eee' }} />
                </BarChart>
            </ResponsiveContainer>  */}
{/* Bar Chart */}
<p className="font-bold mb-5">Number of PFCs over the months</p>
<ResponsiveContainer width="90%" height={500}>
    <BarChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
        barSize={20}
    >
        <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
        <YAxis />
        <Tooltip />
        <Legend formatter={(value) => (value === 'submitted' ? 'Submitted PFCs' : 'Required PFCs')} />
        <CartesianGrid strokeDasharray="3 3" />
        <Bar dataKey="submitted" fill="#8884d8" background={{ fill: '#eee' }} />
        <Bar dataKey="completed" fill="#82ca9d" />
    </BarChart>
</ResponsiveContainer>
            {/* Pie Chart */}
            <p className="font-bold">PFCs by Category, Status, Shift</p>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        isAnimationActive={true}
                        data={categoryData}
                        cx="15%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={renderCustomLabel}
                    >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Pie
                        dataKey="value"
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#82ca9d"
                        label={renderCustomLabel}
                    >
                        {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    {/* Shift Pie Chart */}
                    <Pie
                        dataKey="value"
                        data={shiftData} // Added shift data
                        cx="85%" // Positioned to the right
                        cy="50%"
                        outerRadius={80}
                        fill="#ffc658"
                        label={renderCustomLabel}
                    >
                        {shiftData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Scatter Effort x Impact Chart
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
            </ResponsiveContainer> */}
        </div>
    );
}