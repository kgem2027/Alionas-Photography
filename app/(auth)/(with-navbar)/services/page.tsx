"use client";
import {useEffect, useState} from "react"

export default function Services() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [services, setServices] = useState([])
    useEffect(() =>{
        setLoading(true)
            setLoading(true)
            fetch('/api/services')
                .then(res => res.json())
                .then(data => setServices(data.services ?? []))
                .catch(() => setError('Failed to load services'))
                .finally(() => setLoading(false))
        
        } , [])
  return (
    <div className="bg-neutral-900 min-h-screen p-30">
      Services
    </div>
  )
}
