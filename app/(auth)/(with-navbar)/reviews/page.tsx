"use client";
import{useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import LightRays from '@/components/LightRays';
interface Reviews{
    user: { name: string },
    id: string,
    title?: string,
    description: string,
    rating: number,
    createdAt: string
}
export default function Reviews() {
    const {data: session} = useSession()

    const isAdmin = session?.user?.role === "Admin"
    const isUser = session?.user?.role === "User"
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [reviews, setReviews] = useState<Reviews[]>([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rating: 1
    })
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    useEffect(() =>{
        setLoading(true)
        setError('')
        setSuccess('')
        fetch('/api/reviews')
        .then(res => res.json())
        .then(data => setReviews(data.reviews ?? []))
        .finally(() => setLoading(false))
        .catch(() => setError("Failed to load?"))
    },[])

    const handleClick = () =>{
        setLoading(true)
        try{
            setFormData({
                title: '',
                description:'',
                rating:1
            })
            setDeletingId(null)
            setShowForm(prev => !prev)
        }
        catch{
            setError("Please try again")
        }finally{
            setSuccess("Review added successfully")
        }
    }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'rating' ? Number(value) : value
    })
  }

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try{
            const response = await fetch('/api/reviews',{
                method: 'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if(!response.ok){
                setError(data.error)
            }
            else{
                setSuccess("Review Posted Successfully")
                setReviews(prev => [data.review, ...prev])
                setShowForm(prev => !prev)
            }
        } catch{
            setError("Something went wrong, please try again")
        }finally{
            setLoading(false)
        }
    }
    const handleDelete = async (id: string) => {
        setDeletingId(id)
        setError('')
        setSuccess('')
        try{
            const response = await fetch('/api/reviews',{
                method: "DELETE",
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({id})
            })
            const data = await response.json()
            if(!response.ok){
                setError(data.error)
            } else {
                setReviews(prev => prev.filter(r => r.id !== id))
                setSuccess("Review deleted successfully")
            }
        } catch{
            setError("Something went wrong, please try again")
        } finally{
            setDeletingId(null)
        }
    }
  return (
    <div className='flex bg-neutral-900 min-h-screen relative'>
      <div className="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
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
      <div className='relative w-full mt-25'>
                {isUser &&(
                    
                    <button className='justify-right hover: bg-amber-600 not-hover:bg-amber-300 border shadow-2xl border-yellow-600 p-2 rounded-3xl' onClick={handleClick}>{showForm ? 'Cancel' : 'Add Review'}</button>
                )}
                {showForm &&(
                    <form onSubmit={handleSubmit} className='hover: bg-amber-600 not-hover:bg-amber-300'>
                        <div className='fixed inset-0 z-50 justify-center items-center flex flex-col'>
                        <input
                            name="title"
                            placeholder="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="border px-2 py-1 text-yellow-200"
                        />
                        <input
                            name='description'
                            placeholder='Description'
                            value={formData.description}
                            onChange={handleChange}
                            className='border px-2 py-1 text-yellow-200'/>
                        <input
                            type='number'
                            placeholder='Rating'
                            name='rating'
                            min={1}
                            max={5}
                            value={formData.rating}
                            onChange={handleChange}
                            className='border px-2 py-1 text-yellow-200'/>
                        <button type='submit' onSubmit={() => handleSubmit} className='border px-2 py-1 text-yellow-200'>Submit</button>
                    </div>
                    </form>
                )}
            <div className='flex flex-row flex-wrap justify-center gap-4 w-full'>
                {reviews.map(r => (
                    <div className="mt-20 relative flex flex-col text-2xl gap-2 p-8 border rounded-2xl text-yellow-100" key={r.id}>
                    <div className='font-dancing-script text-5xl text-yellow-200'>
                    {r.user.name}
                    </div>
                    {r.rating}/5
                    <div>
                    Title: {r.title}
                    </div>
                    {r.description}
                        {isAdmin && (
                        
                        <button className= "border rounded-3xl hover:bg-red-700 not-hover:bg-red-400 max-w-25" onClick={() => handleDelete(r.id)}>Delete</button>
                         
                        )}
                    </div>
                ))}
            </div>
      </div>
    </div>
  )
}
