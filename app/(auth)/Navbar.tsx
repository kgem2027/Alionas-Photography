import Link from "next/link";
import { signOut } from "@/lib/auth";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-transparent p-4 flex justify-center gap-4 z-50">
      <Link href="/home" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300">Home</Link>
      <Link href="/prebooking" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Book an Appointment!</Link>
      <Link href="/gallery" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Services</Link>
      <Link href="/contact" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Contact</Link>
      <Link href = "/reviews" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4">Reviews</Link>
      <form action={async () => {
        "use server";
        await signOut();
      }}>
        <button type="submit" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 ml-4 cursor-pointer">Logout</button>
      </form>
    </div>
  )
}
