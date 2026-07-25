import { auth } from "@/lib/auth";
import { getOwnedBooking } from "@/lib/bookings";
import { redirect } from "next/navigation";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";

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
        <div className="bg-neutral-900 min-h-screen flex flex-col items-center justify-center p-8 text-white relative">
            <AnimateIcon animateOnHover asChild>
                <a
                    href="/home"
                    className="absolute top-25 right-10 flex items-center gap-2 font-bold text-3xl text-yellow-200"
                >
                    
                    Back To Home
                    <ArrowRight />
                </a>
            </AnimateIcon>
            {booking ? (
                <div className="flex flex-col gap-10 border border-amber-200 border-shadow-md text-2xl p-6 rounded-lg bg-neutral-800">
                    <h1 className="text-3xl font-bold text-yellow-200">Booking Confirmed</h1>
                    <p><span className="font-bold">Service:</span> {booking.service.name}</p>
                    <p><span className="font-bold">Location:</span> {booking.streetAddress}, {booking.city}, {booking.state} {booking.zipCode}</p>
                    <p><span className="font-bold">Accommodations:</span> {booking.accomodations}</p>
                    <p><span className="font-bold">Date:</span> {booking.shootDate.toLocaleDateString()}</p>
                    <p><span className="font-bold">Status:</span> {booking.status}</p>
                </div>
            ) : (
                <p className="text-yellow-100">We couldnt find that booking.</p>
            )}
        </div>
    );
}
