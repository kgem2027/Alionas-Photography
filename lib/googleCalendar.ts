import { google } from "googleapis";

const calendarId = process.env.GOOGLE_CALENDAR_ID as string;

function getAuth() {
    return new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: (process.env.GOOGLE_CLIENT_KEY ?? "").replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });
}

function getCalendar() {
    return google.calendar({ version: "v3", auth: getAuth() });
}

export async function createCalendarEvent(booking: {
    id: string;
    shootDate: Date;
    endTime: Date;
    streetAddress: string;
    zipCode: string;
    city: string;
    state: string;
    accomodations: string;
    service: { name: string };
}) {
    const calendar = getCalendar();
    const start = new Date(booking.shootDate);
    const end = new Date(booking.endTime);

    const event = await calendar.events.insert({
        calendarId,
        requestBody: {
            summary: `${booking.service.name} - Booking`,
            location: `${booking.streetAddress}, ${booking.city}, ${booking.state} ${booking.zipCode}`,
            description: booking.accomodations
                ? `Accommodations: ${booking.accomodations}\nBooking ID: ${booking.id}`
                : `Booking ID: ${booking.id}`,
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() },
        },
    });

    return event.data.id ?? null;
}

export async function updateCalendarEvent(
    eventId: string,
    booking: {
        id: string;
        shootDate: Date;
        endTime: Date;
        streetAddress: string;
        zipCode: string;
        city: string;
        state: string;
        accomodations: string;
        service: { name: string };
    }
) {
    const calendar = getCalendar();
    const start = new Date(booking.shootDate);
    const end = new Date(booking.endTime);

    await calendar.events.update({
        calendarId,
        eventId,
        requestBody: {
            summary: `${booking.service.name} - Booking`,
            location: `${booking.streetAddress}, ${booking.city}, ${booking.state} ${booking.zipCode}`,
            description: booking.accomodations
                ? `Accommodations: ${booking.accomodations}\nBooking ID: ${booking.id}`
                : `Booking ID: ${booking.id}`,
            start: { dateTime: start.toISOString() },
            end: { dateTime: end.toISOString() },
        },
    });
}

export async function deleteCalendarEvent(eventId: string) {
    const calendar = getCalendar();
    await calendar.events.delete({ calendarId, eventId });
}
