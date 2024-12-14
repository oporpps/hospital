"use client"

import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Input,
    Button,
    Textarea,
    Select,
    SelectItem
} from "@nextui-org/react";
import { Agency, Equipment } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Form = {
    title: string;
    equipment: string;
    informer: string;
    agency: string;
    cause: string;
}

export default function NewIssue({ agency, init }: { agency: Array<Agency>, init: Equipment | null }) {

    const [equipment, setEquipment] = useState<Equipment | null>(init);

    const {
        register,
        handleSubmit,
        watch
    } = useForm<Form>()

    const equipmentId = watch("equipment");

    useEffect(() => {

        const update = async () => {
            const data = await fetch(`/api/equipment/${equipmentId}`);
            if (data.ok) {
                setEquipment((await data.json()).data)
            } else {
                setEquipment(null);
            }
        }

        update();

    }, [equipmentId]);

    const onSubmit = async (data: Form) => {
        const promise = fetch("/api/issues/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(async (response) => {
                const result = await response.json();
                if (response.ok) {
                    return result.message || 'ส่งข้อมูลสำเร็จ';
                } else {
                    throw new Error(result.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
                }
            })
            .catch((error) => {
                throw new Error(error.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
            });

        toast.promise(
            promise,
            {
                pending: "กำลังสร้างบันทึกการแจ้งซ่อม...",
                success: {
                    render({ data }) {
                        return data;
                    }
                },
                error: {
                    render({ data } : any) {
                        return data.message;
                    }
                }
            }
        );

    };

    return (
        <Card radius="none">
            <CardBody>
                <form className="grid col-span-1 gap-4 py-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        isRequired
                        label="บันทึกส่งซ่อม"
                        labelPlacement="outside"
                        placeholder="กรอกหัวข้อการส่งซ่อม"
                        variant="bordered"
                        classNames={{
                            label: "text-default-600",
                            input: "text-default-800"
                        }}
                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                        {...register("title")}
                    />

                    <Input
                        isRequired
                        label="ไอดีครุภัณฑ์"
                        labelPlacement="outside"
                        placeholder="ไอดีครุภัณฑ์"
                        variant="bordered"
                        classNames={{
                            label: "text-default-600",
                            input: "text-default-800"
                        }}
                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                        {...register("equipment")}
                        defaultValue={equipment ? equipment.idCal : ""}
                    />

                    <Input
                        label="หมายเลขครุภัณฑ์"
                        labelPlacement="outside"
                        placeholder="หมายเลขครุภัณฑ์"
                        variant="flat"
                        readOnly
                        value={equipment ? equipment.equipmentId : ""}
                    />

                    <Input
                        label="ยี่ห้อ/รุ่น/ขนาด"
                        labelPlacement="outside"
                        placeholder="ระบุรายละเอียดอุปกรณ์"
                        variant="flat"
                        readOnly
                        value={equipment ? equipment.bms : ""}
                    />

                    <Input
                        isRequired
                        label="ผู้แจ้งซ่อม"
                        labelPlacement="outside"
                        placeholder="ระบุผู้แจ้งซ่อม"
                        variant="bordered"
                        classNames={{
                            label: "text-default-600",
                            input: "text-default-800"
                        }}
                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                        {...register("informer")}
                    />

                    <Select
                        // isRequired
                        label="หน่วยงาน"
                        labelPlacement="outside"
                        placeholder="กรุณาเลือกหน่วยงาน"
                        variant="bordered"
                        className="max-w-full"
                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                        {...register("agency")}
                    >
                        {agency.map((agency) => (
                            <SelectItem key={agency.id} value={agency.id}>
                                {agency.name}
                            </SelectItem>
                        ))}
                    </Select>

                    <Textarea
                        isRequired
                        label="อาการ/สาเหตุ"
                        labelPlacement="outside"
                        placeholder="อธิบายอาการเสียหรือปัญหาที่พบ"
                        variant="bordered"
                        minRows={3}
                        classNames={{
                            label: "text-default-600",
                            input: "text-default-800"
                        }}
                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                        {...register("cause")}
                    />

                    <div className="flex gap-2 justify-end mt-4">
                        <Button type="reset" variant="flat" color="default" onPress={() => setEquipment(null)}>
                            ล้างข้อมูล
                        </Button>
                        <Button type="submit" color="primary">
                            ส่งคำขอ
                        </Button>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}