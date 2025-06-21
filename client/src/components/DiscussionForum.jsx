import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function DiscussionForum() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "Aarav Singh (Champion)",
      question: "Can someone explain groundwater sources?",
      answer: "Sure! Groundwater comes from aquifers beneath the earth’s surface.",
    },
    {
      id: 2,
      user: "Neha Patel (Champion)",
      question: "How can we purify river water?",
      answer: null,
    },
    {
      id: 3,
      user: "Rahul Das (Champion)",
      question: "Why is rainwater harvesting important?",
      answer: null,
    },
  ]);

  const handleAnswer = (id, answer) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, answer } : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-white text-blue-900">
      {/* Navbar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6">
          <Link to="/oneonone" className="hover:underline">OneOnOne</Link>
          <Link to="/discussionforum" className="underline font-semibold">DiscussionForum</Link>
          <Link to="/grievance" className="hover:underline">Grievance</Link>
          <Link to="/saathiprofile" className="hover:underline">Profile</Link>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-10">Welcome Saathi – Discussion Forum</h1>

        {/* Questions and Answers List */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-blue-200 rounded-lg shadow p-4"
            >
              <p className="font-semibold text-blue-700">{post.user}</p>
              <p className="mt-2 text-gray-800">{post.question}</p>

              {post.answer ? (
                <div className="mt-4 bg-blue-100 p-3 rounded text-blue-900">
                  <p className="text-sm text-blue-800 font-semibold">Your Answer:</p>
                  <p>{post.answer}</p>
                </div>
              ) : (
                <SaathiAnswerForm postId={post.id} onSubmit={handleAnswer} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Saathi Answer Box
function SaathiAnswerForm({ postId, onSubmit }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(postId, answer);
    setAnswer("");
  };

  return (
    <div className="mt-4">
      <textarea
        rows="2"
        placeholder="Type your reply here..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSubmit}
        className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
      >
        Post Answer
      </button>
    </div>
  );
}
