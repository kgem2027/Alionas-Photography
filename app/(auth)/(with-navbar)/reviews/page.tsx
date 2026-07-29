"use client";
import{useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
interface Reviews{
    id: string,
    title?: string,
    description: string,
    createdAt: string
}
export default function Reviews() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [reviews, setReviews] = useState<Reviews[]>([])
    useEffect(() =>{
        setLoading(true)
        setError('')
        setSuccess('')
        fetch('/api/reviews')
        .then(res => res.json())
        .then(data => setReviews(data.reviews ?? []))
        .finally(() => setLoading(false))
    },[])
  return (
    <div>
      
    </div>
  )
}
