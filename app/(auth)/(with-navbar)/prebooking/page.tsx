"use client";
import { ArrowRight } from "@/components/animate-ui/icons/arrow-right";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import {useState,useEffect} from "react"
import LightRays from '@/components/LightRays'
import { BookingStatus } from "@/generated/prisma/client";
import { useSession } from "next-auth/react";

interface Booking {
    id: string;
    userId: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    accomodations: string;
    shootDate: string;
    endTime: string;
    status: BookingStatus;
    service: { id: string; name: string };
}

const STATUS_OPTIONS: BookingStatus[] = ["PENDING", "CONFIRMED", "COMPLETED", "CANCLED"]

export default function Prebooking() {
    const {data: session} = useSession()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [updating, setUpdating] = useState(false)

    useEffect(() =>{
        setLoading(true)
        fetch('/api/bookings')
            .then(res => res.json())
            .then(data => setBookings(data.bookings ?? []))
            .catch(()=> setError('failed to load bookings, try refreshing the page'))
            .finally(() => setLoading(false))
    }, [])

    const isAdmin = session?.user?.role === "Admin"
    const isUser = session?.user?.role === "User"

    const upcomingBooking = bookings.filter(b => b.status === "CONFIRMED")
    const pendingBooking = bookings.filter(b => b.status === "PENDING")
    const pastBooking = bookings.filter(b=> b.status === "COMPLETED" || b.status === "CANCLED")

    const handleStatusChange = async (booking: Booking, status: BookingStatus) => {
        setUpdating(true)
        setError('')
        try{
            const response = await fetch('/api/bookings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: booking.id,
                    serviceId: booking.service.id,
                    userId: booking.userId,
                    streetAddress: booking.streetAddress,
                    zipCode: booking.zipCode,
                    city: booking.city,
                    state: booking.state,
                    accomodations: booking.accomodations,
                    shootDate: booking.shootDate,
                    endTime: booking.endTime,
                    status
                })
            })
            const data = await response.json()
            if(!response.ok){
                setError(data.error)
            } else {
                setBookings(prev => prev.map(b => b.id === booking.id ? data.update : b))
            }
        } catch {
            setError("Something went wrong, please try again")
        } finally {
            setUpdating(false)
            setEditingId(null)
        }
    }

    return (

        <div className='bg-neutral-900 min-h-screen p-30'>
            <div className ="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
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
                {isAdmin &&(
                    <>
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
                      {loading ? (
                    <div className="w-full text-yellow-100 font-bodoni-moda">Loading bookings...</div>
                ) : (
                    <>
                <div className='flex flex-row justify-center text-center mb-10 gap-20 w-full'>
                <div className="flex flex-col gap-2 text-yellow-100 font-bodoni-moda">
                <h1 className=" text-5xl font-bold font-dancing-script mb-5 text-yellow-200">Upcoming</h1>
                {upcomingBooking.length === 0 ? (
                    <div>No upcoming bookings</div>
                ) : (
                    upcomingBooking.map(b =>(
                        <div key={b.id}>
                        {new Date(b.shootDate).toLocaleString()} – {new Date(b.endTime).toLocaleTimeString()} — {b.streetAddress}, {b.city}, {b.state}, {b.zipCode}, {b.service.name} |{" "}
                        {editingId === b.id ? (
                            <select
                                defaultValue={b.status}
                                disabled={updating}
                                onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                                className="bg-neutral-800 text-yellow-200 border rounded"
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        ) : (
                            <div className="text-green-600 cursor-pointer underline inline-block" onClick={() => setEditingId(b.id)}>{b.status}</div>
                        )}
                    </div>
                    ))
                )}
                </div>
                <div className="flex flex-col">
                <h1 className=" text-5xl font-bold font-dancing-script mb-5 text-yellow-200">Pending</h1>
                {pendingBooking.length === 0 ? (
                    <div>No pending bookings</div>
                ) : (
                    pendingBooking.map(b => (
                        <div className="text-yellow-100"key={b.id}>
                        {new Date(b.shootDate).toLocaleString()} – {new Date(b.endTime).toLocaleTimeString()} — {b.streetAddress}, {b.city}, {b.state}, {b.zipCode}, {b.service.name} |{" "}
                        {editingId === b.id ? (
                            <select
                                defaultValue={b.status}
                                disabled={updating}
                                onChange={(e) => handleStatusChange(b, e.target.value as BookingStatus)}
                                className="bg-neutral-800 text-yellow-200 border rounded"
                            >
                                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        ) : (
                            <div className="text-green-600 cursor-pointer underline inline-block" onClick={() => setEditingId(b.id)}>{b.status}</div>
                        )}
                        </div>
                    )
                )
                )}
                </div>
                </div>
                    </>
                )}
                </>
                )}
                {isUser && (
                <>
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
            <div className="flex flex-row justify-center items-start gap-2 w-full mt-10 relative">
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
                        {new Date(b.shootDate).toLocaleString()} – {new Date(b.endTime).toLocaleTimeString()} — {b.streetAddress}, {b.city}, {b.state}, {b.zipCode}, {b.service.name} | <div className="text-green-600">{b.status}</div>
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
                        {new Date(b.shootDate).toLocaleString()} – {new Date(b.endTime).toLocaleTimeString()} — {b.streetAddress}, {b.city}, {b.state}, {b.zipCode}, {b.service.name} | <div className="text-red-600">{b.status}</div>
                    </div>
                    ))
                )}
                </div>
                </div>
                </>
                )}
                </div>
                </>
                )}
            </div>
    )
    }
