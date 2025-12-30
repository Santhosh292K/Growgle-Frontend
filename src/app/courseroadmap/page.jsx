"use client";

import React, { useEffect, useMemo, useState, Suspense } from "react";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Circle,
  Clock,
  Star,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useSearchParams, useRouter } from "next/navigation";
import { getRoadmapById } from "@/lib/services/roadmapApi";

const certifications = [
  {
    name: "AWS Cloud Practitioner",
    provider: "Amazon Web Services",
    difficulty: "Beginner",
    duration: "3-4 weeks",
    value: "High",
    priority: "Recommended",
  },
  {
    name: "Google Cloud Associate",
    provider: "Google Cloud",
    difficulty: "Intermediate",
    duration: "6-8 weeks",
    value: "High",
    priority: "Optional",
  },
  {
    name: "React Developer Certification",
    provider: "Meta",
    difficulty: "Intermediate",
    duration: "4-6 weeks",
    value: "Medium",
    priority: "Recommended",
  },
];

function RoadmapContent() {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const roadmapId = searchParams.get("pageId");

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!roadmapId) {
        setError("Missing roadmap id.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const { data } = await getRoadmapById(roadmapId);
        const item = data?.data ?? data;
        if (!item) {
          setError("Roadmap not found.");
        } else {
          setRoadmap(item);
        }
      } catch (e) {
        setError("Failed to load roadmap. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [roadmapId]);

  const completion = useMemo(() => {
    if (!roadmap) return 0;
    const val =
      typeof roadmap.progress === "number"
        ? roadmap.progress
        : roadmap.completionRate;
    const num = Number(val);
    return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0;
  }, [roadmap]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-grey-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-grey-100 text-grey-600";
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-grey-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="py-16 text-center text-grey-600">
              Loading roadmap...
            </div>
          )}
          {!loading && error && (
            <div className="py-6 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4">
              {error}
              <div className="mt-3">
                <Button variant="outlined" onClick={() => router.back()}>
                  Go Back
                </Button>
              </div>
            </div>
          )}
          {!loading && !error && !roadmap && (
            <div className="py-16 text-center text-grey-600">
              No roadmap to display.
            </div>
          )}
          {!loading && !error && roadmap && (
            <>
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-grey-900 mb-2">
                      Your Career Roadmap
                    </h1>
                    <p className="text-grey-600">
                      Personalized path to become a {roadmap?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {completion}%
                    </div>
                    <div className="text-sm text-grey-600">Complete</div>
                  </div>
                </div>
              </motion.div>

              {/* Progress Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-grey-900">
                        Overall Progress
                      </h3>
                      <span className="text-sm text-grey-600">
                        Est. completion: {roadmap?.totalDuration}
                      </span>
                    </div>
                    <div className="w-full bg-grey-200 rounded-full h-3 mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-green-600 h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${completion}%` }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {(roadmap?.phases ?? []).map((phase, index) => (
                        <div key={phase.id} className="text-center">
                          <div
                            className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                              phase.status === "completed"
                                ? "bg-green-600"
                                : phase.status === "in-progress"
                                ? "bg-blue-600"
                                : "bg-grey-300"
                            }`}
                          />
                          <div className="text-xs font-medium text-grey-900">
                            {phase.title}
                          </div>
                          <div className="text-xs text-grey-600">
                            {phase.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Roadmap */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {(roadmap?.phases ?? []).map((phase, phaseIndex) => (
                      <Card key={phase.id} className="overflow-hidden">
                        <CardHeader
                          className={`cursor-pointer ${
                            phase.status === "completed"
                              ? "bg-green-50"
                              : phase.status === "in-progress"
                              ? "bg-blue-50"
                              : "bg-grey-50"
                          }`}
                          onClick={() =>
                            setSelectedPhase(
                              selectedPhase === phase.id ? null : phase.id
                            )
                          }
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(phase.status)}
                              <div>
                                <CardTitle className="text-lg">
                                  {phase.title}
                                </CardTitle>
                                <CardDescription>
                                  {phase.duration}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  phase.status
                                )}`}
                              >
                                {phase.status.replace("-", " ")}
                              </div>
                              <div className="text-sm text-grey-600 mt-1">
                                {phase.progress}% complete
                              </div>
                            </div>
                          </div>
                          {phase.progress > 0 && (
                            <div className="w-full bg-grey-200 rounded-full h-2 mt-3">
                              <motion.div
                                className={`h-2 rounded-full ${
                                  phase.status === "completed"
                                    ? "bg-green-600"
                                    : phase.status === "in-progress"
                                    ? "bg-blue-600"
                                    : "bg-grey-400"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${phase.progress}%` }}
                                transition={{
                                  duration: 1,
                                  delay: phaseIndex * 0.1,
                                }}
                              />
                            </div>
                          )}
                        </CardHeader>

                        {selectedPhase === phase.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-3">
                                {(phase.milestones ?? []).map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    className="flex items-center justify-between p-3 border border-grey-200 rounded-lg"
                                  >
                                    <div className="flex items-center space-x-3">
                                      {getStatusIcon(milestone.status)}
                                      <div>
                                        <h4 className="font-medium text-grey-900">
                                          {milestone.title}
                                        </h4>
                                        <div className="flex items-center space-x-2 text-sm text-grey-600">
                                          <span>{milestone.provider}</span>
                                          <span>•</span>
                                          <span>{milestone.duration}</span>
                                          <span>•</span>
                                          <span className="capitalize">
                                            {milestone.type}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button variant="outlined" size="sm">
                                      {milestone.status === "completed"
                                        ? "Review"
                                        : milestone.status === "in-progress"
                                        ? "Continue"
                                        : "Start"}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </Card>
                    ))}
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Next Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Next Actions</CardTitle>
                        <CardDescription>
                          Your immediate focus areas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-1">
                              Complete Redux Course
                            </h4>
                            <p className="text-sm text-blue-700">
                              2 hours remaining • Due in 3 days
                            </p>
                          </div>
                          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h4 className="font-medium text-yellow-900 mb-1">
                              Start E-commerce Project
                            </h4>
                            <p className="text-sm text-yellow-700">
                              Apply React skills • 3 weeks duration
                            </p>
                          </div>
                        </div>
                        <Button className="w-full mt-4">
                          Continue Learning
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recommended Certifications */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Recommended Certifications</CardTitle>
                        <CardDescription>
                          Boost your credibility
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {certifications.map((cert, index) => (
                            <div
                              key={index}
                              className="border border-grey-200 rounded-lg p-3"
                            >
                              <h4 className="font-medium text-grey-900 mb-1">
                                {cert.name}
                              </h4>
                              <p className="text-sm text-grey-600 mb-2">
                                {cert.provider}
                              </p>
                              <div className="flex justify-between items-center text-xs">
                                <span className="text-grey-500">
                                  {cert.duration}
                                </span>
                                <span
                                  className={`px-2 py-1 rounded-full ${
                                    cert.priority === "Recommended"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-grey-100 text-grey-700"
                                  }`}
                                >
                                  {cert.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Study Time */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Study Schedule</CardTitle>
                        <CardDescription>
                          Optimize your learning time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-grey-600">
                              Daily Goal
                            </span>
                            <span className="font-medium">2 hours</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-grey-600">
                              This Week
                            </span>
                            <span className="font-medium text-green-600">
                              12/14 hours
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-grey-600">
                              Streak
                            </span>
                            <span className="font-medium text-blue-600">
                              7 days
                            </span>
                          </div>
                        </div>
                        <Button variant="outlined" className="w-full mt-4">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Study Time
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-grey-50 py-8"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-grey-600">Loading...</div></div>}>
      <RoadmapContent />
    </Suspense>
  );
}
