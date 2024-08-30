import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="font-bold text-xl">Dress Up</div>
        <div className="space-x-6">
          <a href="#about" className="hover:text-gray-700">
            About
          </a>
          <a href="#features" className="hover:text-gray-700">
            Features
          </a>
          <a href="#testimonials" className="hover:text-gray-700">
            Testimonials
          </a>
          <Link href="/try-now" className=" text-black px-4 py-2 rounded-lg">
            <Button className="bg-slate-100 hover:bg-slate-200 text-black" size={"lg"}>Try Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
