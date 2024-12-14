"use server"

import Issues from "@/containers/(guest)/issues";

export default async function Page() {

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">งานซ่อมบำรุงทั้งหมด</h1>
            <Issues/>
        </div>
    );
}
