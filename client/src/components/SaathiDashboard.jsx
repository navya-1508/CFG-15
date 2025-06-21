import React from "react";
import { Link } from "react-router-dom";

const learners = [
 { name: "Aarav Singh", email: "aarav@example.com", progress: 90 },
  { name: "Meera Iyer", email: "meera@example.com", progress: 75 },
  { name: "Rahul Das", email: "rahul@example.com", progress: 50 },
  { name: "Neha Patel", email: "neha@example.com", progress: 30 },
  { name: "Kiran Rao", email: "kiran@example.com", progress: 10 },
];

export default function SaathiDashboard() {
  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6">
          <Link to="/oneonone" className="hover:underline">OneOnOne</Link>
          <Link to="/discussionforum" className="hover:underline">DiscussionForum</Link>
          <Link to="/grievance" className="hover:underline">Grievance</Link>
          <Link to="/saathiprofile" className="hover:underline">Profile</Link>
        </nav>
      </header>

      {/* Welcome Message */}
      <h1 className="text-3xl font-bold text-center mt-10 mb-8">Welcome Saathi</h1>

      {/* Learner Data */}
      <div className="px-4 max-w-6xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {learners.map((user, index) => (
            <div key={index} className="bg-blue-50 p-5 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-blue-700 mb-2">{user.email}</p>
              <p className="text-sm font-medium text-blue-800">Last Question:</p>
              <p className="italic text-blue-600 mt-1">"{user.lastQuestion}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
