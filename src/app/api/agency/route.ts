import { prisma } from '@/prisma'

export async function GET(req: Request) {

    const data = await prisma.agency.findMany();

    return Response.json({ status: true, message: "", data }, {
        status: 200
    });
    
}