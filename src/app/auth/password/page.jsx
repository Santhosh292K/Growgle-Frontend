"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword, verifyTokenForgot } from "@/lib/services/authApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key,
  ArrowLeft,
  CheckCircle,
  Shield,
  RefreshCw,
  Lock,
} from "lucide-react";

function SetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setError("Invalid or missing token.");
      setVerifying(false);
      setTokenValid(false);
      return;
    }
    setToken(t);
    setVerifying(true);
    verifyTokenForgot(t)
      .then(() => {
        setTokenValid(true);
        setError("");
      })
      .catch((err) => {
        setError(err?.message || "Invalid or expired token.");
        setTokenValid(false);
      })
      .finally(() => setVerifying(false));
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword({ newPassword: password }, token);
      setIsSubmitted(true);
    } catch (err) {
      setError(err?.message || "Failed to set password.");
    }
    setIsLoading(false);
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-md w-full relative z-10">
          <AnimatePresence mode="wait">
            {verifying ? (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center min-h-[300px]"
              >
                <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mb-4" />
                <div className="text-lg font-semibold text-gray-700">
                  Verifying token...
                </div>
              </motion.div>
            ) : !tokenValid ? (
              <motion.div
                key="invalid-token"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center min-h-[300px]"
              >
                <Shield className="w-10 h-10 text-red-400 mb-4" />
                <div className="text-xl font-bold text-red-500 mb-2">
                  Invalid or expired link
                </div>
                <div className="text-gray-600 mb-4">
                  {error ||
                    "The link to set your password is invalid or has expired."}
                </div>
                <motion.a
                  whileHover={{ scale: 1.02, x: -2 }}
                  href="/auth/forgot-password"
                  className="inline-flex items-center text-purple-500 hover:text-purple-600 font-semibold transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to forgot password
                </motion.a>
              </motion.div>
            ) : !isSubmitted ? (
              <motion.div
                key="set-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl mb-6 shadow-lg">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                    Set your new password
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Enter and confirm your new password to secure your account.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm font-semibold text-center">
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
                        Setting password...
                      </div>
                    ) : (
                      "Set password"
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
                    Password set successfully
                  </h1>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Your password has been updated. You can now sign in with
                      your new password.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="w-5 h-5 text-purple-500 mr-2" />
                      Security tip
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-2 text-left">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Use a strong, unique password
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Never share your password with anyone
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-500">
                    Want to set a different password?{" "}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTryAgain}
                      className="text-purple-500 hover:text-purple-600 font-semibold transition-colors underline decoration-purple-300 hover:decoration-purple-500"
                    >
                      Try again
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
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 relative overflow-hidden"
      >
      </motion.div>
    </div>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex">
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-500 mb-4" />
              <div className="text-lg font-semibold text-gray-700">Loading...</div>
            </div>
          </div>
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 relative overflow-hidden" />
        </div>
      }
    >
      <SetPasswordContent />
    </Suspense>
  );
}
