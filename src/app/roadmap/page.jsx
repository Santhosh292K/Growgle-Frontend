"use client";
import { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import {
  Plus,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Book,
  Award,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  generateRoadmap,
  listRoadmaps,
  createRoadmap,
} from "@/lib/services/roadmapApi";

const RoadmapDashboard = () => {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState([]);
  const [roadmapsLoading, setRoadmapsLoading] = useState(true);
  const [roadmapsError, setRoadmapsError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [newRoadmapTitle, setNewRoadmapTitle] = useState("");
  const [newRoadmapSkills, setNewRoadmapSkills] = useState("");
  const [newRoadmapExperience, setNewRoadmapExperience] = useState("");
  const [newRoadmapDuration, setNewRoadmapDuration] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [animatedProgress, setAnimatedProgress] = useState(
    roadmaps.map(() => 0)
  );

  useEffect(() => {
    const loadRoadmaps = async () => {
      setRoadmapsLoading(true);
      setRoadmapsError("");
      try {
        const { data } = await listRoadmaps();
        console.log(data.data);
        const items = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];
        setRoadmaps(items);
      } catch (e) {
        setRoadmapsError(e?.message || "Failed to load roadmaps");
      } finally {
        setRoadmapsLoading(false);
      }
    };
    loadRoadmaps();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedProgress((prev) =>
          prev.map((val, idx) =>
            roadmaps[idx] && val < (roadmaps[idx].progress || 0) ? val + 2 : val
          )
        );
      }, 20);
      setTimeout(() => clearInterval(interval), 3000);
    }, 600);
    return () => clearTimeout(timeout);
  }, [roadmaps]);

  const predefinedDurations = [
    "1 month",
    "2 months",
    "3 months",
    "4 months",
    "6 months",
    "8 months",
    "10 months",
    "12 months",
  ];

  const clamp = (n, min, max) => {
    const num = Number(n);
    if (Number.isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  };

  const normalizeRoadmap = (roadmapData) => {
    const normStatus = (s) =>
      ["pending", "in-progress", "completed"].includes(String(s))
        ? String(s)
        : "pending";
    const normType = (t) =>
      ["course", "project", "certification"].includes(String(t))
        ? String(t)
        : "course";
    const phases = Array.isArray(roadmapData?.phases)
      ? roadmapData.phases.map((p, pi) => ({
          id: Number.isFinite(Number(p?.id)) ? Number(p.id) : pi + 1,
          title: String(p?.title || `Phase ${pi + 1}`),
          duration: String(p?.duration || ""),
          status: normStatus(p?.status),
          progress: clamp(p?.progress ?? 0, 0, 100),
          milestones: Array.isArray(p?.milestones)
            ? p.milestones.map((m, mi) => ({
                id: Number.isFinite(Number(m?.id)) ? Number(m.id) : mi + 1,
                title: String(m?.title || `Milestone ${mi + 1}`),
                type: normType(m?.type),
                duration: String(m?.duration || ""),
                status: normStatus(m?.status),
                provider: m?.provider ? String(m.provider) : undefined,
              }))
            : [],
        }))
      : [];
    return { ...roadmapData, phases };
  };

  const handleAddRoadmap = async () => {
    setGenerationError("");

    if (!newRoadmapTitle.trim()) {
      setGenerationError("Please enter a course/role name.");
      return;
    }

    if (!newRoadmapDuration) {
      setGenerationError("Please select a duration.");
      return;
    }

    setIsGenerating(true);

    try {
      const skillsArray = newRoadmapSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const { data } = await generateRoadmap({
        roadmapName: newRoadmapTitle,
        skills: skillsArray,
        currentExperience: newRoadmapExperience || "",
        targetDuration: newRoadmapDuration,
      });

      if (!data.success || !data.roadmap) {
        throw new Error(data.error || "Failed to generate roadmap");
      }

      const roadmapData = normalizeRoadmap(data.roadmap);
      const completionRate = roadmapData.completionRate || 0;

      const toSave = {
        title: roadmapData.title || newRoadmapTitle,
        description: `${
          roadmapData.phases?.length || 0
        } phases with personalized milestones`,
        completionRate,
        progress: completionRate,
        totalDuration: roadmapData.totalDuration || newRoadmapDuration,
        startDate: new Date().toISOString().split("T")[0],
        phases: Array.isArray(roadmapData.phases) ? roadmapData.phases : [],
      };

      let created;
      try {
        const saved = await createRoadmap(toSave);
        created = saved?.data?.data ||
          saved?.data?.item ||
          saved?.data || { id: Date.now(), ...toSave };
      } catch (e) {
        console.error("Error saving roadmap:", e);
        created = { id: Date.now(), ...toSave };
      }

      setRoadmaps((prev) => [created, ...prev]);
      setNewRoadmapTitle("");
      setNewRoadmapSkills("");
      setNewRoadmapExperience("");
      setNewRoadmapDuration("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Roadmap generation error:", error);
      setGenerationError(
        error?.response?.data?.error ||
          error.message ||
          "Failed to generate roadmap. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const overallProgress =
    roadmaps.length > 0
      ? Math.round(
          roadmaps.reduce((sum, r) => sum + r.progress, 0) / roadmaps.length
        )
      : 0;
  const totalMonths = roadmaps.reduce(
    (sum, r) => sum + parseInt(r.duration),
    0
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-20">
          {/* Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Career Roadmaps
              </h1>
              <p className="text-gray-600 mt-2">
                Track your learning journey across multiple paths
              </p>
            </div>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add New Roadmap
              </button>
            )}
          </motion.div>

          {/* Overall Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {roadmapsError && (
              <div className="md:col-span-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {roadmapsError}
              </div>
            )}
            {[
              {
                icon: TrendingUp,
                label: "Overall Progress",
                value: `${overallProgress}%`,
                color: "blue",
              },
              {
                icon: Book,
                label: "Active Roadmaps",
                value: roadmaps.length,
                color: "green",
              },
              {
                icon: Clock,
                label: "Total Duration",
                value: `${totalMonths} months`,
                color: "yellow",
              },
              {
                icon: Award,
                label: "Completed",
                value: roadmaps.filter((r) => r.progress === 100).length,
                color: "purple",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`text-${stat.color}-600`} size={24} />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Add Roadmap Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                className="bg-white rounded-lg shadow-sm border p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Start a New Learning Roadmap
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewRoadmapTitle("");
                      setNewRoadmapSkills("");
                      setNewRoadmapExperience("");
                      setNewRoadmapDuration("");
                      setGenerationError("");
                    }}
                    disabled={isGenerating}
                    className="text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                  >
                    <X size={20} />
                  </button>
                </div>

                {generationError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle
                      size={20}
                      className="text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-sm text-red-800">{generationError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Course/Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Full-Stack Developer"
                      value={newRoadmapTitle}
                      onChange={(e) => setNewRoadmapTitle(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Duration <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newRoadmapDuration}
                      onChange={(e) => setNewRoadmapDuration(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select duration...</option>
                      {predefinedDurations.map((duration, index) => (
                        <option key={index} value={duration}>
                          {duration}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Skills (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., JavaScript, React, Node.js"
                      value={newRoadmapSkills}
                      onChange={(e) => setNewRoadmapSkills(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Helps personalize your roadmap
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Experience Level
                    </label>
                    <select
                      value={newRoadmapExperience}
                      onChange={(e) => setNewRoadmapExperience(e.target.value)}
                      disabled={isGenerating}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select experience...</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddRoadmap}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Generating Roadmap...
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Generate Roadmap
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewRoadmapTitle("");
                      setNewRoadmapSkills("");
                      setNewRoadmapExperience("");
                      setNewRoadmapDuration("");
                      setGenerationError("");
                    }}
                    disabled={isGenerating}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roadmaps Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {roadmapsLoading && (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" size={28} />
              </div>
            )}
            <AnimatePresence>
              {roadmaps.map((roadmap, index) => (
                <motion.div
                  key={roadmap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {roadmap.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {roadmap.description}
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">
                        {animatedProgress[index]}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${roadmap.progress}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>

                    {/* Duration and Start Date */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>
                          Started:{" "}
                          {new Date(roadmap.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>Duration: {roadmap.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Target size={16} />
                        <span>
                          Status:{" "}
                          {roadmap.progress === 100
                            ? "Completed"
                            : roadmap.progress > 0
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Status */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Learning Progress</span>
                        <span
                          className={`font-medium ${
                            roadmap.progress === 100
                              ? "text-green-600"
                              : roadmap.progress > 50
                              ? "text-blue-600"
                              : roadmap.progress > 0
                              ? "text-yellow-600"
                              : "text-gray-500"
                          }`}
                        >
                          {roadmap.progress === 100
                            ? "Completed!"
                            : roadmap.progress > 50
                            ? "Making great progress"
                            : roadmap.progress > 0
                            ? "Getting started"
                            : "Ready to begin"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-3 bg-gray-50 border-t">
                    <button
                      onClick={() =>
                        router.push(`../courseroadmap?pageId=${roadmap.id}`)
                      }
                      className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {roadmaps.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Book className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No roadmaps yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start your learning journey by adding your first roadmap
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Your First Roadmap
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default RoadmapDashboard;
