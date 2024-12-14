import { prisma } from "@/prisma";
import { generateRandomNumber } from "@/utils/random";

export async function POST(req: Request) {

    try {
        const id = generateRandomNumber(8);
        const body = await req.json();

        const equipment = await prisma.equipment.findUnique({
            where: {
                idCal: body.equipment
            },
            select: {
                id: true
            }
        });

        if (equipment) {
            
            const issue = await prisma.issue.create({
                data: {
                    jobId: id,
                    title: body.title,
                    informer: body.informer,
                    agencyId: body.agency,
                    equipmentId: equipment.id,
                    cause: body.cause
                },
            });
    
            if (issue) {
                return Response.json({ code: 201, status: true, message: "สำเร็จ" }, { status: 201 });
            }

        }

        return Response.json({ code: 400, status: true, message: "เกิดข้อผิดพลาดไม่สามารถสร้างบันทึกการแจ้งซ่อมได้ในขณะนี้" }, { status: 400 });

    } catch (error) {

        return Response.json(
            { code: 500, status: false, message: 'Internal server error' },
            { status: 500 }
        )

    }

}
