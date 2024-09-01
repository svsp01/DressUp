export default function Footer() {
  return (
    <footer id="footer" className="py-8 bg-black border-t text-white">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2024 Dress Up. All rights reserved.</p>
        <div className="mt-4 flex flex-wrap justify-center space-x-4 text-sm sm:text-base">
          <a href="#about" className="hover:underline">About Us</a>
          <a href="#features" className="hover:underline">Features</a>
          <a href="#testimonials" className="hover:underline">Testimonials</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
