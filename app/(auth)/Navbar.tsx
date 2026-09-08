import { signOut } from "@/lib/auth";
import PillNav from '@/components/PillNav';

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-transparent p-4 flex justify-center gap-4 z-50">
      <PillNav
        logo="/star_transparent.png"
        items={[
          { label: 'Home', href: '/home' },
          { label: 'Book an Appointment!', href: '/prebooking' },
          { label: 'Services', href: '/services' },
          { label: 'Contact', href: '/contact' },
          { label: 'Reviews', href: '/reviews' }
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="bg-transparent"
        pillColor="#FFD359"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
        initialLoadAnimation={false}
      />
      <form action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });

      }} className="absolute top-4 right-4">
        <button type="submit" className="text-white text-lg font-semibold hover:text-yellow-300 transition-colors duration-300 cursor-pointer">Logout</button>
      </form>
    </div>
  )
}
