"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  UserPlus,
  Sparkles,
  Shield,
  Star,
  Phone,
} from "lucide-react";
import { register, createUser } from "@/lib/services/authApi";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    )
      return "All fields are required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
      return "Invalid email address.";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!formData.agreeToTerms) return "You must agree to the terms.";
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
      await register({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Signup failed");
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      email: "",
      skill: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-400 to-emerald-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-md w-full relative z-10">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl mb-6 shadow-lg">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                    Start your journey
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Join thousands of readers and discover your next favorite
                    book in our curated collection.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                        required
                      />
                    </div>
                  </div>

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
                        placeholder="Enter your email address"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label 
                      htmlFor="phone"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
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
                          placeholder="Create a strong password"
                          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-400 bg-gray-100 border-gray-300 rounded focus:ring-emerald-400 focus:ring-2"
                        required
                      />
                    </div>
                    <label
                      htmlFor="agreeToTerms"
                      className="text-sm text-gray-600 leading-6"
                    >
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors underline decoration-emerald-300 hover:decoration-emerald-500"
                      >
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors underline decoration-emerald-300 hover:decoration-emerald-500"
                      >
                        Privacy Policy
                      </a>
                    </label>
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
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-4 rounded-2xl font-semibold hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        Creating your account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </div>
                    )}
                  </motion.button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="/auth/login"
                      className="text-emerald-500 hover:text-emerald-600 font-semibold transition-colors underline decoration-emerald-300 hover:decoration-emerald-500"
                    >
                      Sign in here
                    </a>
                  </p>
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
                    className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
                    Welcome aboard!
                  </h1>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Your account has been created successfully!{" "}
                      <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                        {formData.email}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 text-emerald-500 mr-2" />
                      What's next?
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Check your email for a welcome message
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Complete your profile setup
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Start exploring your personalized book recommendations
                      </li>
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href="/profile"
                      className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-500 hover:to-teal-600 transition-all text-center"
                    >
                      Get Started
                    </motion.a>
                  </div>
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
        className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden"
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
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
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg flex items-center justify-center">
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
          <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl shadow-lg flex items-center justify-center">
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

            {/* Stack of books - Enhanced */}
            <motion.g
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect
                x="140"
                y="300"
                width="170"
                height="18"
                rx="6"
                fill="url(#book1)"
              />
              <rect
                x="145"
                y="280"
                width="160"
                height="18"
                rx="6"
                fill="url(#book2)"
              />
              <rect
                x="150"
                y="260"
                width="150"
                height="18"
                rx="6"
                fill="url(#book3)"
              />
              <rect
                x="155"
                y="240"
                width="140"
                height="18"
                rx="6"
                fill="url(#book4)"
              />

              {/* Book details */}
              <rect
                x="150"
                y="302"
                width="40"
                height="3"
                rx="1"
                fill="rgba(255,255,255,0.6)"
              />
              <rect
                x="155"
                y="282"
                width="35"
                height="3"
                rx="1"
                fill="rgba(255,255,255,0.6)"
              />
              <rect
                x="160"
                y="262"
                width="30"
                height="3"
                rx="1"
                fill="rgba(255,255,255,0.6)"
              />
              <rect
                x="165"
                y="242"
                width="25"
                height="3"
                rx="1"
                fill="rgba(255,255,255,0.6)"
              />
            </motion.g>

            {/* Open book on top - Enhanced */}
            <motion.g
              animate={{
                y: [0, -5, 0],
                rotateX: [0, 5, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M225 180 L170 210 L170 160 L225 130 L280 160 L280 210 Z"
                fill="#FFFFFF"
                stroke="url(#emeraldGradient)"
                strokeWidth="3"
              />
              <line
                x1="225"
                y1="130"
                x2="225"
                y2="210"
                stroke="url(#emeraldGradient)"
                strokeWidth="2"
              />

              {/* Book pages with content */}
              <line
                x1="180"
                y1="170"
                x2="210"
                y2="170"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <line
                x1="180"
                y1="180"
                x2="205"
                y2="180"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <line
                x1="180"
                y1="190"
                x2="215"
                y2="190"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <line
                x1="235"
                y1="170"
                x2="265"
                y2="170"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <line
                x1="235"
                y1="180"
                x2="260"
                y2="180"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
              <line
                x1="235"
                y1="190"
                x2="270"
                y2="190"
                stroke="#D1D5DB"
                strokeWidth="1.5"
              />
            </motion.g>

            {/* Character - Enhanced Student */}
            <motion.g
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <circle
                cx="225"
                cy="100"
                r="30"
                fill="#FEF3C7"
                stroke="url(#emeraldGradient)"
                strokeWidth="3"
              />

              {/* Hair - Modern style */}
              <path
                d="M200 80 Q225 60 250 80 Q240 65 225 65 Q210 65 200 80 Z"
                fill="#10B981"
              />
              <path
                d="M205 75 Q225 70 245 75 L240 70 Q225 65 210 70 Z"
                fill="#059669"
              />

              {/* Eyes with sparkle */}
              <circle cx="215" cy="95" r="3" fill="#1F2937" />
              <circle cx="235" cy="95" r="3" fill="#1F2937" />
              <circle cx="216" cy="93" r="1" fill="#FFFFFF" />
              <circle cx="236" cy="93" r="1" fill="#FFFFFF" />

              {/* Happy smile */}
              <path
                d="M210 110 Q225 120 240 110"
                stroke="#1F2937"
                strokeWidth="2"
                fill="none"
              />

              {/* Body - Casual student look */}
              <rect
                x="205"
                y="130"
                width="40"
                height="60"
                rx="20"
                fill="url(#emeraldGradient)"
              />

              {/* Backpack - Enhanced */}
              <rect
                x="180"
                y="85"
                width="20"
                height="30"
                rx="10"
                fill="url(#tealGradient)"
              />
              <rect
                x="250"
                y="85"
                width="20"
                height="30"
                rx="10"
                fill="url(#tealGradient)"
              />
              <rect
                x="195"
                y="80"
                width="60"
                height="40"
                rx="12"
                fill="url(#darkTeal)"
              />
              <circle cx="225" cy="100" r="8" fill="rgba(255,255,255,0.3)" />

              {/* Arms in welcoming gesture */}
              <ellipse
                cx="185"
                cy="155"
                rx="15"
                ry="25"
                fill="#FEF3C7"
                transform="rotate(-20 185 155)"
              />
              <ellipse
                cx="265"
                cy="155"
                rx="15"
                ry="25"
                fill="#FEF3C7"
                transform="rotate(20 265 155)"
              />
            </motion.g>

            {/* Floating Knowledge Symbols - Enhanced */}
            <motion.g
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="120"
                cy="120"
                r="20"
                fill="url(#blueGradient)"
                opacity="0.9"
              />
              <text
                x="120"
                y="125"
                textAnchor="middle"
                className="text-sm font-bold"
                fill="#FFFFFF"
              >
                A+
              </text>
            </motion.g>

            <motion.g
              animate={{
                y: [0, -15, 0],
                rotate: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <circle
                cx="330"
                cy="140"
                r="18"
                fill="url(#purpleGradient)"
                opacity="0.9"
              />
              <text
                x="330"
                y="145"
                textAnchor="middle"
                className="text-xs font-bold"
                fill="#FFFFFF"
              >
                ∑
              </text>
            </motion.g>

            <motion.g
              animate={{
                x: [0, 10, 0],
                y: [0, -8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <circle
                cx="100"
                cy="280"
                r="15"
                fill="url(#orangeGradient)"
                opacity="0.9"
              />
              <text
                x="100"
                y="285"
                textAnchor="middle"
                className="text-xs font-bold"
                fill="#FFFFFF"
              >
                π
              </text>
            </motion.g>

            <motion.g
              animate={{
                rotate: [0, 15, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <circle
                cx="350"
                cy="300"
                r="16"
                fill="url(#pinkGradient)"
                opacity="0.9"
              />
              <text
                x="350"
                y="305"
                textAnchor="middle"
                className="text-xs font-bold"
                fill="#FFFFFF"
              >
                ♪
              </text>
            </motion.g>

            {/* Success Path Visualization */}
            <motion.g
              animate={{
                opacity: [0.3, 1, 0.3],
                pathLength: [0, 1, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <path
                d="M225 130 Q280 150 320 120 Q350 100 380 140"
                stroke="url(#emeraldGradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="8,4"
                opacity="0.7"
              />
              <circle cx="380" cy="140" r="8" fill="url(#emeraldGradient)">
                <animate
                  attributeName="r"
                  values="6;10;6"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </circle>
            </motion.g>

            {/* Light bulb - Innovation symbol */}
            <motion.g
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <circle cx="300" cy="200" r="12" fill="url(#yellowGradient)" />
              <rect
                x="296"
                y="212"
                width="8"
                height="6"
                rx="2"
                fill="url(#orangeGradient)"
              />
              <path
                d="M296 206 L300 202 L304 206"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                fill="none"
              />
            </motion.g>

            {/* Reading Progress Indicators */}
            <motion.g
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="80"
                cy="200"
                r="25"
                fill="none"
                stroke="url(#emeraldGradient)"
                strokeWidth="4"
                strokeDasharray="20,5"
                opacity="0.6"
              />
              <circle cx="80" cy="200" r="6" fill="url(#emeraldGradient)" />
              <text
                x="80"
                y="205"
                textAnchor="middle"
                className="text-xs font-bold"
                fill="#FFFFFF"
              >
                75%
              </text>
            </motion.g>

            <motion.g
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle
                cx="370"
                cy="220"
                r="20"
                fill="none"
                stroke="url(#tealGradient)"
                strokeWidth="3"
                strokeDasharray="15,3"
                opacity="0.6"
              />
              <circle cx="370" cy="220" r="5" fill="url(#tealGradient)" />
              <text
                x="370"
                y="225"
                textAnchor="middle"
                className="text-xs font-bold"
                fill="#FFFFFF"
              >
                92%
              </text>
            </motion.g>

            {/* Floating Stars - Achievement symbols */}
            <motion.g
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                d="M160 60 L162 66 L168 66 L163 70 L165 76 L160 72 L155 76 L157 70 L152 66 L158 66 Z"
                fill="url(#goldGradient)"
                opacity="0.9"
              />
            </motion.g>

            <motion.g
              animate={{
                y: [0, 15, 0],
                rotate: [0, -120, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <path
                d="M320 50 L321 54 L325 54 L322 57 L323 61 L320 59 L317 61 L318 57 L315 54 L319 54 Z"
                fill="url(#silverGradient)"
                opacity="0.8"
              />
            </motion.g>

            <motion.g
              animate={{
                x: [0, -10, 0],
                y: [0, -5, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              <path
                d="M90 350 L91 353 L94 353 L92 355 L93 358 L90 356 L87 358 L88 355 L86 353 L89 353 Z"
                fill="url(#bronzeGradient)"
                opacity="0.7"
              />
            </motion.g>

            {/* Digital Particles */}
            <motion.g
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                staggerChildren: 0.5,
              }}
            >
              <circle cx="140" cy="100" r="3" fill="#10B981" />
              <circle cx="310" cy="90" r="2.5" fill="#06B6D4" />
              <circle cx="60" cy="320" r="3.5" fill="#8B5CF6" />
              <circle cx="380" cy="380" r="4" fill="#F59E0B" />
              <circle cx="50" cy="150" r="2" fill="#EF4444" />
              <circle cx="400" cy="250" r="3" fill="#EC4899" />
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
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient
                id="emeraldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient
                id="tealGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0D9488" />
              </linearGradient>

              <linearGradient id="darkTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F766E" />
                <stop offset="100%" stopColor="#134E4A" />
              </linearGradient>

              <linearGradient id="book1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>

              <linearGradient id="book2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0891B2" />
              </linearGradient>

              <linearGradient id="book3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              <linearGradient id="book4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>

              <linearGradient
                id="blueGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>

              <linearGradient
                id="orangeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>

              <linearGradient
                id="pinkGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#DB2777" />
              </linearGradient>

              <linearGradient
                id="yellowGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#FACC15" />
              </linearGradient>

              <linearGradient
                id="goldGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>

              <linearGradient
                id="silverGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#E5E7EB" />
                <stop offset="100%" stopColor="#9CA3AF" />
              </linearGradient>

              <linearGradient
                id="bronzeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>

        {/* Enhanced Background Decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-gradient-to-br from-teal-300 to-green-400 rounded-full blur-3xl"></div>
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
                stroke="#10B981"
                strokeWidth="1"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Quote */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-16 right-16 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg max-w-xs"
        >
          <p className="text-sm text-gray-700 italic">
            "A reader lives a thousand lives before he dies..."
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-2">
            - George R.R. Martin
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
