"use server"

import Issues from "@/containers/(technician)/issues";

export default async function Page() {

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">งานที่รอดำเนินการ</h1>
            <Issues/>
        </div>
    );
}