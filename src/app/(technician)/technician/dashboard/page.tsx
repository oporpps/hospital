"use client"

import Dashboard from "@/containers/(technician)/dashboard";
import Agencys from "@/containers/(technician)/dashboard";
import Chart from 'react-apexcharts'

export default function Page() {
    const data = {
        options: {},
        series: [44, 55, 41, 17, 15],
        labels: ['A', 'B', 'C', 'D', 'E']
    }
    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">แดชบอร์ด</h1>
            <Dashboard />
            {/* {
                typeof window === "undefined" ? null : <Chart options={data.options} series={data.series} type="donut" width="500" />
            } */}
        </div>
    );
}