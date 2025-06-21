import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TrainerDashboard() {
  const [showLessons, setShowLessons] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCourseClick = () => {
    setShowLessons(true);
  };

  const lessons = [
    {
      title: "Lesson 1: Water Basics",
      img: "https://image.slidesharecdn.com/waterbasicsmodified-110131100029-phpapp02/95/water-basics-14-1024.jpg?cb=1296468807",
      locked: false,
    },
    {
      title: "Lesson 2: Sources of Water",
      img: "https://i.ytimg.com/vi/5YZUSnlDFuY/maxresdefault.jpg",
      locked: false,
    },
    {
      title: "Lesson 3: Water Pollution",
      img: "https://th.bing.com/th/id/OIP.hB0s83O0xiAr5M9wVENa3gHaFo?r=0&rs=1&pid=ImgDetMain&cb=idpwebpc2",
      locked: false,
    },
    {
      title: "Lesson 4: Conservation",
      img: "https://econaur.com/wp-content/uploads/2019/08/207890-5-1.jpg",
      locked: false,
    },
    {
      title: "Lesson 5",
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 6",
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 7",
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 8",
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 9",
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar */}
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
            <div className="absolute bg-white text-blue-900 border rounded shadow-md mt-2 py-2 z-50">
              <Link
                to="/upload-resource"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Upload Resource
              </Link>
              <Link
                to="/upload-session"
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Upload Session
              </Link>
            </div>
          )}

          <Link to="/profile" className="hover:underline">Profile</Link>
        </nav>
      </header>

      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mt-10 mb-8">Welcome Trainer</h1>

      {/* Course Card */}
      <div
        className="max-w-xs mx-auto bg-blue-100 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
        onClick={handleCourseClick}
      >
        <img
          src="https://via.placeholder.com/300x180?text=Course+Image"
          alt="Course"
          className="rounded-t-xl w-full"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold text-center">Water Awareness Course</h2>
          <div className="mt-3 w-full bg-blue-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: "40%" }}
            ></div>
          </div>
          <p className="text-sm text-center mt-1 text-blue-700">40% Completed</p>
        </div>
      </div>

      {/* Lessons Grid */}
      {showLessons && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center px-4 pb-10">
          {lessons.map((lesson, idx) => (
            <div
              key={idx}
              className={`rounded-lg shadow p-3 text-center ${
                lesson.locked ? "bg-blue-300 opacity-50 cursor-not-allowed" : "bg-blue-100"
              }`}
            >
              <img
                src={lesson.img}
                alt={lesson.title}
                className="w-full h-32 object-cover rounded mb-2 mx-auto"
              />
              <p className="font-medium">
                {lesson.locked ? `${lesson.title} (Locked)` : lesson.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
