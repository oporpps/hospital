import { prisma } from "@/prisma";

export async function DELETE(req: Request) {
    try {
        const body = await req.json();

        // ตรวจสอบว่า body มีการส่ง id ของรายการที่ต้องการลบมาหรือไม่
        if (!body.id) {
            return Response.json({ code: 400, status: false, message: "กรุณาระบุ ID ที่ต้องการลบ" }, { status: 400 });
        }

        // ตรวจสอบว่ารายการที่ต้องการลบมีอยู่หรือไม่
        const user = await prisma.user.findUnique({
            where: {
                id: body.id
            },
        });

        if (!user) {
            return Response.json({ code: 404, status: false, message: "ไม่พบข้อมูลที่ต้องการลบ" }, { status: 404 });
        }

        // ลบข้อมูลออกจากฐานข้อมูล
        await prisma.user.delete({
            where: {
                id: body.id
            }
        });

        return Response.json({ code: 200, status: true, message: "ลบข้อมูลสำเร็จ" }, { status: 200 });

    } catch (error) {
        console.error(error);

        return Response.json(
            { code: 500, status: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}