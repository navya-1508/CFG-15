import React, { useState } from "react";
import { Link } from "react-router-dom";

const learners = [
  { id: 1, name: "Aarav Singh" },
  { id: 2, name: "Meera Iyer" },
  { id: 3, name: "Rahul Das" },
];

export default function OneOnOne() {
  const [selectedLearner, setSelectedLearner] = useState(learners[0]);
  const [messages, setMessages] = useState([
    { sender: "learner", text: "Hi, I have a doubt about water cycles." },
    { sender: "saathi", text: "Sure! Ask your question." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    setMessages([...messages, { sender: "saathi", text: input }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-white text-blue-900 flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="text-xl font-bold">💧 AquaWatch</div>
        <nav className="space-x-6">
          <Link to="/oneonone" className="underline font-semibold">OneOnOne</Link>
          <Link to="/discussionforum" className="hover:underline">DiscussionForum</Link>
          <Link to="/grievance" className="hover:underline">Grievance</Link>
          <Link to="/saathiprofile" className="hover:underline">Profile</Link>
        </nav>
      </header>

      {/* Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Learner List */}
        <aside className="w-64 bg-blue-100 border-r border-blue-300 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Learners</h2>
          {learners.map((learner) => (
            <button
              key={learner.id}
              className={`block w-full text-left px-4 py-2 rounded mb-2 hover:bg-blue-200 ${
                selectedLearner.id === learner.id ? "bg-blue-200 font-bold" : ""
              }`}
              onClick={() => setSelectedLearner(learner)}
            >
              {learner.name}
            </button>
          ))}
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-blue-50">
          <div className="bg-blue-200 px-6 py-4 shadow text-lg font-semibold">
            Chat with {selectedLearner.name}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                  msg.sender === "saathi"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-white text-blue-900 self-start mr-auto border"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="bg-white p-4 border-t flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
