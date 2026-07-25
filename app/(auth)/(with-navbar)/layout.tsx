import Navbar from "@/app/(auth)/Navbar";

export default function WithNavbarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Navbar />
    </>
  );
}
