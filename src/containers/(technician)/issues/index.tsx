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
    ChipProps,
    Chip,
    useDisclosure,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import useSWR,{mutate} from "swr";
import { formatDateTime } from "@/utils/format";
import { fetcher } from "@/utils/fetch";
import { Issue } from "@prisma/client";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "react-toastify";

const statusColorMap: Record<string, ChipProps["color"]> = {
    DONE: "success",
    PENDING: "default",
    IN_PROGRESS: "warning",
};

export default function Issues() {

    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useSWR(`/api/technician/issues?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.data.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data.count, rowsPerPage]);

    const loadingState = isLoading ? "loading" : "idle";

    const { isOpen, onOpen, onOpenChange,onClose } = useDisclosure();
    
    const handleDelete = async (id: string) => {
        const promise = fetch("/api/issues/remove", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({id}),
                })
                    .then(async (response) => {
                        const result = await response.json();
                        if (response.ok) {
                            return result.message || 'ลบข้อมูลสำเร็จ';
                        } else {
                            throw new Error(result.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
                        }
                    })
                    .catch((error) => {
                        throw new Error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูล');
                    });
        
                toast.promise(
                    promise,
                    {
                        pending: "กำลังลบบันทึกการแจ้งซ่อม...",
                        success: {
                            render({ data }) {
                                mutate(`/api/technician/issues?page=${page}`)
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
        <div className="flex flex-col gap-3">
            <Table
                aria-label="Example static collection table"
                color="primary"
                selectionMode="single"
                radius="none"
                bottomContent={
                    pages > 0 ? (
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="warning"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    ) : null
                }
            >
                <TableHeader>
                    <TableColumn className="text-base">หมายเลขงาน</TableColumn>
                    <TableColumn className="text-base">หน่วยงาน</TableColumn>
                    <TableColumn className="text-base">อาการ/สาเหตุ</TableColumn>
                    <TableColumn className="text-base">สถานะ</TableColumn>
                    <TableColumn className="text-base">วันแจ้งซ่อม</TableColumn>
                    <TableColumn className="text-base">วันสรุปงาน</TableColumn>
                    <TableColumn><></></TableColumn>
                </TableHeader>
                <TableBody
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                    emptyContent={"ไม่มีข้อมูลที่จะแสดง"}
                >
                    {
                        data?.data.results.map((v: Issue, i: number) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell className="text-base">{v.jobId}</TableCell>
                                    <TableCell className="text-base">{(v as any).agency.name}</TableCell>
                                    <TableCell className="text-base">{v.cause}</TableCell>
                                    <TableCell className="text-base">
                                        <Chip color={statusColorMap[v.status]} size="sm" variant="flat" radius="sm">
                                            { v.status === "PENDING" ? "รอดำเนินการ" : (v.status === "IN_PROGRESS" ? "กำลังดำเนินการ" : "เสร็จสิ้น") }
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-base">{formatDateTime(v.createdAt)}</TableCell>
                                    <TableCell className="text-base"><></></TableCell>
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
                        })
                    }
                </TableBody>
            </Table>
        </div>
    );
}

