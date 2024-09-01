'use client';
import gsap from "gsap";
import Image from "next/image";
import { useEffect } from "react";
import img1 from "@/assets/aitry.jpg";
import img2 from "@/assets/enhancde2.jpg";
import img3 from "@/assets/dressup.jpg";
import img4 from "@/assets/ai-dressing.jpg";

export default function Features() {
  useEffect(() => {
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
    );
  }, []);

  return (
    <section id="features" className="py-24 bg-black text-white w-full">
      <div className="max-w-screen-xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card p-8 shadow-white shadow-sm rounded-lg transform hover:scale-105 transition duration-300">
            <Image
              src={img3}
              alt="Virtual Dress Change"
              className="mb-4 mx-auto"
            />
            <h3 className="text-2xl font-semibold mb-2">
              Virtual Dress Change
            </h3>
            <p>
              Try on different outfits virtually and see how they look on you.
            </p>
          </div>
          <div className="feature-card p-8 shadow-white shadow-sm rounded-lg transform hover:scale-105 transition duration-300">
            <Image
              src={img2}
              alt="Image Enhancement"
              className="mb-4 mx-auto"
            />
            <h3 className="text-2xl font-semibold mb-2">Image Enhancement</h3>
            <p>Enhance your old photos to view them in the latest fashion.</p>
          </div>
          <div className="feature-card p-8 shadow-white shadow-sm rounded-lg transform hover:scale-105 transition duration-300">
            <Image src={img1} alt="Garment Details" className="mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Garment Details</h3>
            <p>Extract and view detailed information about the garments.</p>
          </div>
          <div className="feature-card p-8 shadow-white shadow-sm rounded-lg transform hover:scale-105 transition duration-300">
            <Image src={img4} alt="Chat Assistant" className="mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Chat Assistant</h3>
            <p>Get fashion advice and support through our AI chat assistant.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
