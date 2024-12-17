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

import useSWR from "swr";
import { fetcher } from "@/utils/fetch";


export default function Dashboard() {

    const [page, setPage] = useState<number>(1);

    const { data, isLoading } = useSWR(`/api/technician/dashboard?page=${page}`, fetcher, {
        keepPreviousData: true,
    });

    const rowsPerPage = 10;

    const pages = useMemo(() => {
        return data?.data.count ? Math.ceil(data.data.count / rowsPerPage) : 0;
    }, [data?.data.count, rowsPerPage]);

    const loadingState = isLoading ? "loading" : "idle";

    return (
        <></>
    );
}

