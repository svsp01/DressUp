'use client'
import { useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  useEffect(() => {
    gsap.fromTo(
      ".hero-text",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.3 }
    );
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen bg-video">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/aivideo.mp4"
        autoPlay
        muted
        loop
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 hero-text">
          Revolutionize Your Wardrobe Virtually
        </h1>
        <p className="text-lg md:text-xl mb-8 hero-text">
          Experience the future of fashion with our advanced virtual clothing
          trial app.
        </p>
        <Link href="/try-now">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg hero-text">
            Try Now
          </Button>
        </Link>
      </div>
    </section>
  );
}
