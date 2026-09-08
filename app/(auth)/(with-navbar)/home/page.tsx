"use client";
import LightRays from '@/components/LightRays';

export default function Home() {
    return (
        <div className="bg-neutral-900 min-h-screen flex flex-col items-start justify-start p-8 position-relative">
            <div className ="fixed top-0 left-0 w-full h-screen z-0 pointer-events-none">
                <LightRays
                    raysOrigin="top-center"
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
            <div className="w-full flex flex-col gap-20">
                <div className="w-full flex flex-row justify-between pt-10">
                    <div className="flex flex-col ">
                        <h1 className="text-4xl font-bold text-yellow-200 text-center font-dancing-script">My Story</h1>
                        <p className="text-2xl text-yellow-100 mt-2 text-center font-bodoni-moda">
                            I moved to the United States from Ukraine to start a new chapter of my life.
                            Like many immigrants, I had to build everything from the ground up.
                            While working and creating a life here, I realized I wanted to build something of my own—something meaningful that could preserve people’s most precious moments.
                            That’s how photography became more than a passion; it became my purpose.
                        </p>
                    </div>
                    <div className="relative shrink-0 self-center mx-8 bg-white p-3 pb-10 shadow-xl">
                        <img src="/Miss Liv.png" alt="Miss Liv" className="w-80 object-cover" />
                        <img src="/thumbtack.png" alt="Thumbtack" className="w-8 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
                    </div>
                    <div className="flex flex-col  text-center">
                        <h1 className="text-4xl text-yellow-200 font-bold font-dancing-script">Why I Love Photography</h1>
                        <p className="mt-2  text-center text-yellow-100 text-2xl font-bodoni-moda">
                            I love photography because it has the power to freeze time.
                            My goal isn’t just to create beautiful images, but to capture genuine emotions, personality, and the feeling of each moment.
                            Every session is unique, and I want my clients to feel comfortable, confident, and truly themselves.
                            The greatest reward is knowing they can look back at their photos years later and relive those emotions.
                        </p>    
                    </div>
                </div>

                <div className="w-full flex flex-row justify-between gap-20 text-center">
                    <div className="flex flex-col  order-2">
                        <h1 className="mt-20 text-4xl font-bold text-yellow-200 text-center font-dancing-script">How My Business Started</h1>
                        <p className="text-2xl text-yellow-100 mt-2 font-bodoni-moda">
                            At first, I photographed friends and family while investing every dollar I could into learning, better equipment, and improving my craft.
                            My business started with a simple goal: to create meaningful memories for people.
                            As more people trusted me and recommended my work, my passion naturally grew into my own photography brand.
                        </p>
                    </div>
                    <div className="relative shrink-0 self-center mx-8 bg-white p-3 pb-10 shadow-xl order-3">
                        <img src="/slavicgirl_photo.png" alt="Slavic Girl" className="w-80 object-cover" />
                        <img src="/thumbtack.png" alt="Thumbtack" className="w-8 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
                    </div>
                    <div className="relative shrink-0 self-center mx-8 bg-white p-3 pb-10 shadow-xl order-1">
                        <img src="/girlinchair_photo.png" alt="Girl in Chair" className="w-80 object-cover" />
                        <img src="/thumbtack.png" alt="Thumbtack" className="w-8 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
                </div>
                </div>

                <div className="flex flex-row justify-between w-full text-center gap-20">
                    <div className="flex flex-col ">
                        <h1 className="text-4xl text-yellow-200 font-bold font-dancing-script">Where I Hope to Be in Five Years</h1>
                        <p className="text-2xl text-yellow-100 mt-2 font-bodoni-moda">
                            In five years, I hope to own a well-known photography brand and my own studio while working with clients from different states.
                            I want to photograph families, couples, portraits, and brands, creating timeless images that people will treasure for years to come.
                        </p>
                    </div>
                    <div className="relative shrink-0 self-center mx-8 bg-white p-3 pb-10 shadow-xl ">
                        <img src="/bachelorette_party_photo.png" alt="Bachelorette Party" className="w-80 object-cover" />
                        <img src="/thumbtack.png" alt="Thumbtack" className="w-8 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3" />
                    </div>
                    <div className="flex flex-col ">
                        <h1 className="text-4xl font-bold text-yellow-200 font-dancing-script">My Business Goals</h1>
                        <p className="text-2xl text-yellow-100 mt-2 font-bodoni-moda">
                            My goal is to create more than just beautiful photos—I want to create an unforgettable experience.
                            I want every client to leave feeling confident, beautiful, and truly seen.
                            I will continue investing in my education, improving my style, and building a brand known for quality, trust, elegance, and genuine connection with every client.
                        </p>
                    </div>

                </div>
            </div>
        </div>
       
    )
}
