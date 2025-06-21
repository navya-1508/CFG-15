import React, { useState } from "react";
import { Link } from "react-router-dom";

const students = [
  { name: "Aarav Singh", email: "aarav@example.com", progress: 90 },
  { name: "Meera Iyer", email: "meera@example.com", progress: 75 },
  { name: "Rahul Das", email: "rahul@example.com", progress: 50 },
  { name: "Neha Patel", email: "neha@example.com", progress: 30 },
  { name: "Kiran Rao", email: "kiran@example.com", progress: 10 },
];

export default function StudentData() {
  const [showDropdown, setShowDropdown] = useState(false);
  const total = students.length;
  const avgProgress =
    students.reduce((sum, student) => sum + student.progress, 0) / total;

  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md relative">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6 relative">
          <Link to="/studentdata" className="underline font-semibold">
            StudentData
          </Link>

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
          <Link to="/grievance" className="hover:underline">Grievance</Link>
          <Link to="/trainerprofile" className="hover:underline">
            Profile
          </Link>
        </nav>
      </header>

      {/* Page Heading */}
      <h1 className="text-3xl font-bold text-center mt-8 mb-4">
        Student Progress Dashboard
      </h1>

      {/* Statistics Summary */}
      <div className="flex flex-col sm:flex-row justify-center gap-8 mb-10 px-4">
        <div className="bg-blue-100 p-4 rounded shadow text-center w-60">
          <p className="text-lg font-semibold">Total Students</p>
          <p className="text-2xl font-bold mt-2">{total}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center w-60">
          <p className="text-lg font-semibold">Avg Completion</p>
          <p className="text-2xl font-bold mt-2">{avgProgress.toFixed(1)}%</p>
        </div>
      </div>

      {/* Student Cards */}
      <div className="px-4 max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {students.map((student, idx) => (
            <div
              key={idx}
              className="bg-blue-50 p-4 rounded-lg shadow text-center"
            >
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p className="text-sm text-blue-700">{student.email}</p>
              <div className="mt-3 w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{student.progress}% Completed</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
