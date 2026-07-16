"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Booking() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    serviceId: "",
    location: "",
    accomodations: "",
    shootDate: ""
  })
  const [error,setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
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
    }}
      catch{
        setError("Something went wrong, Try again.")
      }
    finally{
    setLoading(false)
    }
  }

  
  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col items-start justify-start p-8 position-relative">
      
    </div>
  )
  
}
