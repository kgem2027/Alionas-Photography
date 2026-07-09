"use client"
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {signIn} from 'next-auth/react'
import ShinyText from '@/components/ui/ShinyText'
import Image from 'next/image'

export default function Login() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget as HTMLFormElement)
    const email = form.get("email") as string
    const password = form.get("password") as string
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError("Invalid email or password")
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900">
      <div className="w-1/3 flex flex-col">
        <ShinyText text="Welcome Back" speed={3} color="#eed27d" spread={105} direction="right" className="text-2xl font-semibold mb-0 self-end" />
        <Image src="/wing_white.png" alt="Aliona wings" width={500} height={500} className="w-full h-auto mb-6" />
      </div>
      <div className="p-10 w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-300" type="email" name="email" placeholder="Email" required />
          <input className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-300" type="password" name="password" placeholder="Password" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="text-gray-500 text-sm mt-6">Don't have an account? <Link className="text-pink-400 hover:underline" href="/register">Register</Link></p>
      </div>
    </div>
  )
}
