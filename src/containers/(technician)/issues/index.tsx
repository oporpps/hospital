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
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import useSWR from 'swr'
import { formatDateTime } from "@/utils/format";
import { fetcher } from "@/utils/fetch";
import { Issue } from "@prisma/client";
import { LuPencilLine } from "react-icons/lu";

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

    const loadingState = isLoading || data?.data.results.length === 0 ? "loading" : "idle";

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
                                                <span className="text-lg text-danger cursor-pointer active:opacity-50">
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
