import {auth} from "@/lib/auth";
import {createBooking, getOwnedBooking, getUserBookings} from "@/lib/bookings";
import {NextResponse} from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({error: "You must be logged in to book a session"}, {status: 401});
    }

    const body = await req.json();
    const {serviceId, streetAddress, zipCode, city, state, accomodations, shootDate} = body;

    if (!serviceId || !streetAddress || !zipCode || !city || !state || !accomodations || !shootDate) {
        return NextResponse.json(
            {error: "serviceId, streetAddress, zipCode, city, state, accomodations, and shootDate are required"},
            {status: 400}
        );
    }

    const parsedDate = new Date(shootDate);
    if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
        return NextResponse.json({error: "shootDate must be a valid future date"}, {status: 400});
    }

    try {
        const booking = await createBooking(session.user.id, {
            serviceId,
            streetAddress,
            zipCode,
            city,
            state,
            accomodations,
            shootDate: parsedDate
        });

        if (!booking) {
            return NextResponse.json({error: "Selected service is not available"}, {status: 400});
        }

        return NextResponse.json({booking}, {status: 201});
    } catch (error) {
        console.error("Error creating booking", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({error: "You must be logged in"}, {status: 401});
    }

    const bookingId = new URL(req.url).searchParams.get("id");

    try {
        if (bookingId) {
            const booking = await getOwnedBooking(bookingId, session);
            if (!booking) {
                return NextResponse.json({error: "Booking not found"}, {status: 404});
            }

            return NextResponse.json({booking});
        }

        const bookings = await getUserBookings(session);

        return NextResponse.json({bookings});
    } catch {
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
