"use client";
import {useEffect, useState} from "react"
import {useSession} from "next-auth/react"
interface Services {
  id: string,
  name: string,
  price: string,
  description: string,
  active: boolean
}
export default function Services() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "Admin"
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    active: false
  })
  const [services, setServices] = useState<Services[]>([])
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  useEffect(() =>{
      setLoading(true)
          fetch('/api/services')
              .then(res => res.json())
              .then(data => setServices(data.services ?? []))
              .catch(() => setError('Failed to load services'))
              .finally(() => setLoading(false))
      
      } , [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
      
  const handleClick = () => {
    setLoading(true)
    try{
      setFormData({
        name: '',
        price: '',
        description: '',
        active: false
      })
      setEditingId(null)
    setShowForm(prev => !prev)
    }catch{
      setError("Error, Please try again")
    }
    finally{
      setSuccess("Service created successfully")
    }
    setLoading(false)
    setSuccess('')
  }
  const handleExistingServiceClick = (id:string, name: string, price: string, description: string, active: boolean) =>{
    setLoading(true)
    setError('')
    try{
      setEditingId(id)
      setFormData({
        name,
        price,
        description,
        active
      })
      setShowForm(prev => !prev)
    }
    catch{
      setError("Error, Please try again")
    }
    finally{
      setLoading(false)
    }
    }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    if(!editingId){
      try{
        const response = await fetch('/api/services',{
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
          setSuccess("Service created successfully")
          setServices(prev => [...prev, data.service])
          setFormData({
            name: '',
            price: '',
            description: '',
            active: false
          })
        }
      } catch {
        setError("Something went wrong, please try again")
      }
      finally{
        setLoading(false)
      }
    }
    else{
      try{
        const response = await fetch('/api/services',{
          method: 'PUT',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({...formData, id: editingId})
        })
        const data = await response.json()
        if(!response.ok){
          setError(data.error)
        }
        else{
          setServices(prev => prev.map(s => s.id === data.existingService.id ? data.existingService : s))
          setEditingId(null)
          setFormData({
            name: '',
            price: '',
            description: '',
            active: false
          }) 
          
          setShowForm(prev => !prev)
         
        }
      } catch{
        setError("Server Error, Try reloading")
      }
      finally{
        setLoading(false)
      }
    }
  }
  return (
    <div className="bg-neutral-900 min-h-screen p-30">
      {isAdmin && (
        <>
          <button onClick={handleClick} className="text-yellow-200 border px-4 py-2 mb-4">
            {showForm ? "Cancel" : "Add Service"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 max-w-sm">
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border px-2 py-1 text-yellow-200"
              />
              <input
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border px-2 py-1 text-yellow-200"
              />
              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="border px-2 py-1 text-yellow-200"
              />
              <label className="text-yellow-200 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
                Active
              </label>
              {error && <p className="text-red-400">{error}</p>}
              {success && <p className="text-green-400">{success}</p>}
              <button type="submit" disabled={loading} className="text-yellow-200 border px-4 py-2">
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          )}
        </>
      )}
      <div className="justify-center items-center">
        {services.map(s => (
          <div
            onClick={() => handleExistingServiceClick(s.id, s.name, s.price, s.description, s.active)}
            className="text-yellow-200 text-xl flex flex-col hover: bg-yellow-300 not-hover:bg-neutral-900"
            key= {s.id}
          >
           Service: {s.name}, {s.price} | {s.description}
          </div>

        ))}
      </div>
      
    </div>
  )
}
