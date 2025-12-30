"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  Shield,
  RefreshCw,
  Key,
  Lock,
} from "lucide-react";
import { forgotPassword } from "@/lib/services/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) return "Email is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
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
      await forgotPassword({ email });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to send reset link");
    }
    setIsLoading(false);
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="forgot-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl mb-6 shadow-lg">
                    <Key className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                    Forgot your password?
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    No worries! Enter your email address and we'll send you a
                    secure link to reset your password.
                  </p>
                </div>

                <div className="space-y-6">
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                        required
                      />
                    </div>
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
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 text-white py-4 rounded-2xl font-semibold hover:from-purple-500 hover:to-indigo-600 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin mr-3" />
                        Sending reset link...
                      </div>
                    ) : (
                      "Send reset link"
                    )}
                  </motion.button>
                </div>

                <div className="mt-8 text-center">
                  <motion.a
                    whileHover={{ scale: 1.02, x: -2 }}
                    href="/auth/login"
                    className="inline-flex items-center text-purple-500 hover:text-purple-600 font-semibold transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </motion.a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center"
              >
                <div className="mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                    Check your email
                  </h1>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      We've sent a secure password reset link to{" "}
                      <span className="font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                        {email}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="w-5 h-5 text-purple-500 mr-2" />
                      What's next?
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Check your email inbox (and spam folder)
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Click the secure reset link in the email
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Create a new strong password
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-500">
                    Didn't receive the email?{" "}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTryAgain}
                      className="text-purple-500 hover:text-purple-600 font-semibold transition-colors underline decoration-purple-300 hover:decoration-purple-500"
                    >
                      Try another email address
                    </motion.button>
                  </p>

                  <motion.a
                    whileHover={{ scale: 1.02, x: -2 }}
                    href="/auth/login"
                    className="inline-flex items-center text-purple-500 hover:text-purple-600 font-semibold transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to sign in
                  </motion.a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Side - Enhanced Illustration */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 relative overflow-hidden"
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl shadow-lg flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
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
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl shadow-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
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
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl shadow-lg flex items-center justify-center">
            <Shield className="w-7 h-7 text-white" />
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

            {/* Email Envelope - Main Focus */}
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x="150"
                y="200"
                width="150"
                height="100"
                rx="12"
                fill="#FFFFFF"
                stroke="url(#purpleGradient)"
                strokeWidth="3"
              />
              <path
                d="M150 200 L225 250 L300 200"
                stroke="url(#purpleGradient)"
                strokeWidth="3"
                fill="none"
              />

              {/* Email content lines */}
              <rect
                x="170"
                y="230"
                width="80"
                height="3"
                rx="1.5"
                fill="#E5E7EB"
              />
              <rect
                x="170"
                y="240"
                width="100"
                height="3"
                rx="1.5"
                fill="#E5E7EB"
              />
              <rect
                x="170"
                y="250"
                width="60"
                height="3"
                rx="1.5"
                fill="#E5E7EB"
              />

              {/* Security shield icon on envelope */}
              <circle cx="260" cy="265" r="12" fill="url(#greenGradient)" />
              <path
                d="M254 265 L258 269 L266 261"
                stroke="#FFFFFF"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>

            {/* Character - Professional Person */}
            <circle
              cx="225"
              cy="120"
              r="35"
              fill="#FEF3C7"
              stroke="#F59E0B"
              strokeWidth="3"
            />

            {/* Professional hairstyle */}
            <path
              d="M195 95 Q225 70 255 95 Q245 75 225 75 Q205 75 195 95 Z"
              fill="#4F46E5"
            />
            <path
              d="M200 90 Q225 80 250 90 L245 85 Q225 75 205 85 Z"
              fill="#6366F1"
            />

            {/* Eyes with glasses */}
            <circle
              cx="210"
              cy="115"
              r="18"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <circle
              cx="240"
              cy="115"
              r="18"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <line
              x1="228"
              y1="115"
              x2="232"
              y2="115"
              stroke="#374151"
              strokeWidth="2"
            />
            <circle cx="210" cy="115" r="3" fill="#1F2937" />
            <circle cx="240" cy="115" r="3" fill="#1F2937" />

            {/* Confident smile */}
            <path
              d="M205 135 Q225 145 245 135"
              stroke="#1F2937"
              strokeWidth="2"
              fill="none"
            />

            {/* Body - Business attire */}
            <rect
              x="200"
              y="155"
              width="50"
              height="70"
              rx="25"
              fill="#4F46E5"
            />

            {/* Arms in welcoming gesture */}
            <ellipse
              cx="180"
              cy="185"
              rx="12"
              ry="20"
              fill="#FEF3C7"
              transform="rotate(-15 180 185)"
            />
            <ellipse
              cx="270"
              cy="185"
              rx="12"
              ry="20"
              fill="#FEF3C7"
              transform="rotate(15 270 185)"
            />

            {/* Floating Security Elements */}
            <motion.g
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="120"
                cy="160"
                r="25"
                fill="none"
                stroke="url(#purpleGradient)"
                strokeWidth="3"
                strokeDasharray="5,5"
              />
              <circle cx="120" cy="160" r="8" fill="url(#purpleGradient)" />
              <path
                d="M116 160 L118 162 L124 156"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>

            <motion.g
              animate={{
                rotate: [360, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="330"
                cy="180"
                r="20"
                fill="none"
                stroke="url(#greenGradient)"
                strokeWidth="3"
                strokeDasharray="3,3"
              />
              <rect
                x="325"
                y="175"
                width="10"
                height="10"
                rx="2"
                fill="url(#greenGradient)"
              />
              <path
                d="M328 178 L330 180 L332 178"
                stroke="#FFFFFF"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </motion.g>

            {/* Password Reset Flow Visualization */}
            <motion.g
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Arrow from person to email */}
              <path
                d="M245 140 Q280 160 260 180"
                stroke="url(#purpleGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
              />

              {/* Arrow from email to lock */}
              <path
                d="M300 240 Q350 260 320 300"
                stroke="url(#greenGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead2)"
              />
            </motion.g>

            {/* New Password Lock */}
            <motion.g
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <rect
                x="290"
                y="320"
                width="60"
                height="40"
                rx="8"
                fill="url(#greenGradient)"
              />
              <rect
                x="300"
                y="330"
                width="40"
                height="20"
                rx="4"
                fill="#FFFFFF"
                opacity="0.3"
              />
              <circle
                cx="320"
                cy="300"
                r="15"
                fill="none"
                stroke="url(#greenGradient)"
                strokeWidth="4"
              />
              <circle cx="320" cy="340" r="3" fill="#FFFFFF" />
            </motion.g>

            {/* Floating Books - Security Themed */}
            <motion.g
              animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x="80"
                y="100"
                width="40"
                height="30"
                rx="4"
                fill="url(#bookGradient1)"
              />
              <rect
                x="85"
                y="105"
                width="30"
                height="20"
                rx="2"
                fill="rgba(255,255,255,0.3)"
              />
              <path
                d="M90 115 L95 110 L105 115"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
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
                x="350"
                y="120"
                width="35"
                height="25"
                rx="3"
                fill="url(#bookGradient2)"
              />
              <rect
                x="355"
                y="125"
                width="25"
                height="15"
                rx="2"
                fill="rgba(255,255,255,0.3)"
              />
              <circle cx="367" cy="132" r="3" fill="#FFFFFF" />
            </motion.g>

            {/* Digital Sparkles */}
            <motion.g
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle cx="150" cy="80" r="4" fill="#A855F7" />
              <circle cx="370" cy="90" r="3" fill="#EC4899" />
              <circle cx="60" cy="280" r="3.5" fill="#10B981" />
              <circle cx="380" cy="350" r="4" fill="#F59E0B" />
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
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>

              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>

              <linearGradient
                id="greenGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient
                id="bookGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              <linearGradient
                id="bookGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>

              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#8B5CF6" />
              </marker>

              <marker
                id="arrowhead2"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
              </marker>
            </defs>
          </motion.svg>
        </div>

        {/* Enhanced Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-pink-300 to-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-br from-indigo-300 to-blue-400 rounded-full blur-3xl"></div>
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
                stroke="#8B5CF6"
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
