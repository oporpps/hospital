import { prisma } from "@/prisma";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
// import libre from 'libreoffice-convert';
// import util from 'util';
import { formatDateTimeObj } from "@/utils/format";

// const convertAsync = util.promisify(libre.convert);

export async function GET(req: Request) {
    try {

        const url = new URL(req.url);
        const issue_id = url.searchParams.get('issue_id');

        if (!issue_id) {
            return Response.json({ code: 404, status: false, message: "ไม่พบข้อมูล" }, { status: 404 });
        }

        const issue = await prisma.issue.findUnique({
            where: {
                id: issue_id
            },
            select: {
                agency: {
                    select: {
                        name: true
                    }
                },
                createdAt: true,
                informer: true,
                jobId: true,
                equipment: {
                    select: {
                        bms: true,
                        equipmentId: true
                    }
                }
            }
        });

        if (!issue) {
            return Response.json({ code: 404, status: false, message: "ไม่พบข้อมูล" }, { status: 404 });
        }

        const dateTime = formatDateTimeObj(issue.createdAt);

        // อ่านไฟล์ template
        const templatePath = path.join(process.cwd(), "templates", "PDF.docx");
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });

        // เตรียมข้อมูลสำหรับ template
        const templateData = {
            AGENCY: issue.agency.name,
            EQUIPMENT_ID: issue.equipment.equipmentId,
            DATE: {
                DAY: dateTime.day,
                MONTH: dateTime.month,
                YEAR: dateTime.year,
                TIME: `${dateTime.hours}:${dateTime.minutes}`
            },
            INFOMER: {
                NAME: issue.informer,
                RANK: "-"
            },
            EQUIPMENT_ISSUE: issue.equipment.bms
        };

        // แทนที่ข้อมูลใน template
        doc.render(templateData);

        // สร้าง buffer สำหรับไฟล์ output
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE"
        });

        // // แปลง docx เป็น pdf
        // const pdfBuf = await convertAsync(buf, '.pdf', undefined);

        // สร้าง headers สำหรับ download
        const headers = new Headers();
        headers.set('Content-Type', 'application/docx');
        headers.set('Content-Disposition', `attachment; filename="${issue.jobId}.docx"`);
        // headers.set('Content-Type', 'application/pdf');
        // headers.set('Content-Disposition', `attachment; filename="${issue.jobId}.pdf"`);

        // return new Response(pdfBuf, {
        //     status: 200,
        //     headers: headers
        // });

        return new Response(buf, {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error(error);

        return Response.json(
            { code: 500, status: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}