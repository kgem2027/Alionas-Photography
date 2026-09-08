import { prisma } from "@/lib/prisma";
import { Session } from "next-auth";
import { BookingStatus } from "../generated/prisma/client";
import {createCalendarEvent, updateCalendarEvent, deleteCalendarEvent} from "@/lib/googleCalendar"

export class BookingConflictError extends Error {
    constructor() {
        super("That time slot overlaps with an existing booking");
        this.name = "BookingConflictError";
    }
}

async function hasConflict(shootDate: Date, endTime: Date, excludeBookingId?: string) {
    const conflict = await prisma.bookings.findFirst({
        where: {
            id: excludeBookingId ? { not: excludeBookingId } : undefined,
            status: { not: "CANCLED" },
            shootDate: { lt: endTime },
            endTime: { gt: shootDate }
        }
    });
    return conflict !== null;
}

export async function createBooking(userId: string, data: {
    serviceId: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    state: string;
    accomodations: string;
    shootDate: Date;
    endTime: Date;
}) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.active) {
        return null;
    }

    if (await hasConflict(data.shootDate, data.endTime)) {
        throw new BookingConflictError();
    }

    const booking = await prisma.bookings.create({
        data: {
            ...data,
            userId
        },
        include: { service: true }
    });

    try {
        const eventId = await createCalendarEvent(booking);
        if (eventId) {
            return prisma.bookings.update({
                where: { id: booking.id },
                data: { googleEventId: eventId },
                include: { service: true }
            });
        }
    } catch (error) {
        console.error("Failed to create Google Calendar event", error);
    }

    return booking;
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

export async function updateBookingStatus(session: Session, data:{id: string, serviceId: string, userId: string, streetAddress: string, zipCode: string, city: string, state: string, accomodations: string, shootDate: Date, endTime: Date, status: BookingStatus}){
    const isAdmin = session.user.role === "Admin";
    if(isAdmin){
        const [service, user] = await Promise.all([
            prisma.service.findUnique({ where: { id: data.serviceId } }),
            prisma.user.findUnique({ where: { id: data.userId } })
        ]);
        if (!service || !user) {
            return null;
        }

        const existing = await prisma.bookings.findUnique({ where: { id: data.id } });

        if (data.status !== "CANCLED" && await hasConflict(data.shootDate, data.endTime, data.id)) {
            throw new BookingConflictError();
        }

        const updateBooking = await prisma.bookings.update({
            where:{id: data.id},
            data: {
                serviceId: data.serviceId,
                userId: data.userId,
                streetAddress: data.streetAddress,
                zipCode: data.zipCode,
                city: data.city,
                state: data.state,
                accomodations: data.accomodations,
                shootDate: data.shootDate,
                endTime: data.endTime,
                status: data.status
            },
            include: { service: true }
        })

        if (existing?.googleEventId) {
            try {
                if (data.status === "CANCLED") {
                    await deleteCalendarEvent(existing.googleEventId);
                    await prisma.bookings.update({
                        where: { id: data.id },
                        data: { googleEventId: null }
                    });
                } else {
                    await updateCalendarEvent(existing.googleEventId, updateBooking);
                }
            } catch (error) {
                console.error("Failed to sync Google Calendar event", error);
            }
        }

        return updateBooking;
    }

}
