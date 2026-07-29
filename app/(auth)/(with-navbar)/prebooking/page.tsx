"use client";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import {useState,useEffect} from "react"
import LightRays from '@/components/LightRays'

interface Booking {
    id: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    status: string;
    service: { name: string };
}

export default function Prebooking() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
    useEffect(() =>{
        setLoading(true)
        fetch('/api/bookings')
            .then(res => res.json())
            .then(data => setBookings(data.bookings ?? []))
            .catch(()=> setError('failed to load bookings, try refreshing the page'))
            .finally(() => setLoading(false))
    }, [])
    const upcomingBooking = bookings.filter(b => b.status === "PENDING" || b.status === "CONFIRMED")
    const pastBooking = bookings.filter(b=> b.status === "COMPLETED" || b.status === "CANCLED")

    return (

        <div className='bg-neutral-900 min-h-screen p-30'>
            <div className ="absolute top-0 left-0 w-full h-full z-0">
                <LightRays
                    raysOrigin="top-right"
                    raysColor="#ffe89f"
                    raysSpeed={0.8}
                    lightSpread={0.6}
                    rayLength={3}
                    followMouse={true}
                    mouseInfluence={0.4}
                    noiseAmount={0}
                    distortion={0}
                    className="custom-rays"
                    pulsating={false}
                    fadeDistance={1.3}
                    saturation={0.4}
                />
                </div>
            {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-end relative z-10">
            <AnimateIcon animateOnHover asChild>
                    <a
                        href="/bookings"
                        className="font-dancing-script flex items-center font-bold text-6xl text-yellow-200">
                        Booking!
                        <ArrowRight />
                    </a>
                </AnimateIcon>
                </div>
            <div className="flex flex-row items-start gap-2 w-full mt-10 relative">
                {loading ? (
                <div className="w-full text-center text-yellow-100 font-bodoni-moda">Loading bookings...</div>
                ) : (
                <>
                <div className='flex flex-1 flex-col text-center mb-10'>
                <h1 className=" text-5xl font-bold font-dancing-script mb-5 text-yellow-200">Upcoming</h1>
                <div className="flex flex-col gap-2 text-yellow-100 font-bodoni-moda">
                {upcomingBooking.length === 0 ? (
                    <div>No upcoming bookings</div>
                ) : (
                    upcomingBooking.map(b =>(
                    <div key={b.id}>
                        {b.streetAddress}, {b.city}, {b.state}, {b.zipCode}, {b.service.name} | <div className="text-green-600">{b.status}</div>
                    </div>
                    ))
                )}
                </div>
                </div>
                <div className='flex flex-1 flex-col text-center '>
                <h1 className=" text-5xl font-bold font-dancing-script mb-5 text-yellow-200">Past</h1>
                <div className="flex flex-col gap-2 text-yellow-100 font-bodoni-moda">
                {pastBooking.length === 0 ? (
                    <div>No past bookings</div>
                ) : (
                    pastBooking.map(b =>(
                    <div  key={b.id}>
                        {b.streetAddress}, {b.city}, {b.state}, {b.zipCode}, {b.service.name} | <div className="text-red-600">{b.status}</div>
                    </div>
                    ))
                )}
                </div>
                </div>
                </>
                )}
                </div>
            </div>
    )
    }
