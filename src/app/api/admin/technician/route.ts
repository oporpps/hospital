import { prisma } from "@/prisma";
import { UserRole } from "@prisma/client";

export async function GET(req: Request) {

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '15');

    const count = await prisma.user.count();

    const skip = (page - 1) * limit;

    const data = await prisma.user.findMany({
      where:{
        role:UserRole.TECHNICIAN
      },
      
        select:{
          id:true,  
          fullname:true,
          role:true,
          username:true,
          createdAt:true,
          updatedAt:true,
        },
        skip: skip,
        take: limit,
    });

    return Response.json({ code: 200, status: true, data: { results: data, count } }, { status: 200 })

}