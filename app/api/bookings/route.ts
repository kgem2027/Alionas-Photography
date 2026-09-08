import {auth} from "@/lib/auth";
import {createBooking, getOwnedBooking, getUserBookings, updateBookingStatus, BookingConflictError} from "@/lib/bookings";
import {NextResponse} from "next/server";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCLED", "COMPLETED"];

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({error: "You must be logged in to book a session"}, {status: 401});
    }

    const body = await req.json();
    const {serviceId, streetAddress, zipCode, city, state, accomodations, shootDate, endTime} = body;

    if (!serviceId || !streetAddress || !zipCode || !city || !state || !accomodations || !shootDate || !endTime) {
        return NextResponse.json(
            {error: "serviceId, streetAddress, zipCode, city, state, accomodations, shootDate, and endTime are required"},
            {status: 400}
        );
    }

    const parsedDate = new Date(shootDate);
    const parsedEndTime = new Date(endTime);
    if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
        return NextResponse.json({error: "shootDate must be a valid future date"}, {status: 400});
    }
    if (isNaN(parsedEndTime.getTime()) || parsedEndTime <= parsedDate) {
        return NextResponse.json({error: "endTime must be a valid date after shootDate"}, {status: 400});
    }

    try {
        const booking = await createBooking(session.user.id, {
            serviceId,
            streetAddress,
            zipCode,
            city,
            state,
            accomodations,
            shootDate: parsedDate,
            endTime: parsedEndTime
        });

        if (!booking) {
            return NextResponse.json({error: "Selected service is not available"}, {status: 400});
        }

        return NextResponse.json({booking}, {status: 201});
    } catch (error) {
        if (error instanceof BookingConflictError) {
            return NextResponse.json({error: error.message}, {status: 409});
        }
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

export async function PUT(req: Request){
    const session = await auth()
    if(!session?.user?.id){
        return NextResponse.json({error: "You must be logged in"}, {status: 401})
    }
    if(session.user.role !== "Admin"){
        return NextResponse.json({error:"You must be an admin to complete this action"}, {status:403})
    }
    const body = await req.json()
    const {id, serviceId, userId, streetAddress, zipCode,city,state,accomodations,shootDate,endTime,status} = body
    if(!id || !serviceId || !userId || !streetAddress ||!zipCode|| !city || !state || !accomodations ||!shootDate ||!endTime ||!status){
        return NextResponse.json({error:"Must fill all fields"}, {status: 400})
    }
    if(!VALID_STATUSES.includes(status)){
        return NextResponse.json({error: `status must be one of: ${VALID_STATUSES.join(", ")}`}, {status: 400})
    }
    const parsedDate = new Date(shootDate)
    const parsedEndTime = new Date(endTime)
    if(isNaN(parsedDate.getTime())){
        return NextResponse.json({error: "shootDate must be a valid date"}, {status: 400})
    }
    if(isNaN(parsedEndTime.getTime()) || parsedEndTime <= parsedDate){
        return NextResponse.json({error: "endTime must be a valid date after shootDate"}, {status: 400})
    }
    try{
        const update = await updateBookingStatus(session,{id, serviceId, userId, streetAddress, zipCode,city,state,accomodations,shootDate: parsedDate,endTime: parsedEndTime,status})
        if(!update){
            return NextResponse.json({error: "Booking, service, or user not found"}, {status: 404})
        }
        return NextResponse.json({update}, {status:200})
    } catch(error){
        if (error instanceof BookingConflictError) {
            return NextResponse.json({error: error.message}, {status: 409})
        }
        return NextResponse.json({error: "Internal Service Error"}, {status:500})
    }
}
