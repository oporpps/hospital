import { prisma } from "@/prisma";

export async function POST(req: Request) {

    try {

        const body = await req.json();

        const equipment = await prisma.equipment.create({
            data: {
                idCal: body.idcal,
                equipmentId: body.equipmentid,
                bms: body.bms,
                price: body.price,
                doc: body.doc,
                get: body.get,
                seller: body.seller,
                responsible: body.responsible,
            },
        });

        if (equipment) {
            return Response.json({ code: 201, status: true, message: "สำเร็จ" }, { status: 201 });
        }

        return Response.json({ code: 400, status: true, message: "เกิดข้อผิดพลาดไม่สามารถสร้างบันทึกครุภัณฑ์ได้ในขณะนี้" }, { status: 400 });

    } catch (error) {

        return Response.json(
            { code: 500, status: false, message: 'Internal server error' },
            { status: 500 }
        )

    }

}