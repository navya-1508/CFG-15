import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-blue-900">
      {/* Top Navigation Bar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <a href="#register" className="hover:underline">
            Register
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          About AquaWatch NGO
        </h1>

        <p className="max-w-3xl text-center text-lg">
          AquaWatch is a non-profit organization dedicated to promoting clean water access,
          sustainable usage, and water quality awareness in rural and urban regions across India.
        </p>

        <img
          src="https://via.placeholder.com/800x400?text=Community+Water+Project"
          alt="Water Project"
          className="w-full max-w-3xl rounded-lg shadow-md"
        />

        <p className="max-w-3xl text-center text-lg">
          Our mission is to build community-led initiatives that ensure every individual has access
          to safe and clean drinking water. We collaborate with local governments and volunteers to
          install filtration systems, educate about water hygiene, and monitor water sources.
        </p>

        <img
          src="https://via.placeholder.com/800x400?text=Volunteers+in+Action"
          alt="Volunteers"
          className="w-full max-w-3xl rounded-lg shadow-md"
        />

        <p className="max-w-3xl text-center text-lg">
          Through our volunteer programs and educational campaigns, AquaWatch aims to inspire a new
          generation to care deeply about water conservation and public health.
        </p>
      </main>

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
