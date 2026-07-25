import {auth} from "@/lib/auth";
import {getActiveServices, createService} from "@/lib/services";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const services = await getActiveServices()
        return NextResponse.json({services}, {status: 200})
    } catch {
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({error: "You must be logged in to create a service"}, {status: 401})
    }
    if (session.user.role !== "Admin") {
        return NextResponse.json({error: "You must be an admin to create a service"}, {status: 403})
    }

    const body = await req.json()
    const {name, price, description} = body

    if (!name || price === undefined || price === null) {
        return NextResponse.json({error: "name and price are required"}, {status: 400})
    }

    try {
        const service = await createService({name, price, description})
        return NextResponse.json({service}, {status: 201})
    } catch {
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}
