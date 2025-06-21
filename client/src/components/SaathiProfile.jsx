import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SaathiProfile() {
  const [editing, setEditing] = useState(false);
  const [saathi, setSaathi] = useState({
    name: "Ravi",
    role: "Saathi",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    questionsAnswered: [
      "What are the sources of water?",
      "How to conserve water at home?",
      "What causes water pollution?"
    ],
    pendingQuestions: 2, // You can dynamically calculate this later
  });

  const [editForm, setEditForm] = useState({
    name: saathi.name,
    image: saathi.image,
  });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setSaathi((prev) => ({
      ...prev,
      name: editForm.name,
      image: editForm.image,
    }));
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar */}
      <header className="bg-blue-600 text-white flex justify-between px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6">
          <Link to="/oneonone" className="hover:underline">OneOnOne</Link>
          <Link to="/discussionforum" className="hover:underline">DiscussionForum</Link>
          <Link to="/grievance" className="hover:underline">Grievance</Link>
          <Link to="/saathiprofile" className="underline font-semibold">Profile</Link>
        </nav>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Saathi Profile</h1>

        <div className="flex flex-col md:flex-row items-center bg-blue-50 rounded-xl shadow-lg p-8 gap-10 mb-10">
          <div className="text-center">
            <img
              src={saathi.image}
              alt="Saathi"
              className="w-48 h-48 rounded-full border-4 border-blue-600 object-cover"
            />
            <button
              onClick={() => setEditing(true)}
              className="mt-4 px-4 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-100 transition"
            >
              Edit Profile
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold">{saathi.name}</h2>
            <p className="text-lg text-blue-700 mb-6">{saathi.role}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-blue-600">
                  {saathi.questionsAnswered.length}
                </p>
                <p className="text-sm text-blue-800">Questions Answered</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">
                  {saathi.pendingQuestions}
                </p>
                <p className="text-sm text-blue-800">Pending Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="max-w-2xl mx-auto bg-white border border-blue-200 rounded-lg shadow p-6 mb-10">
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1 text-blue-800">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  required
                  className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-800">Upload Image (.jpg only)</label>
                <input
                  type="file"
                  accept=".jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type === "image/jpeg") {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditForm((prev) => ({ ...prev, image: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    } else {
                      alert("Please upload a valid .jpg file.");
                    }
                  }}
                  className="w-full p-2 border border-blue-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {/* Recently Answered Questions */}
        <h3 className="text-2xl font-bold mb-4">Recently Answered Questions</h3>
        <ul className="list-disc list-inside bg-blue-100 rounded p-4">
          {saathi.questionsAnswered.map((q, idx) => (
            <li key={idx} className="mb-2">{q}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
