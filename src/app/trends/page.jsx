"use client";

import React, { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Globe,
  Brain,
  Shield,
  Smartphone,
  Cloud,
  Calendar,
  ArrowRight,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getOverview, getTrends } from "@/lib/services/trendsApi";

// const trendingSkills = [
//   {
//     name: "AI/Machine Learning",
//     growth: "+45%",
//     demand: "Very High",
//     salary: "$120k+",
//     color: "text-green-600",
//   },
//   {
//     name: "Cloud Computing",
//     growth: "+38%",
//     demand: "High",
//     salary: "$110k+",
//     color: "text-blue-600",
//   },
//   {
//     name: "Cybersecurity",
//     growth: "+35%",
//     demand: "High",
//     salary: "$115k+",
//     color: "text-red-600",
//   },
//   {
//     name: "DevOps/SRE",
//     growth: "+32%",
//     demand: "High",
//     salary: "$125k+",
//     color: "text-purple-600",
//   },
//   {
//     name: "Data Science",
//     growth: "+28%",
//     demand: "High",
//     salary: "$105k+",
//     color: "text-yellow-600",
//   },
//   {
//     name: "React/Frontend",
//     growth: "+25%",
//     demand: "Medium",
//     salary: "$95k+",
//     color: "text-blue-500",
//   },
// ];

// const industryNews = [
//   {
//     id: 1,
//     title: "OpenAI Announces GPT-5: What It Means for Developers",
//     source: "TechCrunch",
//     date: "2 hours ago",
//     category: "AI/ML",
//     impact: "High",
//     summary:
//       "New AI capabilities will reshape software development roles and create new opportunities.",
//     url: "#",
//   },
//   {
//     id: 2,
//     title: "Google Cloud Introduces New AI Development Tools",
//     source: "Google Cloud Blog",
//     date: "5 hours ago",
//     category: "Cloud",
//     impact: "Medium",
//     summary:
//       "Enhanced AI development platform aims to democratize machine learning.",
//     url: "#",
//   },
//   {
//     id: 3,
//     title: "Remote Work Policies: 2025 Industry Shifts",
//     source: "Harvard Business Review",
//     date: "1 day ago",
//     category: "Workplace",
//     impact: "High",
//     summary:
//       "Companies adapting hybrid models with focus on digital collaboration skills.",
//     url: "#",
//   },
//   {
//     id: 4,
//     title: "Cybersecurity Skills Gap Reaches Critical Levels",
//     source: "InfoSec Magazine",
//     date: "2 days ago",
//     category: "Security",
//     impact: "High",
//     summary: "Industry faces 3.5M unfilled cybersecurity positions globally.",
//     url: "#",
//   },
// ];

// const governmentPolicies = [
//   {
//     title: "EU AI Act Implementation",
//     region: "European Union",
//     status: "Active",
//     impact: "High",
//     description:
//       "New regulations for AI development and deployment affecting tech careers.",
//     deadline: "August 2025",
//     relevantRoles: ["AI Engineer", "Data Scientist", "Compliance Officer"],
//   },
//   {
//     title: "US CHIPS and Science Act",
//     region: "United States",
//     status: "Funding Available",
//     impact: "Medium",
//     description:
//       "Investment in semiconductor research creating new engineering opportunities.",
//     deadline: "Ongoing",
//     relevantRoles: [
//       "Hardware Engineer",
//       "Research Scientist",
//       "Manufacturing Engineer",
//     ],
//   },
//   {
//     title: "Digital Services Act",
//     region: "European Union",
//     status: "Compliance Required",
//     impact: "Medium",
//     description:
//       "Platform accountability requirements creating demand for digital governance roles.",
//     deadline: "February 2025",
//     relevantRoles: ["Product Manager", "Legal Tech", "Content Moderator"],
//   },
// ];

// const marketInsights = [
//   {
//     category: "Job Market",
//     metrics: [
//       {
//         label: "Tech Job Growth",
//         value: "13%",
//         trend: "up",
//         description: "Year-over-year increase",
//       },
//       {
//         label: "Remote Positions",
//         value: "42%",
//         trend: "up",
//         description: "Of all tech jobs",
//       },
//       {
//         label: "Avg. Time to Hire",
//         value: "23 days",
//         trend: "down",
//         description: "For skilled developers",
//       },
//     ],
//   },
//   {
//     category: "Salary Trends",
//     metrics: [
//       {
//         label: "Junior Dev Avg.",
//         value: "$75k",
//         trend: "up",
//         description: "Entry-level positions",
//       },
//       {
//         label: "Senior Dev Avg.",
//         value: "$145k",
//         trend: "up",
//         description: "5+ years experience",
//       },
//       {
//         label: "AI Specialist Avg.",
//         value: "$165k",
//         trend: "up",
//         description: "Machine learning focus",
//       },
//     ],
//   },
// ];

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [timeframe, setTimeframe] = useState("week");
  const [skillsCards, setSkillsCards] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [insights, setInsights] = useState([]);
  const [emergingTech, setEmergingTech] = useState([]);

  const categories = [
    "all",
    "AI/ML",
    "Cloud",
    "Security",
    "Frontend",
    "Backend",
  ];

  const filteredNews = useMemo(() => {
    if (selectedCategory === "all") return newsItems;
    return newsItems.filter((news) =>
      (news.category || "")
        .toLowerCase()
        .includes(selectedCategory.toLowerCase())
    );
  }, [newsItems, selectedCategory]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [trendsResp, overviewResp] = await Promise.all([
          getTrends({ days: 7, limit: 5 }).catch(() => ({ data: { success: false } })),
          getOverview({ days: 7, limit: 3 }).catch(() => ({
            data: { success: false },
          })),
        ]);

        const trendsRes = trendsResp?.data;
        const overviewRes = overviewResp?.data;

        console.log("Trends Response:", overviewRes);

        if (!cancelled && trendsRes && trendsRes.success) {
          const cards = Array.isArray(trendsRes.cards) ? trendsRes.cards : [];
          const mapped = cards.map((block) => {
            const lines = String(block)
              .split(/\n/)
              .map((s) => s.trim())
              .filter(Boolean);
            const name = lines[0] || "";
            const growth = (lines[1] || "+0%").replace(/^\+?/, "+");
            const demandIdx = lines.findIndex((l) =>
              l.toLowerCase().startsWith("demand")
            );
            const demand =
              (demandIdx >= 0 ? lines[demandIdx + 1] || "" : "").trim() ||
              "Medium";
            const salaryIdx = lines.findIndex((l) =>
              l.toLowerCase().startsWith("avg. salary")
            );
            const salary =
              (salaryIdx >= 0 ? lines[salaryIdx + 1] || "" : "").trim() ||
              "₹100k+";
            const color = growth.includes("-")
              ? "text-red-600"
              : "text-green-600";
            return { name, growth, demand, salary, color };
          });
          setSkillsCards(mapped);
        }

        if (
          !cancelled &&
          overviewRes &&
          overviewRes.success &&
          overviewRes.overview
        ) {
          const ov = overviewRes.overview;

          const news = Array.isArray(ov.industryNews?.personalized)
            ? ov.industryNews.personalized
            : [];
          const normalizedNews = news.map((n, idx) => ({
            id: n.id || idx,
            title: n.title || n.headline || "",
            source: n.source || n.publisher || "",
            date: n.publishedAt || n.date || "",
            category: n.category || (n.tags && n.tags[0]) || "General",
            impact: n.impact || "Medium",
            summary: n.summary || n.description || "",
            url: n.url || "#",
          }));
          setNewsItems(normalizedNews);

          const gp = Array.isArray(ov.governmentPoliciesAndRegulations)
            ? ov.governmentPoliciesAndRegulations
            : [];
          const normalizedPolicies = gp.map((p) => ({
            title: p.title || p.name || "",
            region: p.region || p.country || "",
            status: p.status || "Active",
            impact: p.impact || "Medium",
            description: p.description || "",
            deadline: p.deadline || p.date || "",
            relevantRoles: Array.isArray(p.relevantRoles)
              ? p.relevantRoles
              : [],
          }));
          setPolicies(normalizedPolicies);

          const ms = ov.marketInsights || {};
          const metrics = [];
          if (Array.isArray(ms.topSources) && ms.topSources.length) {
            metrics.push({
              category: "Top Sources",
              metrics: ms.topSources.slice(0, 3).map((s) => ({
                label: s.source || s.name || "Source",
                value: String(s.count || s.mentions || "-"),
                trend: "up",
                description: "Article mentions",
              })),
            });
          }
          if (Array.isArray(ms.volumeByDay) && ms.volumeByDay.length) {
            const last = ms.volumeByDay[ms.volumeByDay.length - 1]?.count || 0;
            const prev =
              ms.volumeByDay[ms.volumeByDay.length - 2]?.count || last;
            const up = Number(last) >= Number(prev);
            metrics.push({
              category: "Volume",
              metrics: [
                {
                  label: "Articles Today",
                  value: String(last),
                  trend: up ? "up" : "down",
                  description: "Compared to previous day",
                },
              ],
            });
          }
          setInsights(metrics);

          const et = Array.isArray(ov.emergingTechnologies)
            ? ov.emergingTechnologies
            : [];
          const normalizedEt = et.slice(0, 5).map((t) => ({
            name: t.name || t.title || "",
            growth: t.stage || t.growth || "Emerging",
            icon: "✨",
          }));
          setEmergingTech(normalizedEt);
        }
      } finally {
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

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
              Industry Trends
            </h1>
            <p className="text-grey-600">
              Stay ahead with real-time insights on technology trends and career
              opportunities
            </p>
          </motion.div>

          {/* Trending Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Trending Skills
                </CardTitle>
                <CardDescription>
                  Most in-demand skills with highest growth potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillsCards.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-grey-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-grey-900">
                          {skill.name}
                        </h3>
                        <span
                          className={`text-sm font-semibold ${skill.color}`}
                        >
                          {skill.growth}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-grey-600">Demand:</span>
                          <span className="font-medium">{skill.demand}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-grey-600">Avg. Salary:</span>
                          <span className="font-medium">{skill.salary}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Industry News */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-blue-600" />
                          Industry News
                        </CardTitle>
                        <CardDescription>
                          Latest developments affecting tech careers
                        </CardDescription>
                      </div>
                      {/* <div className="flex items-center space-x-2">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="text-sm border border-grey-300 rounded-lg px-3 py-1"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat === "all" ? "All Categories" : cat}
                            </option>
                          ))}
                        </select>
                      </div> */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredNews.map((news) => (
                        <div
                          key={news.id}
                          className="border border-grey-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  news.category === "AI/ML"
                                    ? "bg-purple-100 text-purple-700"
                                    : news.category === "Cloud"
                                    ? "bg-blue-100 text-blue-700"
                                    : news.category === "Security"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-grey-100 text-grey-700"
                                }`}
                              >
                                {news.category}
                              </span>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  news.impact === "High"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {news.impact} Impact
                              </span>
                            </div>
                            <span className="text-xs text-grey-500">
                              {news.date}
                            </span>
                          </div>
                          <h3 className="font-medium text-grey-900 mb-2">
                            {news.title}
                          </h3>
                          <p className="text-sm text-grey-600 mb-3">
                            {news.summary}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-grey-500">
                              {news.source}
                            </span>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                            >
                              Read More
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Button> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Government Policies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-600" />
                      Government Policies & Regulations
                    </CardTitle>
                    <CardDescription>
                      Policy changes impacting tech careers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {policies.map((policy, index) => (
                        <div
                          key={index}
                          className="border border-grey-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-grey-900">
                              {policy.title}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                policy.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : policy.status === "Funding Available"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {policy.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-grey-600 mb-2">
                            <span>{policy.region}</span>
                            <span>•</span>
                            <span>Deadline: {policy.deadline}</span>
                          </div>
                          <p className="text-sm text-grey-700 mb-3">
                            {policy.description}
                          </p>
                          <div>
                            <span className="text-xs text-grey-600">
                              Relevant roles:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {policy.relevantRoles.map((role, roleIndex) => (
                                <span
                                  key={roleIndex}
                                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Market Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                      Market Insights
                    </CardTitle>
                    <CardDescription>Key metrics and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {insights.map((insight, index) => (
                        <div key={index}>
                          <h4 className="font-medium text-grey-900 mb-3">
                            {insight.category}
                          </h4>
                          <div className="space-y-3">
                            {insight.metrics.map((metric, metricIndex) => (
                              <div
                                key={metricIndex}
                                className="flex justify-between items-center"
                              >
                                <div>
                                  <div className="text-sm font-medium text-grey-900">
                                    {metric.label}
                                  </div>
                                  <div className="text-xs text-grey-600">
                                    {metric.description}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="font-bold text-grey-900">
                                    {metric.value}
                                  </span>
                                  {metric.trend === "up" ? (
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Emerging Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-pink-600" />
                      Emerging Technologies
                    </CardTitle>
                    <CardDescription>Technologies to watch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          name: "Quantum Computing",
                          growth: "Early Stage",
                          icon: "⚛️",
                        },
                        {
                          name: "Web3 & Blockchain",
                          growth: "Growing",
                          icon: "🔗",
                        },
                        {
                          name: "AR/VR Development",
                          growth: "Expanding",
                          icon: "🥽",
                        },
                        {
                          name: "Edge Computing",
                          growth: "Rising",
                          icon: "📡",
                        },
                        {
                          name: "Sustainable Tech",
                          growth: "Emerging",
                          icon: "🌱",
                        },
                      ].map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-grey-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{tech.icon}</span>
                            <span className="font-medium text-grey-900">
                              {tech.name}
                            </span>
                          </div>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {tech.growth}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Stay Updated</CardTitle>
                    <CardDescription>
                      Get personalized trend alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outlined"
                        className="w-full justify-start"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Set Trend Alerts
                      </Button>
                      <Button
                        variant="outlined"
                        className="w-full justify-start"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Customize Feed
                      </Button>
                      <Button className="w-full">
                        Update My Profile
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
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
