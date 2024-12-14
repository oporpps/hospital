import { prisma } from "@/prisma";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '15');

    const count = await prisma.agency.count();

    const skip = (page - 1) * limit;

    const data = await prisma.agency.findMany({
        skip: skip,
        take: limit,
    });

    return Response.json({ code: 200, status: true, data: { results: data, count } }, { status: 200 })

}