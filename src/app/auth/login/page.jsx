"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  BookOpen,
  Star,
  Heart,
  Zap,
} from "lucide-react";
import { loginUser } from "@/lib/services/authApi";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberme: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.email || !formData.password)
      return "All fields are required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return "Invalid email address.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsLoading(true);
    try {
      const res = await loginUser(formData);
      const payload = res?.data?.data;
      if (payload?.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", payload.token);
          if (payload.email) localStorage.setItem("userEmail", payload.email);
          if (payload.name) localStorage.setItem("userName", payload.name);
        }
      }
      const params =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const nextPath = params?.get("next") || "/dashboard";
      window.location.href = nextPath;
    } catch (err) {
      setError(err.message || "Login failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400 to-pink-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl mb-6 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
              Welcome back!
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Continue your literary journey and explore your favorite stories.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="janedoe@mail.com"
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberme"
                  checked={formData.rememberme}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-sky-400 focus:ring-sky-400 border-gray-300 rounded transition-colors"
                />
                <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Remember me
                </span>
              </label>
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="/auth/forgot-password"
                className="text-sm text-sky-500 hover:text-sky-600 transition-colors font-medium"
              >
                Forgot password?
              </motion.a>
            </div>
            {error && (
              <div className="text-red-500 text-sm font-semibold text-center mb-2">
                {error}
              </div>
            )}
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:from-sky-500 hover:to-blue-600 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{" "}
              <motion.a
                whileHover={{ scale: 1.02 }}
                href="/auth/signup"
                className="text-sky-500 hover:text-sky-600 font-semibold transition-colors"
              >
                Sign up
              </motion.a>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Enhanced Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 relative overflow-hidden"
      >
        {/* Floating Elements Animation */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-20"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl shadow-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-32 right-16"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg flex items-center justify-center">
            <Star className="w-5 h-5 text-white" />
          </div>
        </motion.div>

        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-32 left-16"
        >
          <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl shadow-lg flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
        </motion.div>

        {/* Main Illustration */}
        <div className="relative z-10">
          <motion.svg
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            width="450"
            height="450"
            viewBox="0 0 450 450"
            className="drop-shadow-2xl"
          >
            {/* Background Circle */}
            <circle
              cx="225"
              cy="225"
              r="180"
              fill="url(#bgGradient)"
              opacity="0.1"
            />

            {/* Laptop */}
            <rect
              x="140"
              y="280"
              width="170"
              height="110"
              rx="12"
              fill="#1F2937"
            />
            <rect
              x="150"
              y="290"
              width="150"
              height="90"
              rx="6"
              fill="#111827"
            />
            <rect
              x="155"
              y="295"
              width="140"
              height="80"
              rx="4"
              fill="#F8FAFC"
            />

            {/* Laptop Screen Content - Digital Library */}
            <rect
              x="165"
              y="305"
              width="120"
              height="6"
              rx="3"
              fill="#E5E7EB"
            />
            <rect
              x="165"
              y="320"
              width="100"
              height="4"
              rx="2"
              fill="#D1D5DB"
            />
            <rect
              x="165"
              y="330"
              width="110"
              height="4"
              rx="2"
              fill="#D1D5DB"
            />
            <rect x="165" y="340" width="85" height="4" rx="2" fill="#D1D5DB" />

            {/* Book Icons on Screen */}
            <rect
              x="270"
              y="305"
              width="12"
              height="16"
              rx="2"
              fill="#3B82F6"
            />
            <rect
              x="270"
              y="325"
              width="12"
              height="16"
              rx="2"
              fill="#EF4444"
            />
            <rect
              x="270"
              y="345"
              width="12"
              height="16"
              rx="2"
              fill="#10B981"
            />

            {/* Laptop Base */}
            <rect
              x="135"
              y="390"
              width="180"
              height="8"
              rx="4"
              fill="#374151"
            />

            {/* Character - Modern Reader */}
            <circle
              cx="225"
              cy="180"
              r="35"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="3"
            />

            {/* Modern Hair Style */}
            <path
              d="M195 155 Q225 130 255 155 Q245 125 225 125 Q205 125 195 155 Z"
              fill="#8B5CF6"
            />
            <path
              d="M200 150 Q225 140 250 150 L245 145 Q225 135 205 145 Z"
              fill="#A78BFA"
            />

            {/* Eyes with Glasses */}
            <circle
              cx="210"
              cy="175"
              r="18"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <circle
              cx="240"
              cy="175"
              r="18"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <line
              x1="228"
              y1="175"
              x2="232"
              y2="175"
              stroke="#374151"
              strokeWidth="2"
            />
            <circle cx="210" cy="175" r="3" fill="#1F2937" />
            <circle cx="240" cy="175" r="3" fill="#1F2937" />

            {/* Smile */}
            <path
              d="M205 195 Q225 210 245 195"
              stroke="#1F2937"
              strokeWidth="2"
              fill="none"
            />

            {/* Body - Casual Style */}
            <rect
              x="200"
              y="215"
              width="50"
              height="70"
              rx="25"
              fill="#6366F1"
            />

            {/* Arms Typing */}
            <ellipse
              cx="180"
              cy="245"
              rx="12"
              ry="20"
              fill="#FEF3C7"
              transform="rotate(-20 180 245)"
            />
            <ellipse
              cx="270"
              cy="245"
              rx="12"
              ry="20"
              fill="#FEF3C7"
              transform="rotate(20 270 245)"
            />

            {/* Floating Digital Books */}
            <motion.g
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x="80"
                y="120"
                width="45"
                height="35"
                rx="6"
                fill="url(#bookGradient1)"
              />
              <rect
                x="85"
                y="125"
                width="35"
                height="25"
                rx="3"
                fill="rgba(255,255,255,0.3)"
              />
            </motion.g>

            <motion.g
              animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <rect
                x="320"
                y="140"
                width="40"
                height="30"
                rx="5"
                fill="url(#bookGradient2)"
              />
              <rect
                x="325"
                y="145"
                width="30"
                height="20"
                rx="3"
                fill="rgba(255,255,255,0.3)"
              />
            </motion.g>

            <motion.g
              animate={{ y: [0, -6, 0], rotate: [0, 4, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              <rect
                x="70"
                y="320"
                width="35"
                height="28"
                rx="4"
                fill="url(#bookGradient3)"
              />
              <rect
                x="75"
                y="325"
                width="25"
                height="18"
                rx="2"
                fill="rgba(255,255,255,0.3)"
              />
            </motion.g>

            <motion.g
              animate={{ y: [0, 12, 0], rotate: [0, -3, 0] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <rect
                x="340"
                y="300"
                width="50"
                height="40"
                rx="6"
                fill="url(#bookGradient4)"
              />
              <rect
                x="345"
                y="305"
                width="40"
                height="30"
                rx="4"
                fill="rgba(255,255,255,0.3)"
              />
            </motion.g>

            {/* Digital Sparkles */}
            <motion.g
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="130" cy="80" r="4" fill="#F59E0B" />
              <circle cx="350" cy="70" r="3" fill="#EF4444" />
              <circle cx="60" cy="200" r="3.5" fill="#10B981" />
              <circle cx="380" cy="380" r="4" fill="#8B5CF6" />
            </motion.g>

            {/* Gradient Definitions */}
            <defs>
              <linearGradient
                id="bgGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>

              <linearGradient
                id="bookGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              <linearGradient
                id="bookGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>

              <linearGradient
                id="bookGradient3"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient
                id="bookGradient4"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        {/* Enhanced Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-sky-300 to-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full blur-3xl"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="absolute inset-0">
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
