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
    Button,
    Modal,
    ModalFooter,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import useSWR from 'swr'
import { formatDateTime } from "@/utils/format";
import { fetcher } from "@/utils/fetch";
import { Issue } from "@prisma/client";

const statusColorMap: Record<string, ChipProps["color"]> = {
    DONE: "success",
    PENDING: "default",
    IN_PROGRESS: "warning",
};

export default function Issues() {

    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const handleOpenModal = (issue: Issue) => {
        setSelectedIssue(issue); // กำหนด Issue ที่เลือก
        onOpen(); // เปิด Modal
    };
    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useSWR(`/api/issues?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.data.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data.count, rowsPerPage]);

    const loadingState = isLoading ? "loading" : "idle";

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                                            {v.status === "PENDING" ? "รอดำเนินการ" : (v.status === "IN_PROGRESS" ? "กำลังดำเนินการ" : "เสร็จสิ้น")}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-base">{formatDateTime(v.createdAt)}</TableCell>
                                    <TableCell className="text-base"><></></TableCell>
                                    <TableCell className="text-base">
                                        <Button onPress={() => handleOpenModal(v)} size="sm"><FaRegEye /></Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
            {selectedIssue && (
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-2">รายละเอียด</ModalHeader>
                                <ModalBody>
                                    <p>หมายเลขงาน: {selectedIssue.jobId}</p>
                                    <p>หัวข้อการแจ้งซ่อม: {selectedIssue.title}</p>
                                    <p>อาการ/สาเหตุ: {selectedIssue.cause}</p>
                                    <p>หน่วยงาน: {(selectedIssue as any).agency.name}</p>
                                    <p>ผู้แจ้งซ่อม: {selectedIssue.informer}</p>
                                    <p>วันแจ้งซ่อม: {formatDateTime(selectedIssue.createdAt)}</p>
                                    <p>สถานะ: {selectedIssue.status==="PENDING" ? "รอดำเนินการ": (selectedIssue.status === "IN_PROGRESS" ? "กำลังดำเนินการ" : "เสร็จสิ้น")}</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={() => {
                                        onClose();
                                        setSelectedIssue(null); // รีเซ็ต selectedIssue
                                    }}>
                                        ปิด
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </div>
    );
}

