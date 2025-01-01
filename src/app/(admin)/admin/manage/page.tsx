"use server"

import Admin from "@/containers/(admin)/manage";

export default async function Page() {

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">จัดการช่างทั้งหมด</h1>
            <Admin/>
        </div>
    );
}