"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LightRays from '@/components/LightRays';
import { RippleButton, RippleButtonRipples } from '@/components/animate-ui/components/buttons/ripple';

interface ServiceOption {
  id: string;
  name: string;
  price: string;
}

export default function Booking() {
  const router = useRouter(); //used to take users to confirmation page after booking is successful
  const [formData, setFormData] = useState({
    serviceId: "",
    location: "",
    accomodations: "",
    shootDate: ""
  })
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [services, setServices] = useState<ServiceOption[]>([])

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data.services ?? []))
      .catch(() => setError('Failed to load services, try refreshing the page.'))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setSuccess("")
    try{
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    const data = await response.json()
  
      if (!response.ok) {
      setError(data.error)
      }
      else{
        setSuccess("Booking Successful")
        setFormData({
          serviceId: "",
          location: "",
          accomodations: "",
          shootDate: ""
        })
        router.push(`/confirmation?id=${data.booking.id}`)
    }}
      catch{
        setError("Something went wrong, Try again.")
      }
    finally{
    setLoading(false)
    }
  }

  
  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col items-center justify-center p-8 relative">
       <div className ="absolute top-0 left-0 w-full h-full z-0">
       <LightRays
                    raysOrigin="bottom-center"
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
      <img className="brightness-75 h-150" src={'/bookingBackdrop.png'} alt={'Booking Backdrop'}/>
      <div className=" px-4 py-2.5 absolute z-1">
        <div className="text-white focus:outline-none focus:border-yellow-300 text-md">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 max-w-75">
            <div className="flex flex-col font-bold text-black gap-4">
          <input className="w-full px-3 py-2 rounded border" placeholder="Location" name="location" value={formData.location} onChange={handleChange}/>
          <input className="w-full px-3 py-2 rounded border font-bold text-black" placeholder="Accommodations" name="accomodations" value={formData.accomodations} onChange={handleChange}/>
          <input className="w-full px-3 py-2 rounded border font-bold text-black" type="date" name="shootDate" value={formData.shootDate} onChange={handleChange}/>
          <select className="w-full px-3 py-2 rounded border font-bold text-black" name="serviceId" value={formData.serviceId} onChange={handleChange}>
            <option value="">Select Service</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>
            ))}
          </select>
          </div>
          <RippleButton type="submit" variant="default" disabled={loading}>
            {loading ? 'Booking...' : 'Book Now'}
            <RippleButtonRipples />
          </RippleButton>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          </div>
        </form>
      </div>
      </div> 
    </div>
  )
  
}
