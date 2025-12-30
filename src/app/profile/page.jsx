"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Settings,
  Bell,
  Shield,
  Trash2,
  Plus,
  Award,
  Target,
  TrendingUp,
  FileText,
  Download,
  Upload,
  Sparkles,
  Star,
  AlertCircle,
  CheckCircle,
  Eye,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import AuthGuard from "@/components/AuthGuard";
import {
  getUserProfile,
  updateUserProfile,
  getDashboardData,
  uploadResume as uploadResumeApi,
  compileLatex as compileLatexApi,
  enhanceResume as enhanceResumeApi,
} from "@/lib/services/profileApi";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    company: "",
    bio: "",
    education: [],
    experience: [],
    skills: [],
    social: { website: "", github: "", linkedin: "", twitter: "" },
    preferences: {
      emailNotifications: false,
      pushNotifications: false,
      weeklyReports: false,
      jobAlerts: false,
      skillRecommendations: false,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResumePreview, setShowResumePreview] = useState(false);
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [loadingCompleteness, setLoadingCompleteness] = useState(true);
  const [resumeData, setResumeData] = useState({
    score: 0,
    lastUpdated: "",
    fileName: "",
    url: "",
    publicId: "",
    suggestions: [],
    analysis: {
      strengths: [],
      weaknesses: [],
    },
  });
  const [loadingResume, setLoadingResume] = useState(true);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const viewResume = () => {
    const url = resumeData?.url || uploadedResume;
    if (!url) {
      alert("No resume URL available to view.");
      return;
    }
    window.open(url, "_blank");
  };

  const downloadResume = async () => {
    const url = resumeData?.url || uploadedResume;
    if (!url) {
      alert("No resume URL available to download.");
      return;
    }
    const filename = (resumeData.fileName || "resume.pdf").replace(/[^\w.\-]+/g, "_");
    try {
      const res = await fetch(url, { credentials: "omit" });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
        return;
      }
    } catch (e) {
    }

    try {
      if (/res\.cloudinary\.com/.test(url) && url.includes("/upload/")) {
        const dlUrl = url.replace("/upload/", `/upload/fl_attachment:${encodeURIComponent(filename)}/`);
        const a = document.createElement("a");
        a.href = dlUrl;
        a.target = "_blank";
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    } catch (e) {
    }

    window.open(url, "_blank");
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "skills", label: "Skills & Experience", icon: Target },
    { id: "preferences", label: "Preferences", icon: Settings },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
  ];

  const handleSave = async () => {
    setError("");
    const { valid, errors } = validateEditData();
    if (!valid) {
      setError(
        `Please complete required fields before saving:\n- ` +
          errors.slice(0, 8).join("\n- ") +
          (errors.length > 8 ? "\n- …" : "")
      );
      return;
    }
    try {
      const payload = { ...editData };
      if (!payload.email && typeof window !== "undefined") {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) payload.email = userEmail;
      }
      await updateUserProfile(payload);
      void fetchProfile();
      void fetchProfileCompleteness();
      setIsEditing(false);
    } catch (e) {
      setError(e.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const addSkill = () => {
    const newSkill = {
      name: "",
      level: 50,
      category: "Programming",
    };
    setEditData({
      ...editData,
      skills: [newSkill, ...editData.skills],
    });
  };

  const removeSkill = (index) => {
    const newSkills = editData.skills.filter((_, i) => i !== index);
    setEditData({
      ...editData,
      skills: newSkills,
    });
  };

  const updateSkill = (index, field, value) => {
    const newSkills = [...editData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setEditData({
      ...editData,
      skills: newSkills,
    });
  };

  const validateEditData = () => {
    const errors = [];
    const isBlank = (v) => !v || String(v).trim() === "";

    (editData.skills || []).forEach((s, i) => {
      if (isBlank(s.name)) errors.push(`Skill #${i + 1}: name is required`);
      if (isBlank(s.category)) errors.push(`Skill #${i + 1}: category is required`);
      if (s.level == null || isNaN(s.level)) errors.push(`Skill #${i + 1}: level is required`);
    });

    (editData.experience || []).forEach((e, i) => {
      if (isBlank(e.position)) errors.push(`Experience #${i + 1}: position is required`);
      if (isBlank(e.company)) errors.push(`Experience #${i + 1}: company is required`);
      if (isBlank(e.duration)) errors.push(`Experience #${i + 1}: duration is required`);
      if (isBlank(e.location)) errors.push(`Experience #${i + 1}: location is required`);
      if (isBlank(e.description)) errors.push(`Experience #${i + 1}: description is required`);
    });

    (editData.education || []).forEach((e, i) => {
      if (isBlank(e.degree)) errors.push(`Education #${i + 1}: degree is required`);
      if (isBlank(e.school)) errors.push(`Education #${i + 1}: school is required`);
      if (isBlank(e.year)) errors.push(`Education #${i + 1}: year is required`);
      if (isBlank(e.gpa)) errors.push(`Education #${i + 1}: GPA is required`);
    });

    return { valid: errors.length === 0, errors };
  };

  const addExperience = () => {
    const exp = {
      position: "",
      company: "",
      duration: "",
      location: "",
      description: "",
    };
    setEditData({ ...editData, experience: [exp, ...(editData.experience || [])] });
  };

  const updateExperience = (index, field, value) => {
    const list = [...(editData.experience || [])];
    list[index] = { ...list[index], [field]: value };
    setEditData({ ...editData, experience: list });
  };

  const removeExperience = (index) => {
    const list = (editData.experience || []).filter((_, i) => i !== index);
    setEditData({ ...editData, experience: list });
  };

  // Education helpers
  const addEducation = () => {
    const edu = { degree: "", school: "", year: "", gpa: "" };
    setEditData({ ...editData, education: [edu, ...(editData.education || [])] });
  };

  const updateEducation = (index, field, value) => {
    const list = [...(editData.education || [])];
    list[index] = { ...list[index], [field]: value };
    setEditData({ ...editData, education: list });
  };

  const removeEducation = (index) => {
    const list = (editData.education || []).filter((_, i) => i !== index);
    setEditData({ ...editData, education: list });
  };

  const handleUploadResume = async (file) => {
    try {
      if (!file) {
        const f = fileInputRef.current?.files?.[0];
        if (!f) {
          alert("Please choose a PDF file");
          return;
        }
        file = f;
      }
      setIsProcessingResume(true);
  const formData = new FormData();
  formData.append("resume", file, file.name);
            const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/resume`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: formData,
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Upload failed");
      }
      let data = null;
      try {
        data = await res.json();
      } catch {}

      const resume = data?.resume || data?.data?.resume || data || {};
      setResumeData((prev) => ({
        ...prev,
        score: resume.score ?? prev.score,
        lastUpdated: resume.lastUpdated || new Date().toISOString(),
        fileName: resume.fileName || file.name,
        url: resume.url || prev.url,
        publicId: resume.publicId || prev.publicId,
        suggestions: resume.suggestions || prev.suggestions,
        analysis: resume.analysis || prev.analysis,
      }));
      if (resume.url) setUploadedResume(resume.url);
    } catch (error) {
      console.error("Resume upload error:", error);
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleGenerateResume = async () => {
    const buildLatexFromProfile = (p) => {
      const esc = (s = "") => String(s)
        .replace(/&/g, "\\&")
        .replace(/%/g, "\\%")
        .replace(/_/g, "\\_")
        .replace(/#/g, "\\#");
      const skills = (p.skills || [])
        .map((s) => `\\textbf{${esc(s.name)}} (${s.level}\\%)`)
        .join(" \\quad ");
      const exp = (p.experience || [])
        .map(
          (e) => `\\textbf{${esc(e.position)}} — ${esc(e.company)} \\hfill ${esc(e.duration)}\\\\\n${esc(e.location)}\\\\\n\\begin{itemize}\n  \\item ${esc(e.description)}\n\\end{itemize}`
        )
        .join("\n\n");
      const edu = (p.education || [])
        .map((e) => `${esc(e.degree)} — ${esc(e.school)} (\\textit{${esc(e.year)}})\\hfill GPA: ${esc(e.gpa)}`)
        .join("\\\\\n");
      return `\\documentclass[11pt]{article}
\\usepackage[margin=0.8in]{geometry}
\\usepackage[hidelinks]{hyperref}
\\usepackage{enumitem}
\\setlist[itemize]{noitemsep, topsep=0pt}
\\begin{document}
\\begin{center}
  {\\LARGE ${esc(p.name || "")} } \\\\
  ${esc(p.title || "")} \\ \textbar{} ${esc(p.location || "")} \\ \textbar{} ${esc(p.email || "")} \\\\
  \href{${esc(p.social?.github || "")}}{GitHub} \textbar{} \href{${esc(p.social?.linkedin || "")}}{LinkedIn}
\\end{center}
\\vspace{6pt}
\\noindent ${esc(p.bio || "")} \\\\
\\section*{Skills}
${skills}
\\section*{Experience}
${exp || ""}
\\section*{Education}
${edu || ""}
\\end{document}`;
    };

    setIsProcessingResume(true);
    try {
      const latex = buildLatexFromProfile(editData);
      const compileRes = await compileLatexApi(latex);
      const pdfBlob = compileRes?.data;

      const fileName = `${(editData.name || "user").replace(/\s+/g, "_")}_Resume.pdf`;
      const form = new FormData();
      form.append("resume", new File([pdfBlob], fileName, { type: "application/pdf" }));
      form.append("latex", latex);
      const uploaded = await uploadResumeApi(form);
      const resume = uploaded?.data?.resume || uploaded?.data?.data?.resume || uploaded?.data || {};
      setResumeData((prev) => ({
        ...prev,
        score: resume.score ?? prev.score,
        lastUpdated: resume.lastUpdated || new Date().toISOString(),
        fileName: resume.fileName || fileName,
        url: resume.url || prev.url,
        publicId: resume.publicId || prev.publicId,
        suggestions: resume.suggestions || prev.suggestions,
        analysis: resume.analysis || prev.analysis,
      }));
      if (resume.url) {
        setUploadedResume(resume.url);
        setResumeFileName(resume.fileName || fileName);
      }
      console.log("Resume generated from your profile and uploaded.");
    } catch (error) {
      console.error("Resume generation error:", error);
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleEnhanceResume = async () => {
    setIsProcessingResume(true);
    try {
      const email = editData.email || (typeof window !== "undefined" ? localStorage.getItem("userEmail") : "");

      let serverResult = null;
      try {
        const res = await enhanceResumeApi({ email, profile: editData });
        serverResult = res?.data;
      } catch (_) {}

      if (serverResult?.resume) {
        const enhanced = serverResult.resume;
        await updateUserProfile({ email, resume: enhanced });
        setResumeData(enhanced);
        alert("Resume enhanced using AI.");
        return;
      }

      // Fallback heuristics
      const skillsCount = (editData.skills || []).length;
      const expCount = (editData.experience || []).length;
      const hasCerts = (editData.skills || []).some((s) => /cert/i.test(s.name));
      const socialCount = [editData?.social?.github, editData?.social?.linkedin, editData?.social?.website, editData?.social?.twitter].filter(Boolean).length;
      let score = 50;
      score += Math.min(30, skillsCount * 3);
      score += Math.min(20, expCount * 5);
      if ((editData.bio || "").length > 150) score += 5;
      if (socialCount >= 2) score += 5;
      if (hasCerts) score += 3;
      score = Math.max(0, Math.min(100, score));

      const suggestions = [];
      if (skillsCount < 8) suggestions.push({ type: "improvement", title: "Add more skills", description: "List at least 8-12 skills relevant to your target roles.", priority: "high" });
      if (expCount < 2) suggestions.push({ type: "missing", title: "Add more work experience", description: "Include internships, freelance or project experience.", priority: "high" });
      if (!editData.social?.linkedin) suggestions.push({ type: "enhancement", title: "Add LinkedIn profile", description: "Recruiters often check your LinkedIn.", priority: "medium" });
      suggestions.push({ type: "formatting", title: "Use consistent bullet points", description: "Start bullets with action verbs and quantify outcomes.", priority: "low" });

      const enhancedResumeData = {
        ...resumeData,
        score,
        lastUpdated: new Date().toISOString(),
        suggestions,
        analysis: {
          strengths: [
            ...(resumeData.analysis?.strengths || []),
            skillsCount >= 8 ? "Comprehensive skills section" : "Clear, concise layout",
          ],
          weaknesses: [
            ...(resumeData.analysis?.weaknesses || []),
            expCount < 2 ? "Limited professional experience listed" : "",
          ].filter(Boolean),
        },
      };

      await updateUserProfile({ email, resume: enhancedResumeData });
      setResumeData(enhancedResumeData);
    } catch (error) {
      console.error("Resume enhancement error:", error);
      alert("Failed to enhance resume. Please try again.");
    } finally {
      setIsProcessingResume(false);
    }
  };

  async function fetchProfile() {
    try {
      setLoading(true);
      setError("");
      const res = await getUserProfile();
      const data = res?.data?.data || {};
      const normalized = {
        name: data.name || "",
        email:
          data.email ||
          (typeof window !== "undefined"
            ? localStorage.getItem("userEmail") || ""
            : ""),
        phone: data.phone || "",
        location: data.location || "",
        title: data.title || "",
        company: data.company || "",
        bio: data.bio || "",
        education: Array.isArray(data.education) ? data.education : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        social: {
          website: data?.social?.website || "",
          github: data?.social?.github || "",
          linkedin: data?.social?.linkedin || "",
          twitter: data?.social?.twitter || "",
        },
        preferences: {
          emailNotifications: !!data?.preferences?.emailNotifications,
          pushNotifications: !!data?.preferences?.pushNotifications,
          weeklyReports: !!data?.preferences?.weeklyReports,
          jobAlerts: !!data?.preferences?.jobAlerts,
          skillRecommendations: !!data?.preferences?.skillRecommendations,
        },
      };
      setEditData(normalized);

      // Set resume data from backend
      if (data.resume) {
        setResumeData({
          score: data.resume.score || 0,
          lastUpdated: data.resume.lastUpdated || "",
          fileName: data.resume.fileName || "",
          url: data.resume.url || "",
          publicId: data.resume.publicId || "",
          suggestions: data.resume.suggestions || [],
          analysis: {
            strengths: data.resume.analysis?.strengths || [],
            weaknesses: data.resume.analysis?.weaknesses || [],
          },
        });
        setResumeFileName(data.resume.fileName || "");
      }
      setLoadingResume(false);
    } catch (e) {
      setError(e.message || "Failed to load profile");
      setLoadingResume(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfileCompleteness() {
    try {
      setLoadingCompleteness(true);
      const response = await getDashboardData();
      if (response?.data?.success) {
        setProfileCompleteness(response.data.data.profileCompleteness || 0);
      }
    } catch (e) {
      console.error("Failed to fetch profile completeness:", e);
    } finally {
      setLoadingCompleteness(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchProfileCompleteness();
  }, []);

  const ScoreCircle = ({ score }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className={`${
              score >= 80
                ? "text-green-500"
                : score >= 60
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-700">{score}</span>
        </div>
      </div>
    );
  };

  const SuggestionCard = ({ suggestion }) => {
    const getIcon = (type) => {
      switch (type) {
        case "improvement":
          return <TrendingUp className="h-4 w-4" />;
        case "missing":
          return <AlertCircle className="h-4 w-4" />;
        case "enhancement":
          return <Sparkles className="h-4 w-4" />;
        case "formatting":
          return <Eye className="h-4 w-4" />;
        default:
          return <CheckCircle className="h-4 w-4" />;
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case "high":
          return "text-red-600 bg-red-100";
        case "medium":
          return "text-yellow-600 bg-yellow-100";
        case "low":
          return "text-green-600 bg-green-100";
        default:
          return "text-gray-600 bg-gray-100";
      }
    };

    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${getPriorityColor(
              suggestion.priority
            )}`}
          >
            {getIcon(suggestion.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                  suggestion.priority
                )}`}
              >
                {suggestion.priority}
              </span>
            </div>
            <p className="text-sm text-gray-600">{suggestion.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Profile
                </h1>
                <p className="text-gray-600">
                  Manage your personal information and preferences
                </p>
              </div>
              <div className="flex items-center gap-2">
                {loading && (
                  <span className="text-sm text-gray-500">Loading…</span>
                )}
                {isEditing ? (
                  <>
                    <Button
                      className="cursor-pointer"
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button className="cursor-pointer" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button
                    className="cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-4">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                          activeTab === tab.id
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <tab.icon className="h-4 w-4 mr-3" />
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              {profileCompleteness !== 100 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Profile Strength</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completeness</span>
                          <span>
                            {loadingCompleteness
                              ? "..."
                              : `${profileCompleteness}%`}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${profileCompleteness}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {profileCompleteness < 50
                          ? "Complete your basic information to improve visibility."
                          : profileCompleteness < 75
                          ? "Add more skills and experience to boost your profile."
                          : profileCompleteness < 90
                          ? "You're almost there! Add social links and certifications."
                          : "Excellent! Your profile is comprehensive and stands out."}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Profile Picture & Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        Your personal details and contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                              {editData.name
                                ? editData.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "?"}
                            </div>
                            {isEditing && (
                              <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                <Camera className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-2 text-center">
                            Profile Photo
                          </p>
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <Input
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <Input
                              value={editData.email}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  email: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phone
                            </label>
                            <Input
                              value={editData.phone}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  phone: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Location
                            </label>
                            <Input
                              value={editData.location}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  location: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Job Title
                            </label>
                            <Input
                              value={editData.title}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  title: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Company
                            </label>
                            <Input
                              value={editData.company}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  company: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          value={editData.bio}
                          onChange={(e) =>
                            setEditData({ ...editData, bio: e.target.value })
                          }
                          disabled={!isEditing}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Links</CardTitle>
                      <CardDescription>
                        Connect your social profiles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Globe className="h-4 w-4 inline mr-1" />
                            Website
                          </label>
                          <Input
                            value={editData.social.website || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                social: {
                                  ...editData.social,
                                  website: e.target.value,
                                },
                              })
                            }
                            disabled={!isEditing}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Github className="h-4 w-4 inline mr-1" />
                            GitHub
                          </label>
                          <Input
                            value={editData.social.github || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                social: {
                                  ...editData.social,
                                  github: e.target.value,
                                },
                              })
                            }
                            disabled={!isEditing}
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Linkedin className="h-4 w-4 inline mr-1" />
                            LinkedIn
                          </label>
                          <Input
                            value={editData.social.linkedin || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                social: {
                                  ...editData.social,
                                  linkedin: e.target.value,
                                },
                              })
                            }
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/username"
                          />
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Twitter className="h-4 w-4 inline mr-1" />
                            Twitter
                          </label>
                          <Input
                            value={editData.social.twitter || ""}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                social: {
                                  ...editData.social,
                                  twitter: e.target.value,
                                },
                              })
                            }
                            disabled={!isEditing}
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Resume Tab */}
              {activeTab === "resume" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUploadedResume(URL.createObjectURL(file));
                        setResumeFileName(file.name);
                        void handleUploadResume(file);
                      }
                    }}
                  />

                  {/* Resume Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Overview</CardTitle>
                      <CardDescription>
                        Manage and optimize your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Current Resume Info */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-blue-600" />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {loadingResume
                                  ? "Loading..."
                                  : uploadedResume
                                  ? resumeFileName || "Uploaded Resume"
                                  : resumeData.fileName || "No resume uploaded"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Last updated:{" "}
                                {loadingResume
                                  ? "..."
                                  : uploadedResume
                                  ? "Just now"
                                  : resumeData.lastUpdated
                                  ? new Date(
                                      resumeData.lastUpdated
                                    ).toLocaleDateString()
                                  : "Never"}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {(uploadedResume ||
                              resumeData.fileName ||
                              resumeData.url) && (
                              <>
                                <Button
                                  variant="outlined"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    viewResume();
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Resume
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    downloadResume();
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download PDF
                                </Button>
                              </>
                            )}
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={() => router.push("/profile/resume")}
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              LaTeX Editor
                            </Button>
                          </div>
                        </div>

                        {/* Resume Score */}
                        <div className="flex flex-col items-center text-center">
                          {(() => {
                            const stableScore = loadingResume
                              ? 0
                              : resumeData.score || 0;
                            return (
                              <>
                                <ScoreCircle score={stableScore} />
                                <h3 className="font-medium text-gray-900 mt-2">
                                  Resume Score
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {loadingResume
                                    ? "Loading..."
                                    : stableScore === 0
                                    ? "No score yet"
                                    : stableScore >= 80
                                    ? "Excellent"
                                    : stableScore >= 60
                                    ? "Good"
                                    : "Needs Improvement"}
                                </p>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Resume Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Actions</CardTitle>
                      <CardDescription>
                        Upload, generate, or enhance your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                          className="h-auto p-4 flex flex-col items-center gap-2"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isProcessingResume}
                        >
                          <Upload className="h-6 w-6" />
                          <span className="text-sm">Upload Resume</span>
                        </Button>
                        <Button
                          variant="outlined"
                          className="h-auto p-4 flex flex-col items-center gap-2"
                          onClick={handleGenerateResume}
                          disabled={isProcessingResume}
                        >
                          <Wand2 className="h-6 w-6" />
                          <span className="text-sm">Generate Resume</span>
                        </Button>
                        <Button
                          variant="outlined"
                          className="h-auto p-4 flex flex-col items-center gap-2"
                          onClick={handleEnhanceResume}
                          disabled={isProcessingResume}
                        >
                          <Sparkles className="h-6 w-6" />
                          <span className="text-sm">AI Enhance</span>
                        </Button>
                      </div>

                      {isProcessingResume && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          <span className="text-sm text-blue-700">
                            Processing your resume...
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Resume Preview Popup */}
                  {showResumePreview && uploadedResume && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2"
                      onClick={(e) => {
                        if (e.target === e.currentTarget)
                          setShowResumePreview(false);
                      }}
                    >
                      <div className="bg-white w-full max-w-7xl h-full max-h-[95vh] p-4 rounded-lg relative shadow-2xl">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowResumePreview(false);
                          }}
                          className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <div className="w-full h-full pt-12">
                          <iframe
                            src={uploadedResume}
                            className="w-full h-full rounded border"
                            frameBorder="0"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resume Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Resume Analysis</CardTitle>
                      <CardDescription>
                        AI-powered insights to improve your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingResume ? (
                        <div className="text-center py-8 text-gray-500">
                          Loading analysis...
                        </div>
                      ) : resumeData.analysis &&
                        (resumeData.analysis.strengths?.length > 0 ||
                          resumeData.analysis.weaknesses?.length > 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Strengths */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Strengths
                            </h4>
                            {resumeData.analysis.strengths?.length > 0 ? (
                              <ul className="space-y-2">
                                {resumeData.analysis.strengths.map(
                                  (strength, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2 text-sm text-gray-600"
                                    >
                                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                                      {strength}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No strengths identified yet
                              </p>
                            )}
                          </div>

                          {/* Areas for Improvement */}
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                              Areas for Improvement
                            </h4>
                            {resumeData.analysis.weaknesses?.length > 0 ? (
                              <ul className="space-y-2">
                                {resumeData.analysis.weaknesses.map(
                                  (weakness, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2 text-sm text-gray-600"
                                    >
                                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                                      {weakness}
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No improvement areas identified
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Upload or generate a resume to see AI analysis
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Suggestions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Suggestions</CardTitle>
                      <CardDescription>
                        Personalized recommendations to improve your resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {loadingResume ? (
                        <div className="text-center py-8 text-gray-500">
                          Loading suggestions...
                        </div>
                      ) : resumeData.suggestions?.length > 0 ? (
                        <div className="space-y-4">
                          {resumeData.suggestions.map((suggestion, index) => (
                            <SuggestionCard
                              key={index}
                              suggestion={suggestion}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No suggestions available. Upload or generate a resume
                          to get AI recommendations.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Skills & Experience Tab */}
              {activeTab === "skills" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Skills */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Skills</CardTitle>
                          <CardDescription>
                            Manage your technical and soft skills
                          </CardDescription>
                        </div>
                        {isEditing && (
                          <Button variant="outlined" onClick={addSkill}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Skill
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {editData.skills.map((skill, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Skill
                                </label>
                                <Input
                                  value={skill.name}
                                  onChange={(e) =>
                                    updateSkill(index, "name", e.target.value)
                                  }
                                  disabled={!isEditing}
                                  placeholder="e.g., JavaScript"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category
                                </label>
                                <select
                                  value={skill.category}
                                  onChange={(e) =>
                                    updateSkill(
                                      index,
                                      "category",
                                      e.target.value
                                    )
                                  }
                                  disabled={!isEditing}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                >
                                  <option value="Programming">
                                    Programming
                                  </option>
                                  <option value="Framework">Framework</option>
                                  <option value="Styling">Styling</option>
                                  <option value="Backend">Backend</option>
                                  <option value="Tools">Tools</option>
                                  <option value="Soft Skills">
                                    Soft Skills
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-grey-700 mb-1">
                                  Level ({skill.level}%)
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={skill.level}
                                  onChange={(e) =>
                                    updateSkill(
                                      index,
                                      "level",
                                      parseInt(e.target.value)
                                    )
                                  }
                                  disabled={!isEditing}
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, #2563eb ${skill.level}%, #e5e7eb ${skill.level}%)`,
                                  }}
                                />
                              </div>
                              <div className="flex justify-end">
                                {isEditing && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSkill(index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Experience */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Work Experience</CardTitle>
                          <CardDescription>
                            Your professional background
                          </CardDescription>
                        </div>
                        {isEditing && (
                          <Button variant="outlined" onClick={addExperience}>
                            <Plus className="h-4 w-4 mr-2" /> Add Experience
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {editData.experience.map((exp, index) => (
                          <div key={index} className="border border-grey-200 rounded-lg p-4">
                            {isEditing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                  <Input
                                    value={exp.position || ""}
                                    onChange={(e) => updateExperience(index, "position", e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                  <Input
                                    value={exp.company || ""}
                                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                  <Input
                                    value={exp.duration || ""}
                                    onChange={(e) => updateExperience(index, "duration", e.target.value)}
                                    placeholder="Jan 2023 - Present"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                  <Input
                                    value={exp.location || ""}
                                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                                    required
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                  <textarea
                                    value={exp.description || ""}
                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Describe your responsibilities and achievements"
                                    required
                                  />
                                </div>
                                <div className="flex justify-end md:col-span-2">
                                  <Button variant="ghost" className="text-red-600" onClick={() => removeExperience(index)}>
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-grey-900">{exp.position}</h4>
                                  <p className="text-blue-600">{exp.company}</p>
                                  <p className="text-sm text-grey-600">{exp.duration} • {exp.location}</p>
                                  <p className="text-sm text-grey-700 mt-2">{exp.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Briefcase className="h-5 w-5 text-grey-400" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Education</CardTitle>
                          <CardDescription>Your educational background</CardDescription>
                        </div>
                        {isEditing && (
                          <Button variant="outlined" onClick={addEducation}>
                            <Plus className="h-4 w-4 mr-2" /> Add Education
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {editData.education.map((edu, index) => (
                          <div key={index} className="border border-grey-200 rounded-lg p-4">
                            {isEditing ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                                  <Input value={edu.degree || ""} onChange={(e) => updateEducation(index, "degree", e.target.value)} required/>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                                  <Input value={edu.school || ""} onChange={(e) => updateEducation(index, "school", e.target.value)} required/>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                  <Input value={edu.year || ""} onChange={(e) => updateEducation(index, "year", e.target.value)} placeholder="2024" required/>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                                  <Input value={edu.gpa || ""} onChange={(e) => updateEducation(index, "gpa", e.target.value)} placeholder="e.g., 3.8/4.0" required/>
                                </div>
                                <div className="flex justify-end md:col-span-2">
                                  <Button variant="ghost" className="text-red-600" onClick={() => removeEducation(index)}>
                                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-grey-900">{edu.degree}</h4>
                                  <p className="text-blue-600">{edu.school}</p>
                                  <p className="text-sm text-grey-600">{edu.year} • GPA: {edu.gpa}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-5 w-5 text-grey-400" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Choose how you want to be notified about updates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(editData.preferences).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between py-2"
                            >
                              <div>
                                <h4 className="font-medium text-grey-900 capitalize">
                                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                </h4>
                                <p className="text-sm text-grey-600">
                                  {key === "emailNotifications" &&
                                    "Receive updates via email"}
                                  {key === "pushNotifications" &&
                                    "Get push notifications in your browser"}
                                  {key === "weeklyReports" &&
                                    "Weekly progress and insights report"}
                                  {key === "jobAlerts" &&
                                    "Notifications about relevant job opportunities"}
                                  {key === "skillRecommendations" &&
                                    "AI-powered skill development suggestions"}
                                </p>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={value}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      preferences: {
                                        ...editData.preferences,
                                        [key]: e.target.checked,
                                      },
                                    })
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-grey-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Career Preferences</CardTitle>
                      <CardDescription>
                        Help us personalize your experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-grey-700 mb-2">
                            Career Goals
                          </label>
                          <select className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Advance to Senior Developer</option>
                            <option>Transition to Management</option>
                            <option>Become a Tech Lead</option>
                            <option>Start Own Company</option>
                            <option>Switch Industries</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700 mb-2">
                            Preferred Work Environment
                          </label>
                          <select className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Remote</option>
                            <option>Hybrid</option>
                            <option>On-site</option>
                            <option>No preference</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-grey-700 mb-2">
                            Company Size Preference
                          </label>
                          <select className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option>Startup (1-50)</option>
                            <option>Small (51-200)</option>
                            <option>Medium (201-1000)</option>
                            <option>Large (1000+)</option>
                            <option>No preference</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Privacy & Security Tab */}
              {activeTab === "privacy" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>
                        Control who can see your information
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <h4 className="font-medium text-grey-900">
                              Public Profile
                            </h4>
                            <p className="text-sm text-grey-600">
                              Make your profile visible to other users
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-grey-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <h4 className="font-medium text-grey-900">
                              Show Contact Info
                            </h4>
                            <p className="text-sm text-grey-600">
                              Allow others to see your email and phone
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-grey-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div>
                            <h4 className="font-medium text-grey-900">
                              Analytics Tracking
                            </h4>
                            <p className="text-sm text-grey-600">
                              Help improve our service with usage analytics
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-grey-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>
                        Manage your account security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Two-Factor Authentication
                        </Button>
                        <Button
                          variant="outlined"
                          className="w-full justify-start"
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Login History
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-700">
                        Danger Zone
                      </CardTitle>
                      <CardDescription>
                        Irreversible and destructive actions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button
                          variant="outlined"
                          className="w-full justify-start text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                        <p className="text-sm text-grey-600">
                          Once you delete your account, there is no going back.
                          Please be certain.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
