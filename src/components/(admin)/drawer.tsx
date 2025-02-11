"use client"

import { useDrawer } from "@/stores/drawer-store";
import {
    Card,
    CardBody,
    CardHeader,
    Link
} from "@nextui-org/react";
import Image from "next/image";

export default function Drawer() {

    const open = useDrawer((state) => state.open);

    return (
        <>
            <Card className={"w-80 bg-[#198754] rounded-none border-none transform transition-all duration-150" + (open ? " opacity-100 scale-100" : " opacity-0 scale-95 hidden")}>
                <CardHeader className="flex justify-center">
                    <Link href="/">
                        <Image
                            alt="กระทรวงสาธารณสุข"
                            src="/logo.png"
                            height={160}
                            width={160}
                        />
                    </Link>
                </CardHeader>
                <CardBody className="flex items-center space-y-4">
                    <Link href="/admin/equipment" className="text-white" size="lg">จัดการครุภัณฑ์</Link>
                    <Link href="/admin/agency" className="text-white" size="lg">จัดการหน่วยงาน</Link>
                </CardBody>
            </Card>
        </>
    );
}
