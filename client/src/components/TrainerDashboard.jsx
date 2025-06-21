import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaCommentDots } from "react-icons/fa";

export default function TrainerDashboard() {
  const [showLessons, setShowLessons] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCourseClick = () => setShowLessons(true);

  const handleCompleteLesson = (index) => {
    if (!completedLessons.includes(index)) {
      setCompletedLessons([...completedLessons, index]);
    }
    setActiveLesson(null);
  };

  const lessons = [
    {
      title: "Lesson 1: Water Basics",
      desc: "Understand the fundamentals of water.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      img: "https://image.slidesharecdn.com/waterbasicsmodified-110131100029-phpapp02/95/water-basics-14-1024.jpg?cb=1296468807",
    },
    {
      title: "Lesson 2: Sources of Water",
      desc: "Learn about natural water sources.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      img: "https://i.ytimg.com/vi/5YZUSnlDFuY/maxresdefault.jpg",
    },
    {
      title: "Lesson 3: Water Pollution",
      desc: "Understand causes and effects.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      img: "https://th.bing.com/th/id/OIP.hB0s83O0xiAr5M9wVENa3gHaFo",
    },
    {
      title: "Lesson 4: Conservation",
      desc: "Tips to conserve water.",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      img: "https://econaur.com/wp-content/uploads/2019/08/207890-5-1.jpg",
    },
    {
      title: "Lesson 5: Locked",
      desc: "Locked until previous lessons are completed.",
      video: null,
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 6: Locked",
      desc: "Locked until previous lessons are completed.",
      video: null,
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 7: Locked",
      desc: "Locked until previous lessons are completed.",
      video: null,
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 8: Locked",
      desc: "Locked until previous lessons are completed.",
      video: null,
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
    {
      title: "Lesson 9: Locked",
      desc: "Locked until previous lessons are completed.",
      video: null,
      img: "https://via.placeholder.com/300x180?text=Locked",
      locked: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="relative space-x-6 flex items-center">
          <Link to="/studentdata" className="hover:underline">StudentData</Link>
          <div className="relative inline-block">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="hover:underline"
            >
              Upload ⏷
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-lg shadow-lg z-50 p-2">
                <Link to="/upload-resource" className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800">
                  Upload Resource
                </Link>
                <Link to="/upload-session" className="block px-4 py-2 rounded hover:bg-blue-100 text-blue-800">
                  Upload Session
                </Link>
              </div>
            )}
          </div>
          <Link to="/grievence" className="hover:underline">Grievance</Link>
          <Link to="/trainerprofile" className="hover:underline">Profile</Link>
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
          src="https://aqtros.com/wp-content/uploads/2021/07/Webp.net-resizeimage-1.jpg"
          alt="Course"
          className="rounded-t-xl w-full"
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold text-center">Water Awareness Course</h2>
          <div className="mt-3 w-full bg-blue-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-center mt-1 text-blue-700">
            {Math.floor((completedLessons.length / lessons.length) * 100)}% Completed
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      {showLessons && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-10">
          {lessons.map((lesson, idx) => {
            const isLocked = lesson.locked || idx > completedLessons.length;
            const isCompleted = completedLessons.includes(idx);
            return (
              <div
                key={idx}
                className={`rounded-lg shadow p-3 cursor-pointer hover:shadow-lg transition ${
                  isLocked ? "bg-blue-200 opacity-60 cursor-not-allowed" : "bg-white"
                }`}
                onClick={() => !isLocked && setActiveLesson(idx)}
              >
                <div className="bg-blue-100 h-40 flex items-center justify-center rounded">
                  <img
                    src={lesson.img}
                    alt={lesson.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div className="mt-2">
                  <p className="font-semibold">{lesson.title}</p>
                  <p className="text-sm text-gray-600">{lesson.desc}</p>
                  {isCompleted && (
                    <p className="text-green-600 font-bold text-sm flex items-center gap-1 mt-1">
                      <FaCommentDots /> Completed
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Viewer */}
      {activeLesson !== null && (
        <VideoViewer
          lesson={lessons[activeLesson]}
          onComplete={() => handleCompleteLesson(activeLesson)}
          onClose={() => setActiveLesson(null)}
        />
      )}
    </div>
  );
}

function VideoViewer({ lesson, onComplete, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-blue-800">{lesson.title}</h2>
          <button onClick={onClose} className="text-blue-500 font-bold">X</button>
        </div>
        <video className="w-full" controls onEnded={onComplete}>
          <source src={lesson.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="p-4">
          <p className="text-sm text-gray-500">Watch the video to complete this lesson.</p>
        </div>
      </div>
    </div>
  );
}
