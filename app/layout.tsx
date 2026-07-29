import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Dancing_Script, Bodoni_Moda } from 'next/font/google';
import Providers from "./Providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Aliona Photography",
  description: "Professional photography services",
};
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-dancing-script',
  display: 'swap',
});

const bodoniModa = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '900'],
  variable: '--font-bodoni-moda',
  display: 'swap',
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", bodoniModa.variable, dancingScript.variable, geist.variable)}>
      <body>
        <Providers>{children}</Providers>
        </body>
    </html>
  );
}

