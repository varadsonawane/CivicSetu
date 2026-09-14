import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DotField from "../components/DotField/DotField";
import { API_URL } from "../config";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully!");

      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen">

      {/* React Bits Dot Field Background */}
      <div className="fixed inset-0 z-0">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={0}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#A855F7"
          gradientTo="#B497CF"
          glowColor="#7A1F5C"
        />
      </div>

      {/* Signup Page */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">

        {/* Signup Box */}
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-sky-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>

          <h1 className="text-3xl font-bold text-gray-800">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join CivicSetu and start making your community better.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your password"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700"
            >
              Create Account
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-sky-600 hover:text-sky-700"
            >
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Signup;