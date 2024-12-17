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
    Form,
    ModalBody,
    ModalContent,
    Modal,
    Input,
    ModalHeader,
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { Agency } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "@/utils/fetch";
import { formatDateTime } from "@/utils/format";
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Agencys() {

    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useSWR(`/api/technician/agencys?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.data.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data.count, rowsPerPage]);

    const loadingState = isLoading ? "loading" : "idle";

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    
    const handleSubmit = async (formData: FormData) => {
        
                const username = formData.get("username") as string; // Access form fields
                const password = formData.get("password") as string;
        
                const response = await signIn("credentials", {
                    redirect: false,
                    username: username,
                    password: password,
                });
        
                if (response?.error) {
                    toast.error(response?.error)
                } else {
                    toast.success("สำเร็จ");
                }
            }
    return (
        
        <><div className="flex justify-end mb-4">
            <Button onPress={onOpen} color="success" variant="solid" className="text-white">
          + เพิ่มหน่วยงาน
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">เพิ่มหน่วยงาน</ModalHeader>
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
                                        label="หมายเลขหน่วยงาน"
                                        labelPlacement="outside"
                                        name="number"
                                        type="text"
                                        variant="bordered"
                                        placeholder="หมายเลขหน่วยงาน"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />

                                    <Input
                                        isRequired
                                        label="ชื่อหน่วยงาน"
                                        labelPlacement="outside"
                                        name="name"
                                        type="text"
                                        variant="bordered"
                                        placeholder="ชื่อหน่วยงาน"
                                        errorMessage="กรุณากรอกข้อมูลในช่องนี้"
                                        size="lg"
                                    />
                                    
                                    <div className="w-full">
                                        <Button color="success" type="submit" radius="sm" className="text-white w-full">
                                        เพิ่มหน่วยงาน
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
                    <TableColumn className="text-base">หมายเลขหน่วยงาน</TableColumn>
                    <TableColumn className="text-base">ชื่อหน่วยงาน</TableColumn>
                    <TableColumn><></></TableColumn>
                </TableHeader>
                <TableBody
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                    emptyContent={"ไม่มีข้อมูลที่จะแสดง"}
                >
                    {data?.data.results.map((v: Agency, i: number) => {
                        return (
                            <TableRow key={i}>
                                <TableCell className="text-base">{v.number}</TableCell>
                                <TableCell className="text-base">{v.name}</TableCell>
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
                                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
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

