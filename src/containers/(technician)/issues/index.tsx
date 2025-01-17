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
    ModalContent,
} from "@nextui-org/react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import useSWR, { mutate } from "swr";
import { formatDateTime } from "@/utils/format";
import { fetcher } from "@/utils/fetch";
import { Issue } from "@prisma/client";
import { LuPencilLine } from "react-icons/lu";
import { toast } from "react-toastify";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { IoPrintSharp } from "react-icons/io5";

const statusColorMap: Record<string, ChipProps["color"]> = {
    DONE: "success",
    PENDING: "default",
    IN_PROGRESS: "warning",
};

export const ListboxWrapper = ({ children }: any) => (
    <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
        {children}
    </div>
);
export default function Issues() {

    const handlePrint = async (issue: Issue) => {
        const params = new URLSearchParams({
            issue_id: issue.id
        }).toString();

        const promise = fetch(`/api/technician/pdf?${params}`)
            .then(async (response) => {
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${issue.jobId}.docx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    return 'บันทึกสำเร็จ';
                } else {
                    const result = await response.json();
                    throw new Error(result.message || 'เกิดข้อผิดพลาดในการสร้างไฟล์');
                }
            })
            .catch((error) => {
                throw new Error(error.message || 'เกิดข้อผิดพลาดในการสร้างไฟล์');
            });

        toast.promise(
            promise,
            {
                pending: "กำลังสร้างไฟล์...",
                success: {
                    render({ data }) {
                        return data;
                    }
                },
                error: {
                    render({ data }: any) {
                        return data.message;
                    }
                }
            }
        );

    };

    const [page, setPage] = useState<number>(1);
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null); // เก็บข้อมูลรายละเอียด
    const { data, isLoading } = useSWR(`/api/technician/issues?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.data.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data.count, rowsPerPage]);

    const loadingState = isLoading ? "loading" : "idle";

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const handleViewDetails = (issue: Issue) => {
        setSelectedIssue(issue); // ตั้งค่ารายการที่เลือก
        onOpen(); // เปิด Modal
    };
    const [selectedKeys, setSelectedKeys] = React.useState(new Set(["text"]));

    const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", "), [selectedKeys]);

    const handleDelete = async (id: string) => {
        const promise = fetch("/api/issues/remove", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
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
                    render({ data }: any) {
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
                        data?.data.results.map((issue: Issue, i: number) => {
                            return (
                                <TableRow key={i}>
                                    <TableCell className="text-base">{issue.jobId}</TableCell>
                                    <TableCell className="text-base">{(issue as any).agency.name}</TableCell>
                                    <TableCell className="text-base">{issue.cause}</TableCell>
                                    <TableCell className="text-base">
                                        <Chip color={statusColorMap[issue.status]} size="sm" variant="flat" radius="sm">
                                            {issue.status === "PENDING" ? "รอดำเนินการ" : (issue.status === "IN_PROGRESS" ? "กำลังดำเนินการ" : "เสร็จสิ้น")}
                                        </Chip>
                                    </TableCell>
                                    <TableCell className="text-base">{formatDateTime(issue.createdAt)}</TableCell>
                                    <TableCell className="text-base"><></></TableCell>
                                    <TableCell>
                                        <div className="relative flex items-center gap-2">
                                            <Tooltip content="ดูรายละเอียด">
                                                <span
                                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                    onClick={() => handleViewDetails(issue)}
                                                >
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
                                                            handleDelete(issue.id);
                                                        }
                                                    }}
                                                >
                                                    <FaRegTrashAlt />
                                                </span>
                                            </Tooltip>
                                            <Tooltip content="พิมพ์">
                                                <span
                                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                                    onClick={() => handlePrint(issue)}
                                                >
                                                    <IoPrintSharp />
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
                                    <p>หมายเลขครุภัณฑ์: {(selectedIssue as any)?.equipment?.idCal || "ไม่มีข้อมูล"}</p>
                                    <p>สถานะ: {selectedIssue.status === "PENDING" ? "รอดำเนินการ" : (selectedIssue.status === "IN_PROGRESS" ? "กำลังดำเนินการ" : "เสร็จสิ้น")}</p>
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

