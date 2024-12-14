import { prisma } from '@/prisma'
import { ObjectId } from 'mongodb'

export async function GET(req: Request, { params }: { params: { id: string } }) {

    try {

        if (ObjectId.isValid(params.id)) {

            const data = await prisma.equipment.findUnique({
                where: {
                    id: params.id
                }
            })
    
            if (data) {
                return Response.json({ code: 200, status: true, message: "", data: data }, {
                    status: 200
                })
            }

        } else {

            const data = await prisma.equipment.findUnique({
                where: {
                    idCal: params.id
                }
            })
    
            if (data) {
                return Response.json({ code: 200, status: true, message: "", data: data }, {
                    status: 200
                })
            }

        }

        return Response.json(
            { code: 404, status: true, data: null },
            { status: 404 }
        )

    } catch (error) {
        
        return Response.json(
            { code: 500, status: false, message: 'Internal server error' },
            { status: 500 }
        )

    }

}