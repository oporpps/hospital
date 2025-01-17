import { prisma } from "@/prisma";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '15');

    const count = await prisma.equipment.count();

    const skip = (page - 1) * limit;

    const data = await prisma.issue.findMany({
        skip: skip,
        take: limit,
        include: {
            agency: true,
            equipment: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return Response.json({ code: 200, status: true, data: { results: data, count } }, { status: 200 })

}