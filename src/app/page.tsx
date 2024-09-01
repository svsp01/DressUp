import About from "./components/About";
import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}
