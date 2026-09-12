import {useState} from 'react'
import { Link } from "react-router-dom";

function register() {
      // For Form Inputs
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [name, setName] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");

      const handleSubmit = (e) => {
        e.preventDefault();
    };
  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-sky-100 shadow-xl rounded-2xl p-8">

        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-sky-600">
            Quick-Kart
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create your account
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5
                text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5
              text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5
              text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
            />
          </div>

          {/* Confirm Password */}
          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5
                text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
              />
            </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600
            text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
          >
            Create Account
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-sky-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default register