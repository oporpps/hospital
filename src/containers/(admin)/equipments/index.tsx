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
    Button,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Form,
    Input,
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { Equipment } from "@prisma/client";
import useSWR,{mutate} from "swr";
import { fetcher } from "@/utils/fetch";
import { formatDateTime } from "@/utils/format";
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Equipments() {

    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useSWR(`/api/admin/get/equipments?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.data.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data.count, rowsPerPage]);

    const loadingState = isLoading  ? "loading" : "idle";

    const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
    
    const handleSubmit = async (formData: FormData) => {
    
            const idcal = formData.get("idcal") as string; // Access form fields
            const equipmentid = formData.get("equipmentid") as string;
            const bms = formData.get("bms") as string;
            const price = formData.get("price") as string;
            const doc = formData.get("doc") as string;
            const get = formData.get("get") as string;
            const seller = formData.get("seller") as string;
            const responsible = formData.get("responsible") as string;

            const response = await fetch ('/api/equipment/new',{
                method : 'POST',
                body : JSON.stringify({
                    idcal,
                    bms,
                    equipmentid,
                    price,
                    doc,
                    get,
                    seller,
                    responsible,
                })
            })
            const data = await response.json()
            console.log(data);
            mutate(`/api/admin/get/equipments?page=${page}`)
            onClose() 
        }
    const handleDelete = async (id: string) => {
            const promise = fetch("/api/equipment/remove", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({id}),
                    })
                        .then(async (response) => {
                            const result = await response.json();
                            if (response.ok) {
                                return result.message || 'ลบครุภัณฑ์สำเร็จ';
                            } else {
                                throw new Error(result.message || 'เกิดข้อผิดพลาดในการลบครุภัณฑ์');
                            }
                        })
                        .catch((error) => {
                            throw new Error(error.message || 'เกิดข้อผิดพลาดในการลบครุภัณฑ์');
                        });
            
                    toast.promise(
                        promise,
                        {
                            pending: "กำลังลบครุภัณฑ์...",
                            success: {
                                render({ data }) {
                                    mutate(`/api/admin/get/equipments?page=${page}`)
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
        }

    return (
        <><div className="flex justify-end mb-4">
        <Button onPress={onOpen} color="success" variant="solid" className="text-white">
          + เพิ่มครุภัณฑ์
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มครุภัณฑ์</ModalHeader>
                            <ModalBody>
                                <Form
                                    className="w-full flex flex-col gap-4 mb-4"
                                    validationBehavior="native"
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        handleSubmit(new FormData(e.currentTarget));
                                    }}
                                >
                                    <Input
                                        isRequired
                                        label="ไอดีครุภัณฑ์"
                                        labelPlacement="outside"
                                        name="idcal"
                                        type="text"
                                        variant="bordered"
                                        placeholder="ไอดีครุภัณฑ์"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />

                                    <Input
                                        isRequired
                                        label="หมายเลขครุภัณฑ์"
                                        labelPlacement="outside"
                                        name="equipmentid"
                                        type="text"
                                        variant="bordered"
                                        placeholder="หมายเลขครุภัณฑ์"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <Input
                                        isRequired
                                        label="ยี่ห้อ/รุ่น/ขนาด"
                                        labelPlacement="outside"
                                        name="bms"
                                        type="text"
                                        variant="bordered"
                                        placeholder="ยี่ห้อ/รุ่น/ขนาด"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <Input
                                        isRequired
                                        label="ราคา"
                                        labelPlacement="outside"
                                        name="price"
                                        type="text"
                                        variant="bordered"
                                        placeholder="ราคา"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <Input
                                        isRequired
                                        label="วันที่ได้มา"
                                        labelPlacement="outside"
                                        name="doc"
                                        type="text"
                                        variant="bordered"
                                        placeholder="วันที่ได้มา"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <Input
                                        isRequired
                                        label="วิธีการได้มา"
                                        labelPlacement="outside"
                                        name="get"
                                        type="text"
                                        variant="bordered"
                                        placeholder="วิธีการได้มา"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <Input
                                        isRequired
                                        label="ผู้จำหน่าย"
                                        labelPlacement="outside"
                                        name="seller"
                                        type="text"
                                        variant="bordered"
                                        placeholder="ผู้จำหน่าย"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                     <Input
                                        isRequired
                                        label="ผู้รับผิดชอบ"
                                        labelPlacement="outside"
                                        name="responsible"
                                        type="text"
                                        variant="bordered"
                                        placeholder="ผู้รับผิดชอบ"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    <div className="w-full">
                                        <Button color="success" type="submit" radius="sm" className="text-white w-full">
                                        เพิ่มครุภัณฑ์
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
      </div>
      <div className="flex flex-col gap-3">
                <Table
                    aria-label="Example static collection table"
                    color="primary"
                    selectionMode="single"
                    radius="none"
                    bottomContent={pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="warning"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)} />
                        </div>
                    ) : null}
                >
                    <TableHeader>
                        <TableColumn className="text-base">ไอดีครุภัณฑ์</TableColumn>
                        <TableColumn className="text-base">หมายเลขครุภัณฑ์</TableColumn>
                        <TableColumn className="text-base">ยี่ห้อ/รุ่น/ขนาด</TableColumn>
                        <TableColumn className="text-base">วันที่ได้มา</TableColumn>
                        <TableColumn className="text-base">ผู้รับผิดชอบ</TableColumn>
                        <TableColumn><></></TableColumn>
                    </TableHeader>
                    <TableBody
                        loadingContent={<Spinner />}
                        loadingState={loadingState}
                        emptyContent={"ไม่มีข้อมูลที่จะแสดง"}
                    >
                        {data?.data.results.map((v: Equipment, i: number) => {
                            return (
                                <TableRow key={i}>
                                     <TableCell className="text-base">{v.idCal}</TableCell>
                                    <TableCell className="text-base">{v.equipmentId}</TableCell>
                                    <TableCell className="text-base">{v.bms}</TableCell>
                                    <TableCell className="text-base">20/1/2568</TableCell>
                                    <TableCell className="text-base">พูลสวัสดิ์</TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Tooltip content="ดูรายละเอียด">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <FaRegEye />
                                                </span>
                                            </Tooltip>
                                            <Tooltip content="แก้ไข">
                                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                                    <LuPencilLine />
                                                </span>
                                            </Tooltip>
                                            <Tooltip content="ลบ">
                                                <span
                                                    className="text-lg text-danger cursor-pointer active:opacity-50"
                                                    onClick={() => {
                                                        if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?")) {
                                                            handleDelete(v.id);
                                                        }
                                                    }}
                                                >
                                                    <FaRegTrashAlt />
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div></>
    );
}

