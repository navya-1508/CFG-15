import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function TrainerProfile() {
  const [showDropdown, setShowDropdown] = useState(false);

  const trainer = {
    name: "Praveena",
    role: "Trainer",
    image: "https://img.freepik.com/premium-vector/cartoon-illustration-thai-female-teacher-holding-stick-front-blackboard_49924-213.jpg?w=2000",
    videosPosted: 9,
    sessionsConducted: 8,
    studentsHandled: 24,
    bio: "Dedicated trainer passionate about spreading awareness on water conservation and health. Works closely with mentors to create impactful sessions and support students.",
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
      {/* NavBar */}
      <header className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6 relative">
          <Link to="/studentdata" className="hover:underline">
            StudentData
          </Link>

          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="hover:underline"
          >
            Upload ⏷
          </button>

          {showDropdown && (
            <div className="absolute right-0 bg-white text-blue-900 border rounded shadow-md mt-2 py-2 z-50">
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

          <Link to="/profile" className="hover:underline font-semibold">
            Profile
          </Link>
        </nav>
      </header>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">Trainer Profile</h1>

        <div className="flex flex-col md:flex-row items-center bg-blue-50 rounded-xl shadow-lg p-8 gap-10 mb-12">
          <img
            src={trainer.image}
            alt="Trainer"
            className="w-48 h-48 rounded-full border-4 border-blue-600 object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold">{trainer.name}</h2>
            <p className="text-lg text-blue-700 mb-4">{trainer.role}</p>
            <p className="text-md mb-6">{trainer.bio}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xl font-bold text-blue-600">{trainer.videosPosted}</p>
                <p className="text-sm text-blue-800">Videos Posted</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">{trainer.sessionsConducted}</p>
                <p className="text-sm text-blue-800">Sessions Conducted</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">{trainer.studentsHandled}</p>
                <p className="text-sm text-blue-800">Students Handled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Videos */}
        <div>
          <h3 className="text-2xl font-bold mb-6 text-center">Uploaded Videos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {lessons.map((lesson, index) => (
              <div
                key={index}
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
        </div>
      </div>
    </div>
  );
}
