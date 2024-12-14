"use server"

import Equipments from "@/containers/(technician)/equipments";

export default async function Page() {


    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">ครุภัณฑ์ในระบบ</h1>
            <Equipments/>
        </div>
    );
}