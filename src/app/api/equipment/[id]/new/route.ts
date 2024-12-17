import { prisma } from "@/prisma";

// export async function POST(req: Request) {

//     try {

//         const body = await req.json();

//         if (equipment) {
            
//             const issue = await prisma.issue.create({
//                 data: {
//                     idCal: id,
//                     equipmentId: body.title,
//                     bms: body.informer,
//                     agencyId: body.agency,
//                     serialNo: body.cause,
//                     cause: body.cause
//                 },
//             });
    
//             if (issue) {
//                 return Response.json({ code: 201, status: true, message: "สำเร็จ" }, { status: 201 });
//             }

//         }

//         return Response.json({ code: 400, status: true, message: "เกิดข้อผิดพลาดไม่สามารถสร้างบันทึกครุภัณฑ์ได้ในขณะนี้" }, { status: 400 });

//     } catch (error) {

//         return Response.json(
//             { code: 500, status: false, message: 'Internal server error' },
//             { status: 500 }
//         )

//     }

// }