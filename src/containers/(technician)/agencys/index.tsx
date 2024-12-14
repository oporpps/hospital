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
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { Agency } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "@/utils/fetch";
import { formatDateTime } from "@/utils/format";
import { LuPencilLine } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Agencys() {

    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useSWR(`/api/technician/agencys?page=${page}`, fetcher, {
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
                    <TableColumn className="text-base">หมายเลขหน่วยงาน</TableColumn>
                    <TableColumn className="text-base">ชื่อหน่วยงาน</TableColumn>
                    <TableColumn><></></TableColumn>
                </TableHeader>
                <TableBody
                    loadingContent={<Spinner />}
                    loadingState={loadingState}
                    emptyContent={"ไม่มีข้อมูลที่จะแสดง"}
                >
                    {
                        data?.data.results.map((v: Agency, i: number) => {
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
                        })
                    }
                </TableBody>
            </Table>
        </div>
    );
}

