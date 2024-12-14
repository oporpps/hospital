import NewIssue from "@/containers/(guest)/issues/new";
import { prisma } from "@/prisma";
import xfetch from "@/utils/fetch";

export default async function Page({ searchParams }: { searchParams: { eq?: string } }) {

    const data = await prisma.agency.findMany();

    const equipment = searchParams.eq ? (await (await xfetch(`/api/equipment/${searchParams.eq}`)).json()).data : null

    return (
        <div className="p-8">
            <h1 className="text-2xl mb-3">สร้างบันทึกการแจ้งซ่อม</h1>
            <NewIssue agency={data} init={equipment} />
        </div>
    );
}
