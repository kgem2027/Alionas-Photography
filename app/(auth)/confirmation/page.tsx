import { auth } from "@/lib/auth";
import { getOwnedBooking } from "@/lib/bookings";
import { redirect } from "next/navigation";

export default async function Confirmation({
    searchParams
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { id } = await searchParams;
    const booking = id ? await getOwnedBooking(id, session) : null;

    return (
        <div className="bg-neutral-900 min-h-screen flex flex-col items-center justify-center p-8 text-white">
            {booking ? (
                <div className="flex flex-col gap-2 max-w-md">
                    <h1 className="text-3xl font-bold text-yellow-200">Booking Confirmed</h1>
                    <p><span className="font-bold">Service:</span> {booking.service.name}</p>
                    <p><span className="font-bold">Location:</span> {booking.location}</p>
                    <p><span className="font-bold">Accommodations:</span> {booking.accomodations}</p>
                    <p><span className="font-bold">Date:</span> {booking.shootDate.toLocaleDateString()}</p>
                    <p><span className="font-bold">Status:</span> {booking.status}</p>
                </div>
            ) : (
                <p className="text-yellow-100">We couldn&apos;t find that booking.</p>
            )}
        </div>
    );
}
