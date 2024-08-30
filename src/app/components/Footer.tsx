export default function Footer() {
    return (
      <footer id="footer" className="py-8 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Dress Up. All rights reserved.</p>
          <div className="mt-4">
            <a href="#about" className="hover:underline mx-2">About Us</a>
            <a href="#features" className="hover:underline mx-2">Features</a>
            <a href="#testimonials" className="hover:underline mx-2">Testimonials</a>
            <a href="#" className="hover:underline mx-2">Contact Us</a>
          </div>
        </div>
      </footer>
    );
  }
  