import React, { useState, useEffect } from "react";
import {
  FaBell, FaUserCircle, FaChartLine, FaClipboardList, FaBookOpen, FaSignOutAlt,
  FaMedal, FaCertificate, FaCommentDots
} from "react-icons/fa";

export default function ChampionDashboard() {
  const [view, setView] = useState("dashboard");
  const [completedSessions, setCompletedSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    role: "Champion",
    profilePic: "/default-profile.png"
  });

  const handleComplete = (idx) => {
    if (!completedSessions.includes(idx)) {
      setCompletedSessions([...completedSessions, idx]);
    }
    setActiveSession(null);
  };

  const badgeCount = Math.floor(completedSessions.length / 3);
  const hasCertificate = completedSessions.length === sessions.length;

  useEffect(() => {
    const fetchData = async () => {
      setUserData({
        name: "Alex Champion",
        email: "alex@example.com",
        role: "Champion",
        profilePic: "/default-profile.png"
      });
      setCompletedSessions([0, 1, 2]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100 font-sans text-gray-800">
      <header className="bg-blue-600 text-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xl font-semibold">
          <FaChartLine /> AquaWatch Champion
        </div>
        <nav className="hidden sm:flex gap-6 text-sm">
          <NavItem label="Dashboard" icon={<FaChartLine />} onClick={() => setView("dashboard")} />
          <NavItem label="Reports" icon={<FaClipboardList />} onClick={() => setView("reports")} />
          <NavItem label="Courses" icon={<FaBookOpen />} onClick={() => setView("courses")} />
          <NavItem label="Logout" icon={<FaSignOutAlt />} onClick={() => alert("Logged out")} />
        </nav>
        <div className="flex gap-3 items-center cursor-pointer" onClick={() => setView("profile")}>
          <FaBell size={18} />
          <FaUserCircle size={24} />
        </div>
      </header>

      <main className="p-6 flex-1">
        {view === "dashboard" && (
          <DashboardHome completedSessions={completedSessions} badgeCount={badgeCount} hasCertificate={hasCertificate} />
        )}
        {view === "courses" && (
          <CoursesSection completedSessions={completedSessions} badgeCount={badgeCount} hasCertificate={hasCertificate} onSelectSession={setActiveSession} />
        )}
        {view === "reports" && <Placeholder label="Reports Section" />}
        {view === "profile" && (
          <ProfileSection userData={userData} completedSessions={completedSessions} badgeCount={badgeCount} hasCertificate={hasCertificate} />
        )}
        {activeSession !== null && (
          <VideoViewer session={sessions[activeSession]} onComplete={() => handleComplete(activeSession)} onClose={() => setActiveSession(null)} />
        )}
      </main>

      <footer className="bg-white text-gray-500 text-center py-3 text-sm shadow-inner">
        © 2025 AquaWatch | Champion Portal
      </footer>
    </div>
  );
}

function NavItem({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 hover:text-blue-300 transition-all">
      {icon}
      <span>{label}</span>
    </button>
  );
}

function DashboardHome({ completedSessions, badgeCount, hasCertificate }) {
  const progressPercent = Math.round((completedSessions.length / sessions.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Reports Submitted" value="12" />
        <StatCard label="Community Impact" value="85 People" />
        <StatCard label="Water Bodies Monitored" value="5" />
        <StatCard label="Current Badges" value={`${badgeCount} 🏅`} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-5">
        <p className="font-medium text-blue-700 mb-2">Course Completion: {progressPercent}%</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full transition-all" style={{ width: `${progressPercent}%` }}></div>
        </div>
        {hasCertificate && (
          <p className="mt-3 text-green-600 font-bold">
            🎉 Congratulations! You’re a Certified Champion!
          </p>
        )}
      </div>
    </div>
  );
}

function CoursesSection({ completedSessions, badgeCount, hasCertificate, onSelectSession }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-5 flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">Progress</p>
          <p className="font-bold text-blue-600">
            {completedSessions.length} / {sessions.length} sessions completed
          </p>
        </div>
        <div className="flex gap-2">
          {[...Array(badgeCount)].map((_, i) => (
            <FaMedal key={i} className="text-yellow-400" size={24} title={`Badge ${i + 1}`} />
          ))}
          {hasCertificate && <FaCertificate className="text-green-500" size={24} title="Certified Champion!" />}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((s, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 cursor-pointer ${
              completedSessions.includes(idx) ? "border-2 border-green-400" : ""
            }`}
            onClick={() => onSelectSession(idx)}
          >
            <div className="bg-blue-100 h-36 flex items-center justify-center rounded">
              <FaBookOpen className="text-blue-600 text-3xl" />
            </div>
            <div className="p-2">
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm text-gray-600">{s.desc}</p>
              {completedSessions.includes(idx) && (
                <p className="text-green-600 font-semibold text-sm mt-1 flex items-center gap-1">
                  <FaCommentDots /> Completed
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSection({ userData, completedSessions, badgeCount, hasCertificate }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 max-w-xl mx-auto">
      <h2 className="font-bold text-lg text-blue-700">Your Profile</h2>
      <div className="flex items-center gap-6">
        <img
          src={userData.profilePic}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
        />
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
        </div>
      </div>
      <p><strong>Completed Sessions:</strong> {completedSessions.length} / {sessions.length}</p>
      <p><strong>Badges:</strong> {badgeCount} 🏅</p>
      {hasCertificate && <p className="text-green-600 font-bold">🎉 Certified Champion!</p>}
    </div>
  );
}

function VideoViewer({ session, onComplete, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden">
        <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
          <h2 className="font-semibold">{session.title}</h2>
          <button onClick={onClose} className="font-bold">×</button>
        </div>
        <video className="w-full" controls onEnded={onComplete}>
          <source src={session.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Comments</h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {session.comments.map((c, idx) => (
              <li key={idx}>💬 {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-blue-700">{value}</p>
    </div>
  );
}

function Placeholder({ label }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500 font-medium">
      {label} — Work in progress
    </div>
  );
}

const sessions = [
  { title: "Session 1", desc: "Introduction to Water Quality", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Great intro!", "Very useful."] },
  { title: "Session 2", desc: "Sampling Techniques", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Good field guidance.", "Loved the examples."] },
  { title: "Session 3", desc: "Measuring pH Levels", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Clear explanation!", "Now I get it."] },
  { title: "Session 4", desc: "Detecting Contaminants", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Helped me understand pollutants.", "Very informative."] },
  { title: "Session 5", desc: "Using AquaWatch Tools", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["The demo was great!", "Practical usage covered well."] },
  { title: "Session 6", desc: "Reporting Data", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Clear on formats!", "Will help with my reports."] },
  { title: "Session 7", desc: "Community Engagement", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Inspired me!", "Good strategies for outreach."] },
  { title: "Session 8", desc: "Case Studies", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Real examples helped a lot.", "Insightful."] },
  { title: "Session 9", desc: "Final Assessment", video: "https://www.w3schools.com/html/mov_bbb.mp4", comments: ["Great wrap up!", "I feel ready now."] }
];
