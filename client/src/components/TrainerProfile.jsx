import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaCommentDots } from "react-icons/fa";

export default function TrainerProfile() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [editing, setEditing] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([0, 1, 2]);
  const [activeLesson, setActiveLesson] = useState(null);

  const [trainer, setTrainer] = useState({
    name: "Praveena",
    role: "Trainer",
    image:
      "https://img.freepik.com/premium-vector/cartoon-illustration-thai-female-teacher-holding-stick-front-blackboard_49924-213.jpg?w=2000",
    videosPosted: 9,
    sessionsConducted: 8,
    studentsHandled: 24,
    bio: "Dedicated trainer passionate about spreading awareness on water conservation and health. Works closely with mentors to create impactful sessions and support students.",
  });

  const [editForm, setEditForm] = useState({
    name: trainer.name,
    image: trainer.image,
  });

  const lessons = [
    {
      title: "Lesson 1: Water Basics",
      desc: "Introduction to Water",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      comments: ["Great intro!", "Very useful."],
    },
    {
      title: "Lesson 2: Sources of Water",
      desc: "Understanding sources",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      comments: ["Good field guidance."],
    },
    {
      title: "Lesson 3: Water Pollution",
      desc: "Types and effects",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      comments: ["Clear explanation."],
    },
    {
      title: "Lesson 4: Conservation",
      desc: "Saving water practices",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      comments: ["Practical info."],
    },
    {
      title: "Lesson 5",
      desc: "Locked lesson",
      video: "",
      comments: [],
    },
    {
      title: "Lesson 6",
      desc: "Locked lesson",
      video: "",
      comments: [],
    },
    {
      title: "Lesson 7",
      desc: "Locked lesson",
      video: "",
      comments: [],
    },
    {
      title: "Lesson 8",
      desc: "Locked lesson",
      video: "",
      comments: [],
    },
    {
      title: "Lesson 9",
      desc: "Locked lesson",
      video: "",
      comments: [],
    },
  ];

  const handleEditChange = (e) => {
    setEditForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setTrainer((prev) => ({
      ...prev,
      name: editForm.name,
      image: editForm.image,
    }));
    setEditing(false);
  };

  const handleCompleteLesson = (index) => {
    if (!completedLessons.includes(index)) {
      setCompletedLessons((prev) => [...prev, index]);
    }
    setActiveLesson(null);
  };

  return (
    <div className="min-h-screen bg-white text-blue-900">
      <header className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6 relative">
          <Link to="/studentdata" className="hover:underline">StudentData</Link>
          <button onClick={() => setShowDropdown(!showDropdown)} className="hover:underline">Upload ⏷</button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50 p-2">
              <Link to="/upload-resource" className="block px-4 py-2 rounded text-blue-800 hover:bg-blue-100">Upload Resource</Link>
              <Link to="/upload-session" className="block px-4 py-2 rounded text-blue-800 hover:bg-blue-100">Upload Session</Link>
            </div>
          )}
          <Link to="/grievance" className="hover:underline font-semibold">Grievance</Link>
          <Link to="/trainerprofile" className="hover:underline font-semibold">Profile</Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Trainer Profile</h1>

        <div className="flex flex-col md:flex-row items-center bg-blue-50 rounded-xl shadow-lg p-8 gap-10 mb-12">
          <div className="text-center">
            <img
              src={trainer.image}
              alt="Trainer"
              className="w-48 h-48 rounded-full border-4 border-blue-600 object-cover"
            />
            <button
              className="mt-4 px-4 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-100 transition"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold">{trainer.name}</h2>
            <p className="text-lg text-blue-700 mb-4">{trainer.role}</p>
            <p className="text-md mb-6">{trainer.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <StatCard label="Videos Posted" value={trainer.videosPosted} />
              <StatCard label="Sessions Conducted" value={trainer.sessionsConducted} />
              <StatCard label="Students Handled" value={trainer.studentsHandled} />
            </div>
          </div>
        </div>

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
                  className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1 text-blue-800">Upload Profile Image (.jpg only)</label>
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
                      alert("Please upload a valid .jpg image.");
                    }
                  }}
                  className="w-full p-2 border border-blue-300 rounded bg-white focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>
        )}

        <h3 className="text-2xl font-bold mb-6 text-center">Uploaded Lessons</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lessons.map((lesson, idx) => (
            <div
              key={idx}
              className={`bg-white rounded shadow p-2 cursor-pointer hover:shadow-lg transition ${
                completedLessons.includes(idx) ? "border-green-500 border-2" : ""
              }`}
              onClick={() => setActiveLesson(idx)}
            >
              <div className="bg-blue-100 h-36 flex items-center justify-center rounded">
                <FaBookOpen className="text-blue-600 text-3xl" />
              </div>
              <div className="p-2">
                <p className="font-semibold">{lesson.title}</p>
                <p className="text-sm text-gray-600">{lesson.desc}</p>
                {completedLessons.includes(idx) && (
                  <p className="text-green-600 font-bold text-sm flex items-center gap-1 mt-1">
                    <FaCommentDots /> Completed
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {activeLesson !== null && (
          <VideoModal
            lesson={lessons[activeLesson]}
            onComplete={() => handleCompleteLesson(activeLesson)}
            onClose={() => setActiveLesson(null)}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div>
      <p className="text-xl font-bold text-blue-600">{value}</p>
      <p className="text-sm text-blue-800">{label}</p>
    </div>
  );
}

function VideoModal({ lesson, onComplete, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-2 border-b">
          <h2 className="font-bold">{lesson.title}</h2>
          <button onClick={onClose} className="text-blue-500 font-bold">X</button>
        </div>
        <video className="w-full" controls onEnded={onComplete}>
          <source src={lesson.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="p-3">
          <h3 className="font-semibold mb-1">Comments</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            {lesson.comments.map((c, i) => (
              <li key={i}>💬 {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
