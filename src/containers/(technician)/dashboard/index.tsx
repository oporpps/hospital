"use client"

import React, { useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Pagination,
    Spinner,
    Card,
    CardBody,
    Badge
} from "@nextui-org/react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartTooltip,
    Legend
);

const mockData = {
    count: 105,
    technicians: [
        { id: 1, name: "Technician A", tasks: 25, rating: 4.5 },
        { id: 2, name: "Technician B", tasks: 18, rating: 4.0 },
        { id: 3, name: "Technician C", tasks: 35, rating: 4.8 },
        { id: 4, name: "Technician D", tasks: 12, rating: 3.9 },
        { id: 5, name: "Technician E", tasks: 15, rating: 4.3 },
    ],
};

const barChartData = {
    labels: mockData.technicians.map((tech) => tech.name),
    datasets: [
        {
            label: "Tasks Completed",
            data: mockData.technicians.map((tech) => tech.tasks),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
    ],
};

const barChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Tasks Completed by Technicians",
        },
    },
};

export default function Dashboard() {
    const [page, setPage] = useState<number>(1);
    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return mockData.count ? Math.ceil(mockData.count / rowsPerPage) : 0;
    }, [mockData.count, rowsPerPage]);

    const currentTechnicians = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return mockData.technicians.slice(start, end);
    }, [page, rowsPerPage]);

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <Bar data={barChartData} options={barChartOptions} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "2rem" }}>
                <Card>
                    <CardBody>
                        <h4>แจ้งซ่อมทั้งหมด</h4>
                        <h1>{mockData.count}</h1>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <h4>งานที่ยังไม่ดำเนินการ</h4>
                        <h1>105</h1>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <h4>ส่งซ่อม</h4>
                        <h1>100</h1>
                    </CardBody>
                </Card>
            </div>

            <Table>
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Tasks Completed</TableColumn>
                    <TableColumn>Rating</TableColumn>
                </TableHeader>
                <TableBody>
                    {currentTechnicians.map((technician) => (
                        <TableRow key={technician.id}>
                            <TableCell>{technician.id}</TableCell>
                            <TableCell>{technician.name}</TableCell>
                            <TableCell>
                                <Badge color="success">{technician.tasks}</Badge>
                            </TableCell>
                            <TableCell>{technician.rating}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                total={pages}
                initialPage={1}
                page={page}
                onChange={(newPage) => setPage(newPage)}
            />
        </div>
    );
}
