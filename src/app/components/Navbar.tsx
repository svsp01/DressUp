'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-black text-white shadow-lg z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center py-4 px-4 md:px-6 lg:px-8">
        <div className="font-bold text-lg md:text-xl">Dress Up</div>
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <a href="#about" className="hover:text-gray-400 transition duration-300">
            About
          </a>
          <a href="#features" className="hover:text-gray-400 transition duration-300">
            Features
          </a>
          <a href="#testimonials" className="hover:text-gray-400 transition duration-300">
            Testimonials
          </a>
          <Link href="/try-now">
            <Button className="bg-slate-100 hover:bg-slate-200 text-black px-4 py-2 rounded-lg" size={"lg"}>
              Try Now
            </Button>
          </Link>
        </div>
        <div className="md:hidden flex items-center">
          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Collapsible Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white space-y-4 px-4 py-6">
          <a href="#about" className="block hover:text-gray-400 transition duration-300">
            About
          </a>
          <a href="#features" className="block hover:text-gray-400 transition duration-300">
            Features
          </a>
          <a href="#testimonials" className="block hover:text-gray-400 transition duration-300">
            Testimonials
          </a>
          <Link href="/try-now">
            <Button className="bg-slate-100 hover:bg-slate-200 text-black w-full py-2 rounded-lg" size={"lg"}>
              Try Now
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
