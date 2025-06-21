import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Grievance() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    grievance: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted grievance:", form);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar 
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6 relative">
          <Link to="/studentdata" className="hover:underline">StudentData</Link>

          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="hover:underline"
          >
            Upload ⏷
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50 p-2">
              <Link
                to="/upload-resource"
                className="block px-4 py-2 rounded text-blue-800 hover:bg-blue-100 hover:text-blue-900"
              >
                Upload Resource
              </Link>
              <Link
                to="/upload-session"
                className="block px-4 py-2 rounded text-blue-800 hover:bg-blue-100 hover:text-blue-900"
              >
                Upload Session
              </Link>
            </div>
          )}
        <Link to="/grievance" className="underline font-semibold">Grievance</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          
        </nav>
      </header>  */}

      {/* Page Heading */}
      <div className="max-w-xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Submit a Grievance</h1>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold">
            ✅ Your grievance has been submitted.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-blue-50 p-6 rounded-lg shadow space-y-5"
          >
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="role" className="block font-medium mb-1">Role</label>
              <input
                type="text"
                name="role"
                id="role"
                required
                value={form.role}
                onChange={handleChange}
                className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label htmlFor="grievance" className="block font-medium mb-1">Grievance</label>
              <textarea
                name="grievance"
                id="grievance"
                rows="5"
                required
                value={form.grievance}
                onChange={handleChange}
                className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit Grievance
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
