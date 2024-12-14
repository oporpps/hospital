import { headers } from 'next/headers'

export async function GET(req: Request) {
    return Response.json({ message: "Hello World" })
}