import Link from "next/link";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-neutral-900 p-4 flex justify-center gap-4 z-50">
      <Link href="/home" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300">Home</Link>
      <Link href="/bookings" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">About</Link>
      <Link href="/gallery" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Services</Link>
      <Link href="/contact" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Contact</Link>
      <Link href = "/reviews" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Reviews</Link>
    </div>
  )
}
