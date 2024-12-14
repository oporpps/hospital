"use server"

import Agencys from "@/containers/(technician)/agencys";

export default async function Page() {

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">หน่วยงานในระบบ</h1>
            <Agencys/>
        </div>
    );
}