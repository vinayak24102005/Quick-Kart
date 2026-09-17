import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("user");

  // For Form Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password }),
      })

      const data= await response.json()
      if(!response.ok){
        alert(data.message);
        navigate('/login')
        return;
      }
      alert(data.message);
      console.log("JWT Token : ",data.token)
      login(data.token, data.user);
      navigate("/");

    }catch(error){
      alert(error)
    }
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
            Login to your account
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-sm text-sky-600 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-sky-500 hover:bg-sky-600
            text-white font-medium py-2.5 rounded-lg transition shadow-md shadow-sky-100"
          >
           Login
          </button>
        </form>

        {/* Bottom */}
        <p className="text-center text-sm text-gray-500 mt-5">
          New to Quick-Kart?{" "}
          <Link
            to="/register"
            className="text-sky-600 hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;