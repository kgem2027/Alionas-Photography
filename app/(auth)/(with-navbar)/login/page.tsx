"use client"
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import {signIn} from 'next-auth/react'
import ShinyText from '@/components/ui/ShinyText'
import Image from 'next/image'
import CircularText from '@/components/CircularText'
import SideRays from '@/components/SideRays'

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
      router.push("/home")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <SideRays speed={2.5} rayColor1="#EAB308" rayColor2="#96c8ff" intensity={2} spread={2} origin="top-left" tilt={0} saturation={1.5} blend={0.75} falloff={1.6} opacity={1.0} className="w-screen h-screen" />

      <div className="fixed bottom-0 right-0">
        <Image src="/authImage1.png" alt="Auth Image" width={300} height={400} className="object-cover" />
        <div className="absolute top-56 left-36">
          <CircularText text="Aliona's Photography " spinDuration={20} onHover="slowDown" radius={105} />
        </div>
      </div>
      <div className="flex flex-row items-center gap-10">
        <div className="flex flex-col">
          <ShinyText text="Welcome Back" speed={3} color="#eed27d" spread={105} direction="right" className="text-2xl font-semibold mb-6 self-end" />
          <div className="p-10 w-full max-w-md">
            <Image src="/authImage2.png" alt="Aliona Buisness Card" width={500} height={500} className="w-full h-auto mb-6" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-300" type="email" name="email" placeholder="Email" required />
              <input className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-yellow-300" type="password" name="password" placeholder="Password" required />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button className="bg-yellow-200 hover:bg-yellow-300 text-yellow-600 font-bold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50" type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>


            <button
              onClick={() => signIn("google", { callbackUrl: "/home" })}
              className="w-full border border-gray-300 text-white py-2.5 rounded-lg text-sm hover:bg-neutral-800 transition-colors"
            >
              Sign in with Google
            </button>
            <p className="text-gray-500 text-sm mt-6">Don't have an account? <Link className="text-yellow-400 hover:underline" href="/register">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
