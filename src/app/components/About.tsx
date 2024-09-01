'use client'
import { useEffect } from "react";
import gsap from "gsap";
import Image from "next/image";

import enhance from '@/assets/ebhabce.jpg';
import powered from '@/assets/aitry.jpg';
import detail from '@/assets/calculatedress.jpg';

export default function About() {
  useEffect(() => {
    gsap.fromTo(
      '.about-item',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }
    );
  }, []);

  return (
    <section id="about" className="py-24 bg-black w-full">
      <div className="max-w-screen-xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl text-white font-bold mb-12">About Our Technology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="about-item p-8 bg-black shadow-white text-white shadow-md rounded-lg">
            <Image src={powered} alt="AI-Powered" className="mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">AI-Powered</h3>
            <p>Advanced AI algorithms ensure precise virtual dress trials.</p>
          </div>
          <div className="about-item p-8 bg-black shadow-white text-white shadow-md rounded-lg">
            <Image src={enhance} alt="Image Enhancement" className="mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Image Enhancement</h3>
            <p>Enhance old images to see them in high resolution with modern outfits.</p>
          </div>
          <div className="about-item p-8 bg-black shadow-white text-white shadow-md rounded-lg">
            <Image src={detail} alt="Garment Details" className="mb-4 mx-auto" />
            <h3 className="text-2xl font-semibold mb-2">Garment Details</h3>
            <p>Extract detailed information about the garment you try on.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
