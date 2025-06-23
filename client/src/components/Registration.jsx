import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetFields = () => {
    setUsername('');
    setEmail('');
    setRole('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !role || (!isLogin && (!username || !confirmPassword))) {
      alert("❗️ All fields are required");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      alert("❗️ Passwords do not match");
      return;
    }

    const payload = isLogin
      ? { username: email, password, role }
      : { username, email, password, role };

    const endpoint = isLogin ? "/login" : "/register";

    try {
      const res = await fetch(`/api/auth${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(`${isLogin ? 'Login' : 'Register'} response:`, data);

      if (!res.ok) {
        alert(`❌ ${data.error || data.message || "Request failed"}`);
        return;
      }

      if (isLogin) {
        alert("✅ Login successful!");
        switch (data.role) {
          case "champion":
            navigate("/championdashboard");
            break;
          case "saathi":
            navigate("/saathidashboard");
            break;
          case "trainer":
          case "mentor":
            navigate("/trainerdashboard");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      } else {
        alert("✅ Registration successful! Please log in.");
        setIsLogin(true);
        resetFields();
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Network or server error");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 items-center justify-center relative overflow-hidden">
        <motion.div className="absolute w-64 h-64 bg-blue-100 opacity-40 rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute w-40 h-40 bg-blue-50 opacity-20 rounded-full top-16 right-16"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center text-blue-900 z-10"
        >
          <h1 className="text-3xl font-bold drop-shadow-sm">Water Quality Platform</h1>
          <p className="mt-2 text-lg">Empowering change, one drop at a time.</p>
        </motion.div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-80">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ x: isLogin ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <div className="flex items-center border rounded-xl px-3 py-2 bg-white/50">
                  <FaUser className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Username"
                    className="ml-2 w-full outline-none bg-transparent"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center border rounded-xl px-3 py-2 bg-white/50">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="ml-2 w-full outline-none bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center border rounded-xl px-3 py-2 bg-white/50">
                <FaUserTag className="text-gray-400" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="ml-2 w-full outline-none bg-transparent"
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="champion">Champion</option>
                  <option value="saathi">Saathi</option>
                  <option value="trainer">Trainer</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center border rounded-xl px-3 py-2 bg-white/50">
                <FaLock className="text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="ml-2 w-full outline-none bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {!isLogin && (
                <div className="flex items-center border rounded-xl px-3 py-2 bg-white/50">
                  <FaLock className="text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    className="ml-2 w-full outline-none bg-transparent"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition"
              >
                {isLogin ? '→ Login' : '+ Sign Up'}
              </button>
            </motion.form>
          </AnimatePresence>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isLogin ? 'New here? ' : 'Already have an account? '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  resetFields();
                }}
                className="text-blue-500 font-medium hover:underline"
              >
                {isLogin ? 'Create an account' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
