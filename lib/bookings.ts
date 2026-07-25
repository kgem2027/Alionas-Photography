import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export async function createBooking(userId: string, data: {
    serviceId: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    state: string;
    accomodations: string;
    shootDate: Date;
}) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.active) {
        return null;
    }

    return prisma.bookings.create({
        data: {
            ...data,
            userId
        }
    });
}

export async function getOwnedBooking(id: string, session: Session) {
    const booking = await prisma.bookings.findUnique({
        where: { id },
        include: { service: true }
    });

    const isAdmin = session.user.role === "Admin";
    if (!booking || (!isAdmin && booking.userId !== session.user.id)) {
        return null;
    }

    return booking;
}

export async function getUserBookings(session: Session) {
    const isAdmin = session.user.role === "Admin";
    const bookings = await prisma.bookings.findMany({
        where: isAdmin ? {} : {userId: session.user.id},
        include: { service: true },
        orderBy: { shootDate: "asc" }
    });
    return bookings;
}
