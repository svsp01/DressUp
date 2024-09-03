'use client';
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      text: "This app has completely transformed how I shop for clothes. The virtual trial is incredibly accurate!",
      author: "Jane Doe",
    },
    {
      text: "I love how easy it is to see the details of each garment. It's like having a personal fashion assistant!",
      author: "John Smith",
    },
    {
      text: "The image enhancement feature is amazing. I can see my old photos in a whole new light!",
      author: "Emily Johnson",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [testimonials.length]);

  useEffect(() => {
    if (testimonialsRef.current) {
      gsap.fromTo(
        testimonialsRef.current.querySelectorAll(".testimonial-item"),
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, [currentSlide]);

  return (
    <section id="testimonials" className="py-24 bg-black text-white w-full">
      <div className="max-w-screen-xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div ref={testimonialsRef} className="relative w-full max-w-4xl mx-auto">
          <div className="testimonial-item p-8 mb-8 bg-black shadow-lg rounded-lg relative">
            <Quote className="absolute top-0 left-0 text-6xl text-indigo-200 opacity-50" />
            <p className="text-lg italic mb-4">
            &quot;{testimonials[currentSlide].text}&quot;
            </p>
            <h3 className="text-xl font-semibold">
              - {testimonials[currentSlide].author}
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
