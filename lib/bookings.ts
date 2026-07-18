import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

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
