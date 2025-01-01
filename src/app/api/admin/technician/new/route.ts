import { prisma } from "@/prisma";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

    try {

        const body = await req.json();

        const user = await prisma.user.create({
            data: {
                fullname: body.fullname,
                role:UserRole.TECHNICIAN,
                username: body.username,
                password: await bcrypt.hash(body.password,12),
            },
        });

        if (user) {
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