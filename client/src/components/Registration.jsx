import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaUserTag } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

export default function Registration() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !role || !password || (!isLogin && (!email || !confirmPassword))) {
      console.log("❗ All fields are required");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      console.log("❗ Passwords do not match");
      return;
    }

    const payload = isLogin
      ? { username, role, password }
      : { username, email, role, password, confirmPassword };

    console.log("✅ Data ready to send:", payload);

    // Placeholder for API call
    // fetch(isLogin ? '/login' : '/signup', { ... })

    if (!isLogin) {
      console.log("🎉 Signup successful! Switching to login form...");
      setIsLogin(true);
      setUsername('');
      setEmail('');
      setRole('');
      setPassword('');
      setConfirmPassword('');
    } else {
      console.log("🎉 Login successful! (Handle redirect or token storage here)");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute w-64 h-64 bg-blue-100 opacity-40 rounded-full"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-40 h-40 bg-blue-50 opacity-20 rounded-full top-16 right-16"
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

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-80">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isLogin ? 'Login' : 'Sign Up'}
          </h2>

          <button
            type="button"
            className="flex items-center justify-center w-full py-2 mb-4 border rounded-xl bg-white hover:bg-gray-100 transition"
            onClick={() => console.log("Google Sign In clicked")}
          >
            <FcGoogle className="text-xl mr-2" />
            {isLogin ? 'Login with Google' : 'Sign up with Google'}
          </button>

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

              {!isLogin && (
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
              )}

              <div className="flex items-center border rounded-xl px-3 py-2 bg-white/50">
                <FaUserTag className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Role"
                  className="ml-2 w-full outline-none bg-transparent"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
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
                  setUsername('');
                  setEmail('');
                  setRole('');
                  setPassword('');
                  setConfirmPassword('');
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
