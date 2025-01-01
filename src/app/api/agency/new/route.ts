import { prisma } from "@/prisma";

export async function POST(req: Request) {

    try {

        const body = await req.json();

        const agency = await prisma.agency.create({
            data: {
                name: body.name,
                number: body.number,
            },
        });

        if (agency) {
            return Response.json({ code: 201, status: true, message: "สำเร็จ" }, { status: 201 });
        }

        return Response.json({ code: 400, status: true, message: "เกิดข้อผิดพลาดไม่สามารถสร้างบันทึกหน่วยงานได้ในขณะนี้" }, { status: 400 });

    } catch (error) {

        return Response.json(
            { code: 500, status: false, message: 'Internal server error' },
            { status: 500 }
        )

    }

}