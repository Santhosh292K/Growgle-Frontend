"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  TrendingUp,
  BookOpen,
  DollarSign,
  Heart,
  ExternalLink,
  Search,
  Filter,
  X,
  Target,
  Users,
  Zap,
  MessageSquare,
  Award,
  BarChart3,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import AuthGuard from "@/components/AuthGuard";

// const jobListings = [
//   {
//     id: 1,
//     title: "Software Engineer – Engineering Systems",
//     company_name: "Google India",
//     location: "Bangalore, Karnataka",
//     employment_type: "Full-time",
//     description:
//       "Build and maintain large-scale distributed systems that power Google's infrastructure. Work with cutting-edge technologies and solve complex engineering challenges.",
//     applylink: "https://careers.google.com/jobs/123",
//     fitScore: 92,
//     whyThisJob:
//       "Strong match for your React, Node.js, and cloud computing skills. Team culture aligns with your collaborative preferences.",
//     salary: "₹25-35 LPA",
//     requiredSkills: ["React", "Node.js", "AWS", "Docker", "Kubernetes"],
//     growthTrend: "+18% job postings this month",
//     saved: false,
//   },
//   {
//     id: 2,
//     title: "Senior Frontend Developer",
//     company_name: "Microsoft",
//     location: "Hyderabad, Telangana",
//     employment_type: "Full-time",
//     description:
//       "Lead frontend development for Azure portal. Create intuitive user experiences for enterprise cloud services.",
//     applylink: "https://careers.microsoft.com/jobs/456",
//     fitScore: 88,
//     whyThisJob:
//       "Excellent match for your frontend expertise and cloud platform experience.",
//     salary: "₹30-40 LPA",
//     requiredSkills: ["React", "TypeScript", "Azure", "Redux", "Jest"],
//     growthTrend: "+12% job postings this month",
//     saved: true,
//   },
//   {
//     id: 3,
//     title: "DevOps Engineer",
//     company_name: "Amazon Web Services",
//     location: "Remote",
//     employment_type: "Full-time",
//     description:
//       "Design and implement CI/CD pipelines. Automate infrastructure deployment and monitoring for AWS services.",
//     applylink: "https://amazon.jobs/en/jobs/789",
//     fitScore: 85,
//     whyThisJob:
//       "Great fit for your containerization skills and cloud infrastructure knowledge.",
//     salary: "₹28-38 LPA",
//     requiredSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "Python"],
//     growthTrend: "+25% job postings this month",
//     saved: false,
//   },
//   {
//     id: 4,
//     title: "Full Stack Developer",
//     company_name: "Flipkart",
//     location: "Bangalore, Karnataka",
//     employment_type: "Full-time",
//     description:
//       "Build scalable e-commerce features. Work on both frontend and backend systems handling millions of users.",
//     applylink: "https://www.flipkartcareers.com/jobs/101",
//     fitScore: 90,
//     whyThisJob:
//       "Perfect match for your full-stack skills and e-commerce domain interest.",
//     salary: "₹22-32 LPA",
//     requiredSkills: ["React", "Node.js", "MongoDB", "Redis", "Microservices"],
//     growthTrend: "+8% job postings this month",
//     saved: false,
//   },
//   {
//     id: 5,
//     title: "AI/ML Engineer",
//     company_name: "NVIDIA",
//     location: "Pune, Maharashtra",
//     employment_type: "Full-time",
//     description:
//       "Develop and optimize machine learning models for computer vision applications. Work with state-of-the-art GPU technology.",
//     applylink: "https://nvidia.wd5.myworkdayjobs.com/jobs/202",
//     fitScore: 78,
//     whyThisJob:
//       "Good fit for your Python skills and interest in emerging technologies.",
//     salary: "₹35-50 LPA",
//     requiredSkills: ["Python", "TensorFlow", "PyTorch", "CUDA", "Computer Vision"],
//     growthTrend: "+35% job postings this month",
//     saved: true,
//   },
//   {
//     id: 6,
//     title: "Backend Engineer",
//     company_name: "Razorpay",
//     location: "Bangalore, Karnataka",
//     employment_type: "Full-time",
//     description:
//       "Build robust payment processing systems. Design APIs and microservices handling high-volume financial transactions.",
//     applylink: "https://razorpay.com/jobs/303",
//     fitScore: 87,
//     whyThisJob:
//       "Strong alignment with your backend expertise and API design experience.",
//     salary: "₹20-30 LPA",
//     requiredSkills: ["Node.js", "PostgreSQL", "Redis", "Kafka", "Microservices"],
//     growthTrend: "+15% job postings this month",
//     saved: false,
//   },
// ];

const regionData = [
  { city: "Bangalore", jobs: 1250, growth: "+18%" },
  { city: "Hyderabad", jobs: 890, growth: "+22%" },
  { city: "Pune", jobs: 720, growth: "+15%" },
  { city: "Mumbai", jobs: 650, growth: "+12%" },
  { city: "Delhi NCR", jobs: 580, growth: "+10%" },
  { city: "Chennai", jobs: 520, growth: "+14%" },
];

const interviewPrepData = {
  commonQuestions: [
    "Explain the event loop in JavaScript",
    "How do you optimize React performance?",
    "Describe your experience with microservices",
    "What's your approach to system design?",
    "How do you handle technical debt?",
  ],
  keySkillsFocus: [
    "System Design",
    "Data Structures",
    "Problem Solving",
    "Communication",
  ],
  tipsByCompany: {
    Google: "Focus on algorithms and scalability",
    Microsoft: "Emphasize product thinking and user experience",
    Amazon: "Prepare for leadership principles questions",
  },
};

export default function CareersPage() {
  const [jobListings, setJobListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  // Use job_id from API for identifiers
  const [savedJobs, setSavedJobs] = useState(
    jobListings.filter((job) => job.saved).map((j) => j.job_id)
  );
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showInterviewPrep, setShowInterviewPrep] = useState(false);

  // Filters
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedWorkType, setSelectedWorkType] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  const allSkills = [
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Kubernetes",
    "TypeScript",
    "MongoDB",
  ];
  const experienceLevels = ["all", "Entry Level", "Mid Level", "Senior Level"];
  const workTypes = ["all", "Remote", "Hybrid", "On-site"];
  const regions = [
    "all",
  ];
  const industries = [
    "all",
    "Technology",
    "E-commerce",
    "Finance",
    "Healthcare",
    "EdTech",
  ];

  useEffect(() => {
    async function fetchLatestJobs() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_PROMPT_URL}/jobs/latest?limit=25`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("data:", data);
        setJobListings(data.jobs);
      } catch (err) {
        console.error("Error fetching latest jobs:", err);
      }
    }

    fetchLatestJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let jobs = jobListings;

    jobs = jobs.map((j) => {
      j.requiredSkills = j.requiredSkills || [];
      j.fitScore = j.fitScore || Math.floor(Math.random() * 21) + 80;
      if ((j.location) && !(regions.includes(j.location))) {
        console.log(j.location, regions);
        regions.push(j.location);
      }
      return j;
    });

    // Show saved only filter
    if (showSavedOnly) {
      jobs = jobs.filter((job) => savedJobs.includes(job.job_id));
    }

    // Search query
    if (searchQuery) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      jobs = jobs.filter((job) =>
        selectedSkills.some((skill) => job.requiredSkills.includes(skill))
      );
    }

    // Work type filter
    if (selectedWorkType !== "all") {
      if (selectedWorkType === "Remote") {
        jobs = jobs.filter((job) => job.location.includes("Remote"));
      } else if (selectedWorkType === "On-site") {
        jobs = jobs.filter((job) => !job.location.includes("Remote"));
      }
    }

    // Region filter
    if (selectedRegion !== "all") {
      jobs = jobs.filter((job) => job.location.includes(selectedRegion));
    }

    return jobs;
  }, [
    searchQuery,
    selectedSkills,
    selectedWorkType,
    selectedRegion,
    showSavedOnly,
    savedJobs,
    jobListings,
    regions
  ]);

  const toggleSaveJob = (jobId) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowInsights(true);
    setShowInterviewPrep(false);
  };

  const toggleSkillFilter = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const clearAllFilters = () => {
    setSelectedSkills([]);
    setSelectedExperience("all");
    setSelectedWorkType("all");
    setSelectedRegion("all");
    setSelectedIndustry("all");
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedSkills.length > 0 ||
    selectedExperience !== "all" ||
    selectedWorkType !== "all" ||
    selectedRegion !== "all" ||
    selectedIndustry !== "all" ||
    searchQuery !== "";

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
              AI-Curated Career Opportunities
            </h1>
            <p className="text-grey-600">
              Discover jobs perfectly matched to your skills and career
              aspirations
            </p>
          </motion.div>

          {/* Job Insights Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-grey-600 mb-1">
                      Total Recommendations
                    </p>
                    <p className="text-2xl font-bold text-grey-900">
                      {filteredJobs.length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+12 this week</p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    <Briefcase className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-grey-600 mb-1">
                      Trending Domains
                    </p>
                    <p className="text-2xl font-bold text-grey-900">AI/ML</p>
                    <p className="text-xs text-green-600 mt-1">+35% growth</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 text-green-600">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-grey-600 mb-1">
                      Top Required Skills
                    </p>
                    <p className="text-2xl font-bold text-grey-900">React</p>
                    <p className="text-xs text-green-600 mt-1">1,200+ jobs</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                    <Target className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-grey-600 mb-1">Saved Jobs</p>
                    <p className="text-2xl font-bold text-grey-900">
                      {savedJobs.length}
                    </p>
                    <p className="text-xs text-grey-500 mt-1">
                      View collection
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 text-red-600">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-grey-400" />
                    <input
                      type="text"
                      placeholder="Search by job title, company, or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    variant={showSavedOnly ? "primary" : "outlined"}
                    onClick={() => setShowSavedOnly(!showSavedOnly)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        showSavedOnly ? "fill-current" : ""
                      }`}
                    />
                    Saved ({savedJobs.length})
                  </Button>
                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearAllFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Smart Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Filter className="h-5 w-5 mr-2" />
                    Smart Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Skills Filter */}
                  <div>
                    <label className="text-sm font-medium text-grey-900 mb-2 block">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkillFilter(skill)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            selectedSkills.includes(skill)
                              ? "bg-blue-600 text-white"
                              : "bg-grey-100 text-grey-700 hover:bg-grey-200"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="text-sm font-medium text-grey-900 mb-2 block">
                      Experience Level
                    </label>
                    <select
                      value={selectedExperience}
                      onChange={(e) => setSelectedExperience(e.target.value)}
                      className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level === "all" ? "All Levels" : level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Work Type */}
                  <div>
                    <label className="text-sm font-medium text-grey-900 mb-2 block">
                      Work Type
                    </label>
                    <div className="space-y-2">
                      {workTypes.map((type) => (
                        <label
                          key={type}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="workType"
                            value={type}
                            checked={selectedWorkType === type}
                            onChange={(e) =>
                              setSelectedWorkType(e.target.value)
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-grey-700">
                            {type === "all" ? "All Types" : type}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <label className="text-sm font-medium text-grey-900 mb-2 block">
                      Region
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {regions.map((region) => (
                        <option key={region} value={region}>
                          {region === "all" ? "All Regions" : region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="text-sm font-medium text-grey-900 mb-2 block">
                      Industry
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 border border-grey-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry === "all" ? "All Industries" : industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Job Listings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-4"
            >
              {filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Briefcase className="h-16 w-16 text-grey-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-grey-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-grey-600 mb-4">
                      Try adjusting your filters or search criteria
                    </p>
                    {hasActiveFilters && (
                      <Button onClick={clearAllFilters}>
                        Clear All Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.job_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`hover:shadow-lg transition-all cursor-pointer ${
                        selectedJob?.job_id === job.job_id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => handleJobClick(job)}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-grey-900">
                                {job.title}
                              </h3>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                {job.fitScore}% Match
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-grey-600 mb-3">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 mr-1" />
                                {job.company_name}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {job.employment_type}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveJob(job.job_id);
                            }}
                            className={`p-2 rounded-full transition-colors ${
                              savedJobs.includes(job.job_id)
                                ? "bg-red-50 text-red-600"
                                : "bg-grey-100 text-grey-600 hover:bg-grey-200"
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                savedJobs.includes(job.job_id)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-sm text-grey-700 mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        {/* Why This Job Highlight */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                          <div className="flex items-start">
                            <Zap className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs font-medium text-blue-900 mb-1">
                                Why this job is a great fit
                              </p>
                              <p className="text-xs text-blue-800">
                                {job.whyThisJob}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-grey-100 text-grey-700 text-xs rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(job.apply_link, "_blank");
                            }}
                            className="flex-1"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Apply Now
                          </Button>
                          <Button
                            variant="outlined"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJobClick(job);
                            }}
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View Insights
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>

            {/* Job Insights Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-1 space-y-6"
            >
              {selectedJob && showInsights && (
                <>
                  {/* Selected Job Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Job Insights</CardTitle>
                      <CardDescription className="line-clamp-1">
                        {selectedJob.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Career Fit Score */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-grey-900">
                            Career Fit Score
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            {selectedJob.fitScore}%
                          </span>
                        </div>
                        <div className="w-full bg-grey-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${selectedJob.fitScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div className="border-t border-grey-200 pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-grey-600">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Avg. Salary Range
                          </div>
                          <span className="text-sm font-semibold text-grey-900">
                            {selectedJob.salary}
                          </span>
                        </div>
                      </div>

                      {/* Growth Trend */}
                      <div className="border-t border-grey-200 pt-4">
                        <div className="flex items-center text-sm text-grey-600 mb-1">
                          <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                          Career Growth Trend
                        </div>
                        <p className="text-sm text-grey-900">
                          {selectedJob.growthTrend}
                        </p>
                      </div>

                      {/* Required Skills */}
                      <div className="border-t border-grey-200 pt-4">
                        <p className="text-sm font-medium text-grey-900 mb-2">
                          Required Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.requiredSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Related Learning Paths */}
                      <div className="border-t border-grey-200 pt-4">
                        <p className="text-sm font-medium text-grey-900 mb-2">
                          Recommended Learning Paths
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-grey-700">
                            <BookOpen className="h-3 w-3 mr-2 text-blue-600" />
                            Advanced System Design
                          </div>
                          <div className="flex items-center text-xs text-grey-700">
                            <BookOpen className="h-3 w-3 mr-2 text-blue-600" />
                            Cloud Architecture Certification
                          </div>
                          <div className="flex items-center text-xs text-grey-700">
                            <BookOpen className="h-3 w-3 mr-2 text-blue-600" />
                            Leadership in Tech
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outlined"
                        className="w-full"
                        onClick={() => setShowInterviewPrep(!showInterviewPrep)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Interview Preparation
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Interview Preparation */}
                  {showInterviewPrep && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Interview Prep
                        </CardTitle>
                        <CardDescription>
                          Prepare for {selectedJob.company_name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Common Questions */}
                        <div>
                          <p className="text-sm font-medium text-grey-900 mb-2">
                            Common Questions
                          </p>
                          <ul className="space-y-2">
                            {interviewPrepData.commonQuestions.map((q, idx) => (
                              <li
                                key={idx}
                                className="text-xs text-grey-700 flex"
                              >
                                <span className="mr-2">•</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key Skills Focus */}
                        <div className="border-t border-grey-200 pt-4">
                          <p className="text-sm font-medium text-grey-900 mb-2">
                            Key Skills Focus
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {interviewPrepData.keySkillsFocus.map(
                              (skill, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              )
                            )}
                          </div>
                        </div>

                        {/* Company Tips */}
                        <div className="border-t border-grey-200 pt-4">
                          <p className="text-sm font-medium text-grey-900 mb-2">
                            Company Summary
                          </p>
                          <p className="text-xs text-grey-700">
                            {interviewPrepData.tipsByCompany[
                              selectedJob.company_name.split(" ")[0]
                            ] ||
                              "Research the company culture and recent news before your interview."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Map className="h-5 w-5 mr-2" />
                    Regional Job Heatmap
                  </CardTitle>
                  <CardDescription>
                    Active job markets across India
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {regionData.map((region, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-grey-900">
                              {region.city}
                            </span>
                            <span className="text-xs text-green-600">
                              {region.growth}
                            </span>
                          </div>
                          <div className="w-full bg-grey-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(region.jobs / 1250) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-grey-600 ml-4">
                          {region.jobs}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outlined" onClick={() => {window.open('profile')}} className="w-full justify-start">
                    <Award className="h-4 w-4 mr-2" />
                    Update Resume
                  </Button>
                  <Button variant="outlined" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Set Job Alerts
                  </Button>
                  <Button variant="outlined" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Network Insights
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
