"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Users,
  Calendar,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { useSession, signIn, signOut } from "next-auth/react";
import { CalendarView } from "@/components/CalendarView";
import AuthGuard from "@/components/AuthGuard";
import { verifyToken, refreshToken } from "@/lib/services/authApi";
import { getDashboardData } from "@/lib/services/profileApi";

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const { data: session, status } = useSession();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    skillsMastered: 0,
    careerScore: 0,
    coursesCompleted: 0,
    certifications: 0,
    profileCompleteness: 0,
    recentActivities: [],
    upcomingMilestones: [],
    recommendations: [],
    skillProgress: [],
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const isAuthed = status === "authenticated";

  useEffect(() => {
    let cancelled = false;
    if (typeof window !== "undefined") {
      const n = localStorage.getItem("userName") || "";
      if (!cancelled && n) setDisplayName(n);
    }
    async function resolveName() {
      if (displayName) return;
      try {
        const res = await verifyToken({});
        const data = res?.data?.data;
        if (!cancelled && data?.name) {
          setDisplayName(data.name);
          if (typeof window !== "undefined") {
            localStorage.setItem("userName", data.name);
            if (data.email) localStorage.setItem("userEmail", data.email);
          }
          return;
        }
      } catch (_) {
        try {
          const r = await refreshToken();
          const newToken = r?.data?.token;
          if (newToken && typeof window !== "undefined") {
            localStorage.setItem("accessToken", newToken);
            const res2 = await verifyToken({});
            const data2 = res2?.data?.data;
            if (!cancelled && data2?.name) {
              setDisplayName(data2.name);
              localStorage.setItem("userName", data2.name);
              if (data2.email) localStorage.setItem("userEmail", data2.email);
            }
          }
        } catch (_) {}
      }
    }
    resolveName();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadDashboardData() {
      try {
        setLoadingDashboard(true);
        const response = await getDashboardData();
        if (!cancelled && response?.data?.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        if (!cancelled) setLoadingDashboard(false);
      }
    }
    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;
    async function loadData() {
      try {
        setLoadingGoogle(true);
        const [evRes, taskRes] = await Promise.all([
          fetch("/api/google/events"),
          fetch("/api/google/tasks"),
        ]);
        if (!cancelled) {
          if (evRes.ok) {
            const evJson = await evRes.json();
            setCalendarEvents(evJson.events || []);
          }
          if (taskRes.ok) {
            const tJson = await taskRes.json();
            setTasks(tJson.tasks || []);
          }
        }
      } catch (e) {
        console.error("Google data load error", e);
      } finally {
        if (!cancelled) setLoadingGoogle(false);
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-grey-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-grey-900 mb-2">
              {`Welcome back${displayName ? ", " + displayName : ""}!`}
            </h1>
            <p className="text-grey-600">
              Here's your career progress overview
            </p>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                icon: Target,
                label: "Skills Mastered",
                value: loadingDashboard
                  ? "..."
                  : dashboardData.skillsMastered?.toString() || "0",
                change: "+2 this month",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: TrendingUp,
                label: "Career Score",
                value: loadingDashboard
                  ? "..."
                  : `${dashboardData.careerScore || 0}%`,
                change: "+5% this week",
                color: "text-green-600 bg-green-50",
              },
              {
                icon: BookOpen,
                label: "Courses Completed",
                value: loadingDashboard
                  ? "..."
                  : dashboardData.coursesCompleted?.toString() || "0",
                change: "+1 this week",
                color: "text-yellow-600 bg-yellow-50",
              },
              {
                icon: Award,
                label: "Certifications",
                value: loadingDashboard
                  ? "..."
                  : dashboardData.certifications?.toString() || "0",
                change: "+1 this month",
                color: "text-red-600 bg-red-50",
              },
            ].map((metric, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-grey-600 mb-1">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-grey-900">
                        {metric.value}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {metric.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.color}`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Skill Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Progress</CardTitle>
                    <CardDescription>
                      Track your skill development over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingDashboard ? (
                      <div className="text-center py-8 text-grey-500">
                        Loading skills...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.skillProgress &&
                        dashboardData.skillProgress.length > 0 ? (
                          dashboardData.skillProgress.map((skill, index) => (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-grey-900">
                                  {skill.name}
                                </span>
                                <span className="text-grey-600">
                                  {skill.level}%
                                </span>
                              </div>
                              <div className="w-full bg-grey-200 rounded-full h-2">
                                <motion.div
                                  className="bg-blue-600 h-2 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{
                                    duration: 1,
                                    delay: index * 0.1,
                                  }}
                                />
                              </div>
                              <div className="text-xs text-grey-500 mt-1">
                                Target: {skill.target}%
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-grey-500">
                            No skills added yet. Visit your profile to add
                            skills.
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Upcoming Milestones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Upcoming Milestones</CardTitle>
                        <CardDescription>
                          Your career roadmap progress
                        </CardDescription>
                      </div>
                      {/* <Button variant="outlined" size="sm">
                        View All
                      </Button> */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingDashboard ? (
                      <div className="text-center py-8 text-grey-500">
                        Loading milestones...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.upcomingMilestones &&
                        dashboardData.upcomingMilestones.length > 0 ? (
                          dashboardData.upcomingMilestones.map(
                            (milestone, index) => (
                              <div
                                key={index}
                                className="border border-grey-200 rounded-lg p-4"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium text-grey-900">
                                    {milestone.title}
                                  </h4>
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      milestone.priority === "high"
                                        ? "bg-red-100 text-red-700"
                                        : milestone.priority === "medium"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {milestone.priority}
                                  </span>
                                </div>
                                <div className="flex items-center text-sm text-grey-600 mb-3">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Due in {milestone.deadline}
                                </div>
                                <div className="w-full bg-grey-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${milestone.progress}%` }}
                                  />
                                </div>
                                <div className="text-xs text-grey-500 mt-1">
                                  {milestone.progress}% complete
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="text-center py-4 text-grey-500">
                            No milestones set yet. We'll generate personalized
                            milestones based on your profile.
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingDashboard ? (
                      <div className="text-center py-8 text-grey-500">
                        Loading activities...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.recentActivities &&
                        dashboardData.recentActivities.length > 0 ? (
                          dashboardData.recentActivities.map(
                            (activity, index) => (
                              <div
                                key={index}
                                className="flex items-start space-x-3"
                              >
                                <div
                                  className={`p-2 rounded-full ${
                                    activity.type === "course"
                                      ? "bg-blue-100"
                                      : activity.type === "roadmap"
                                      ? "bg-green-100"
                                      : activity.type === "skill"
                                      ? "bg-purple-100"
                                      : "bg-yellow-100"
                                  }`}
                                >
                                  {activity.type === "course" && (
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                  )}
                                  {activity.type === "roadmap" && (
                                    <Target className="h-4 w-4 text-green-600" />
                                  )}
                                  {activity.type === "skill" && (
                                    <Target className="h-4 w-4 text-purple-600" />
                                  )}
                                  {activity.type === "achievement" && (
                                    <Award className="h-4 w-4 text-yellow-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-grey-900">
                                    {activity.action} {activity.item}
                                  </p>
                                  <p className="text-xs text-grey-500">
                                    {activity.time}
                                  </p>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="text-center py-4 text-grey-500">
                            No recent activities. Start learning to see your
                            progress here!
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Google Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Google Calendar</CardTitle>
                        <CardDescription>Your upcoming events</CardDescription>
                      </div>
                      {!isAuthed && (
                        <Button onClick={() => signIn("google")} size="sm">
                          Sign In
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {!isAuthed ? (
                      <div className="p-4 text-center text-grey-500">
                        Sign in with Google to view your calendar events
                      </div>
                    ) : (
                      <>
                        {loadingGoogle ? (
                          <div className="p-4 text-center text-grey-500">
                            Loading events...
                          </div>
                        ) : (
                          <CalendarView events={calendarEvents} />
                        )}
                      </>
                    )}
                    <div className="mt-3 flex justify-between items-center">
                      <div>
                        {isAuthed && (
                          <Button
                            onClick={async () => {
                              setLoadingGoogle(true);
                              try {
                                const res = await fetch("/api/google/events");
                                if (res.ok) {
                                  const data = await res.json();
                                  setCalendarEvents(data.events || []);
                                }
                              } catch (e) {
                                console.error("Refresh error:", e);
                              } finally {
                                setLoadingGoogle(false);
                              }
                            }}
                            variant="outlined"
                            size="sm"
                            disabled={loadingGoogle}
                          >
                            Refresh
                          </Button>
                        )}
                      </div>
                      <a
                        href="https://calendar.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Open Calendar
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Google Tasks */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Google Tasks</CardTitle>
                    <CardDescription>Quick view of tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isAuthed ? (
                      <div className="p-4 text-center text-grey-500">
                        Sign in with Google to view your tasks
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-grey-200">
                        {loadingGoogle ? (
                          <div className="p-4 text-center text-grey-500">
                            Loading tasks...
                          </div>
                        ) : (
                          <>
                            {tasks.length === 0 ? (
                              <div className="p-4 text-center text-grey-500">
                                No tasks found.
                              </div>
                            ) : (
                              <ul className="divide-y divide-grey-200">
                                {tasks.slice(0, 5).map((task) => (
                                  <li
                                    key={task.id}
                                    className="flex items-center justify-between p-3"
                                  >
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-grey-900">
                                        {task.title}
                                      </p>
                                      <p className="text-xs text-grey-500">
                                        {task.due ? (
                                          <>
                                            Due{" "}
                                            {new Date(
                                              task.due
                                            ).toLocaleDateString("en-US", {
                                              weekday: "short",
                                              year: "numeric",
                                              month: "short",
                                              day: "numeric",
                                            })}
                                          </>
                                        ) : (
                                          <span className="italic text-grey-400">
                                            No due date
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    <a
                                      href={`https://tasks.google.com/embed/?pli=1#task/${task.id}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:underline"
                                    >
                                      View
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        )}
                      </div>
                    )}
                    <div className="mt-3 text-right">
                      <a
                        href="https://tasks.google.com/embed/list/~default"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Open Tasks
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended for You</CardTitle>
                    <CardDescription>AI-curated opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingDashboard ? (
                      <div className="text-center py-8 text-grey-500">
                        Loading recommendations...
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dashboardData.recommendations &&
                        dashboardData.recommendations.length > 0 ? (
                          dashboardData.recommendations.map((rec, index) => (
                            <div
                              key={index}
                              className="border border-grey-200 rounded-lg p-3"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-grey-900 text-sm">
                                  {rec.title}
                                </h4>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {rec.relevance}% match
                                </span>
                              </div>
                              <p className="text-xs text-grey-600 mb-2">
                                {rec.provider}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center text-xs text-grey-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {rec.duration}
                                </div>
                                <div className="flex items-center text-xs text-grey-500">
                                  <Star className="h-3 w-3 mr-1 fill-current text-yellow-500" />
                                  {rec.rating}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-grey-500">
                            No recommendations yet. Complete your profile to get
                            personalized suggestions!
                          </div>
                        )}
                      </div>
                    )}
                    {/* <Button variant="outlined" className="w-full mt-4">
                      View All Recommendations
                    </Button> */}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
