import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({error: "You must be logged in to book a session"}, {status: 401});
    }

    const body = await req.json();
    const {serviceId, location, accomodations, shootDate} = body;

    if (!serviceId || !location || !accomodations || !shootDate) {
        return NextResponse.json(
            {error: "serviceId, location, accomodations, and shootDate are required"},
            {status: 400}
        );
    }

    const parsedDate = new Date(shootDate);
    if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
        return NextResponse.json({error: "shootDate must be a valid future date"}, {status: 400});
    }

    try {
        const service = await prisma.service.findUnique({where: {id: serviceId}});
        if (!service || !service.active) {
            return NextResponse.json({error: "Selected service is not available"}, {status: 400});
        }

        const booking = await prisma.bookings.create({
            data: {
                serviceId,
                userId: session.user.id,
                location,
                accomodations,
                shootDate: parsedDate
            }
        });

        return NextResponse.json({booking}, {status: 201});
    } catch {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({error: "You must be logged in"}, {status: 401});
    }

    const isAdmin = (session.user as {role?: string}).role === "Admin";

    const bookings = await prisma.bookings.findMany({
        where: isAdmin ? {} : {userId: session.user.id},
        include: {service: true},
        orderBy: {shootDate: "asc"}
    });

    return NextResponse.json({bookings});
}
