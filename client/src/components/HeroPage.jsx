import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const images = [
  "https://th.bing.com/th/id/OIP.0Jd6QovMRcsAiou1X81BCAHaDa?r=0&rs=1&pid=ImgDetMain&cb=idpwebpc2",
  "https://via.placeholder.com/800x400?text=Water+Image+2",
  "https://via.placeholder.com/800x400?text=Water+Image+3",
];

const newsItems = [
  "🌊 Clean Water Initiatives Ongoing...",
  "📢 New Water Quality Report Released!",
  "💧 Stay Hydrated and Stay Aware!",
];

export default function HeroPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentNews, setCurrentNews] = useState(0);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems.length);
    }, 4000); // News changes every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-blue-900">
      {/* Top Navigation Bar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6">
          <Link to="/about" className="hover:underline">
            About Us
          </Link>
          <a href="#register" className="hover:underline">
            Register
          </a>
        </nav>
      </header>

      {/* Horizontal Scrolling News Bar */}
      <div className="bg-blue-100 overflow-hidden relative h-12 flex items-center">
        <div className="w-full text-center text-blue-800 font-medium text-sm transition-all duration-500 ease-in-out">
          {newsItems[currentNews]}
        </div>
      </div>

      {/* Image Carousel */}
      <div className="flex justify-center items-center py-8 bg-blue-50 relative">
        <button
          onClick={handlePrev}
          className="absolute left-4 text-blue-700 bg-white border rounded-full px-3 py-1 shadow hover:bg-blue-100"
        >
          ◀
        </button>
        <img
          src={images[currentImage]}
          alt={`carousel-${currentImage}`}
          className="w-full max-w-3xl rounded shadow-md"
        />
        <button
          onClick={handleNext}
          className="absolute right-4 text-blue-700 bg-white border rounded-full px-3 py-1 shadow hover:bg-blue-100"
        >
          ▶
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-auto py-6 px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm sm:text-base">
          <div className="mb-4 sm:mb-0">
            <p><strong>Email:</strong> aquawatch@example.com</p>
            <p><strong>Helpline:</strong> +91 12345 67890</p>
          </div>
          <div className="text-center sm:text-right">
            <p>
              <strong>Instagram:</strong>{" "}
              <a
                href="https://instagram.com/aquawatch"
                className="underline hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                instagram.com/aquawatch
              </a>
            </p>
            <p>
              <strong>Twitter:</strong>{" "}
              <a
                href="https://twitter.com/aquawatch"
                className="underline hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                twitter.com/aquawatch
              </a>
            </p>
            <p>
              <strong>YouTube:</strong>{" "}
              <a
                href="https://youtube.com/@aquawatch"
                className="underline hover:text-gray-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                youtube.com/@aquawatch
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
