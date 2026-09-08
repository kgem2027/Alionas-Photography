"use client";
import LightRays from "@/components/LightRays"

export default function Contact() {
  return (
    <div className="flex flex-col bg-neutral-900 text-center justify-center min-h-screen">
            <div className ="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
                <LightRays
                    raysOrigin="top-left"
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
        <div className="">
           <img src='/card.jpg' className="mx-auto"/>
        </div>
    </div>
  )
}
