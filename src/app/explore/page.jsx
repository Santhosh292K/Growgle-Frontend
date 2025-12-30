"use client";
import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Upload,
  Send,
  Search,
  MessageSquare,
  Clock,
  Trash2,
  Download,
  Volume2,
  VolumeX,
  Globe,
  Languages,
  X,
  FileText,
  Image as ImageIcon,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";

import { sendExplore, sendPrompt } from "@/lib/services/exploreApi";
import { getUserProfile } from "@/lib/services/profileApi";
import { translateToEnglish, detectLanguage } from "@/lib/services/translateApi";

// Temporary inline implementations (replace with actual imports above)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function useTypewriter(
  text,
  { speed = 30, enabled = true, onTypingState = () => {} }
) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const safeText = typeof text === "string" ? text : "";

    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(safeText);
      onTypingState(false);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    indexRef.current = 0;
    setDisplayedText("");
    onTypingState(true);

    if (safeText.length === 0) {
      onTypingState(false);
      return;
    }

    setDisplayedText(safeText.slice(0, 1));
    indexRef.current = 1;

    intervalRef.current = setInterval(() => {
      if (indexRef.current >= safeText.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        onTypingState(false);
        return;
      }
      const nextIndex = indexRef.current + 1;
      setDisplayedText(safeText.slice(0, nextIndex));
      indexRef.current = nextIndex;
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text, enabled, speed, onTypingState]);

  return displayedText;
}

const MODES = [
  {
    id: "learning",
    label: "Learning",
    desc: "Master concepts with step-by-step explanations",
    icon: "🎓",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "interview",
    label: "Interview",
    desc: "Practice with mock interviews and expert feedback",
    icon: "💼",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "mentorship",
    label: "Mentorship",
    desc: "Get personalized career guidance and action plans",
    icon: "🎯",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "explore",
    label: "Explore",
    desc: "Discover new opportunities and career paths",
    icon: "🚀",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    desc: "Build your personalized learning journey",
    icon: "🗺️",
    color: "from-indigo-500 to-violet-500",
  },
];

const MODE_SUGGESTIONS = {
  learning: [
    {
      title: "Data Structures Fundamentals",
      prompt:
        "Can you explain the most important data structures for software engineering interviews with examples?",
      icon: "🧠",
    },
    {
      title: "System Design Principles",
      prompt:
        "Walk me through the fundamentals of system design that I should know for tech interviews.",
      icon: "⚙️",
    },
    {
      title: "Algorithm Patterns",
      prompt:
        "Explain common algorithm patterns like two pointers, sliding window, and dynamic programming with examples.",
      icon: "📊",
    },
    {
      title: "Language Comparison",
      prompt:
        "What are the key differences between Python, Java, and JavaScript for backend development?",
      icon: "💻",
    },
  ],
  interview: [
    {
      title: "Technical Interview Mock",
      prompt:
        "Give me a mock technical interview question for a software engineer position and provide feedback on my approach.",
      icon: "🎯",
    },
    {
      title: "Behavioral Questions",
      prompt:
        "Ask me common behavioral interview questions and help me structure better STAR method responses.",
      icon: "🗣️",
    },
    {
      title: "System Design Challenge",
      prompt:
        "Give me a system design interview question and guide me through the solution step by step.",
      icon: "🏗️",
    },
    {
      title: "Negotiation Practice",
      prompt:
        "Help me practice salary negotiation scenarios and provide tips for discussing compensation.",
      icon: "💰",
    },
  ],
  mentorship: [
    {
      title: "Career Transition Strategy",
      prompt:
        "I want to transition from [current role] to [target role]. Help me create a detailed action plan.",
      icon: "🚀",
    },
    {
      title: "Skills Assessment",
      prompt:
        "Analyze my current skills and identify gaps I need to fill for my target role in tech.",
      icon: "📈",
    },
    {
      title: "Professional Networking",
      prompt:
        "Give me actionable strategies to build a professional network in the tech industry.",
      icon: "🤝",
    },
    {
      title: "Personal Branding",
      prompt:
        "Help me develop my personal brand and online presence for career advancement.",
      icon: "✨",
    },
  ],
  explore: [
    {
      title: "Career Path Discovery",
      prompt:
        "Show me different career paths in tech and help me understand which might fit my interests and skills.",
      icon: "🔍",
    },
    {
      title: "Emerging Tech Trends",
      prompt:
        "What are the most promising emerging technology fields and career opportunities they offer?",
      icon: "🌟",
    },
    {
      title: "Remote Opportunities",
      prompt:
        "Explore remote-friendly career paths and companies that offer flexible work arrangements.",
      icon: "🌍",
    },
    {
      title: "Industry Analysis",
      prompt:
        "Compare working at startups vs big tech companies vs consulting firms - pros and cons of each.",
      icon: "⚖️",
    },
  ],
  roadmap: [
    {
      title: "90-Day Success Plan",
      prompt:
        "Create a detailed 90-day roadmap to improve my chances of landing a software engineer role.",
      icon: "📅",
    },
    {
      title: "Structured Learning Path",
      prompt:
        "Design a weekly learning schedule to master full-stack development in 6 months.",
      icon: "📚",
    },
    {
      title: "Portfolio Projects",
      prompt:
        "Help me plan and prioritize projects to build an impressive portfolio for job applications.",
      icon: "📁",
    },
    {
      title: "Certification Journey",
      prompt:
        "Recommend certifications and their timeline for advancing in cloud computing/data science/AI.",
      icon: "🏆",
    },
  ],
};

function ChatHistory({
  sessions,
  currentSessionId,
  searchHistory,
  setSearchHistory,
  onLoadSession,
  onDeleteSession,
  onNewSession,
  speaking,
  onStopSpeaking,
}) {
  const [filterMode, setFilterMode] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredSessions = sessions
    .filter((session) => {
      const matchesSearch =
        !searchHistory ||
        session.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
        session.preview.toLowerCase().includes(searchHistory.toLowerCase());
      const matchesMode = filterMode === "all" || session.mode === filterMode;
      return matchesSearch && matchesMode;
    })
    .sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "messages") return b.messageCount - a.messageCount;
      return a.title.localeCompare(b.title);
    });

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getModeColor = (mode) => {
    const modeData = MODES.find((m) => m.id === mode);
    return modeData ? modeData.color : "from-gray-400 to-gray-500";
  };

  const exportSession = (session) => {
    const content =
      session.messages
        ?.map((m) => `${m.role.toUpperCase()}: ${m.text}`)
        .join("\n\n") || "No messages";
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-900">
            <MessageSquare size={20} className="text-blue-600" />
            Chats
          </h3>
          <button
            onClick={onNewSession}
            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            New
          </button>
        </div>

        {speaking && (
          <button
            onClick={onStopSpeaking}
            className="w-full mb-4 px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            <VolumeX size={16} />
            Stop Reading
          </button>
        )}

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchHistory}
            onChange={(e) => setSearchHistory(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="all">All Modes</option>
            {MODES.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.icon} {mode.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="date">Latest</option>
            <option value="messages">Active</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium mb-1">No conversations yet</p>
            <p className="text-xs text-gray-400">
              {searchHistory
                ? "Try adjusting your search"
                : "Start a new chat to begin"}
            </p>
          </div>
        ) : (
          <div>
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                  currentSessionId === session.id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : ""
                }`}
                onClick={() => onLoadSession(session.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 flex-1 pr-2">
                    {session.title}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportSession(session);
                      }}
                      className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
                      title="Export"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${getModeColor(
                      session.mode
                    )} text-white font-medium`}
                  >
                    {MODES.find((m) => m.id === session.mode)?.icon}{" "}
                    {MODES.find((m) => m.id === session.mode)?.label}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={11} />
                    {formatDate(session.date)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                  {session.preview}
                </p>

                <div className="text-xs text-gray-500 font-medium">
                  {session.messageCount} messages
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SuggestionCards({ mode, suggestions, onSuggestionClick }) {
  const currentMode = MODES.find((m) => m.id === mode);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-3xl mb-4 shadow-lg">
          {currentMode.icon}
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          {currentMode.label} Mode
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {currentMode.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            onClick={() => onSuggestionClick(suggestion)}
            className="group relative bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {suggestion.prompt}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                Try this <Send size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getLanguageName(code) {
  const languages = {
    ta: "Tamil",
    hi: "Hindi",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    es: "Spanish",
    fr: "French",
    de: "German",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ar: "Arabic",
    en: "English",
  };
  return languages[code] || code.toUpperCase();
}

function MessageBubble({ m, onSpeakMessage, setTyping }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const isAI = m.role === "ai";
  const typedText = useTypewriter(m.text, {
    speed: 20,
    enabled: isAI,
    onTypingState: setTyping,
  });

  const displayText = typedText;
  const wasTranslated =
    m.role === "user" && m.translatedText && m.translatedText !== m.text;

  if (m.role === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[50%] space-y-2">
          {wasTranslated && (
            <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mb-1">
              <Languages size={13} />
              <span>From {getLanguageName(m.detectedLanguage)}</span>
            </div>
          )}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-2xl rounded-br-md shadow-md">
            <div className="whitespace-pre-wrap break-words">
              {displayText}
            </div>
            {m.files &&
              m.files.map((f, i) => <AttachmentPreview key={i} f={f} />)}
          </div>
          {wasTranslated && (
            <div className="flex justify-end">
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md border border-blue-200"
              >
                <Languages size={12} />
                {showTranslation ? "Hide Translation" : "Show Translation"}
              </button>
            </div>
          )}
          {wasTranslated && showTranslation && m.translatedText && (
            <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm">
              <div className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1">
                <Languages size={12} />
                English Translation:
              </div>
              <div className="text-sm text-gray-800">
                {m.translatedText}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // AI message section - keep as updated before
    const aiWasTranslated = m.translatedText && m.translatedText !== m.text;
    
    return (
      <div className="flex mb-4">
        <div className="max-w-[50%]">
          <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-md shadow-md">
            {aiWasTranslated && (
              <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Languages size={13} />
                  <span>Translated to {getLanguageName(m.detectedLanguage)}</span>
                </div>
                <button
                  onClick={() => setShowTranslated(!showTranslated)}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {showTranslated ? "Hide English" : "Show English"}
                </button>
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                AI
              </div>
              <div className="flex-1 min-w-0">
                <div className="whitespace-pre-wrap break-words text-gray-800">
                  {typedText}
                </div>
                {aiWasTranslated && showTranslated && m.translatedText && (
                  <div className="text-xs mt-3 pt-3 text-gray-600 border-t border-gray-200 bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-700">English:</span> {m.translatedText}
                  </div>
                )}
              </div>
              <button
                onClick={() => onSpeakMessage(m.text)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Read aloud"
              >
                <Volume2 size={18} />
              </button>
            </div>
            {m.files && m.files.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                {m.files.map((f, i) => (
                  <AttachmentPreview key={i} f={f} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
function AttachmentPreview({ f }) {
  if (!f) return null;

  if (f.type && f.type.startsWith("image")) {
    return (
      <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
        <img
          src={f.url}
          alt={f.name}
          className="max-h-48 w-full object-cover"
        />
      </div>
    );
  }

  if (f.type === "application/pdf" || (f.url && f.url.endsWith(".pdf"))) {
    return (
      <div className="mt-3 bg-gray-50 rounded-lg border border-gray-200 p-3">
        <a
          href={f.url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 transition-colors"
        >
          <FileText size={16} />
          {f.name || "View PDF"}
        </a>
      </div>
    );
  }

  return (
    <a
      href={f.url}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2 mt-2 font-medium transition-colors"
    >
      <FileText size={14} />
      {f.name || f.url}
    </a>
  );
}

export default function ChatPage() {
  const [mode, setMode] = useState("learning");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [speaking, setSpeaking] = useState(false);
  const [searchHistory, setSearchHistory] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [detectedLang, setDetectedLang] = useState(null);
  const [typing, setTyping] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const inputRef = useRef();
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);
  const modeDropdownRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";

    const onResult = (e) => {
      const text = e.results[0][0].transcript;
      setInput((s) => (s ? s + " " + text : text));
      setListening(false);
    };
    const onEnd = () => setListening(false);

    recog.onresult = onResult;
    recog.onend = onEnd;

    inputRef.current = recog;
    return () => {
      recog.onresult = null;
      recog.onend = null;
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setShowSuggestions(true);
    }
  }, [mode, messages.length]);

  useEffect(() => {
    const sampleSessions = [
      {
        id: "1",
        title: "Data Structures Interview Prep",
        mode: "interview",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000),
        messageCount: 8,
        preview: "Can you give me a mock technical interview question...",
        lastMessage:
          "Great practice! Focus on explaining your thought process clearly.",
        messages: [
          {
            role: "user",
            text: "Can you give me a mock technical interview question?",
          },
          {
            role: "ai",
            text: "Certainly! Let's begin. Here's your first question: Describe a time you faced a significant technical challenge...",
          },
        ],
      },
    ];
    setChatSessions(sampleSessions);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modeDropdownRef.current &&
        !modeDropdownRef.current.contains(event.target)
      ) {
        setShowModeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const startListening = () => {
    const recog = inputRef.current;
    if (!recog)
      return alert("SpeechRecognition not supported in this browser.");
    setListening(true);
    recog.start();
  };

  const stopListening = () => {
    const recog = inputRef.current;
    if (!recog) return;
    recog.stop();
    setListening(false);
  };

  const speakMessage = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFilePreview({
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
      type: f.type,
    });
  };

  const ask = async (customPrompt = null) => {
  const promptText = customPrompt || input;
  if (!promptText && !filePreview) return;

  let activeSessionId = currentSessionId;
  if (!activeSessionId) {
    activeSessionId = Date.now().toString();
    setCurrentSessionId(activeSessionId);
  }

  setInput("");
  setFilePreview(null);
  setShowSuggestions(false);
  setTranslating(true);

  let translatedText = promptText;
  let originalText = promptText;
  let detectedLanguage = 'en';
  let wasTranslated = false;

  // Translate the input to English
  try {
    const translation = await translateToEnglish(promptText);
    translatedText = translation.translatedText;
    detectedLanguage = translation.detectedLanguage;
    wasTranslated = translation.isTranslated;
    
    if (wasTranslated) {
      setDetectedLang(detectedLanguage);
      console.log(`Detected language: ${detectedLanguage}, Translated to English`);
    }
  } catch (error) {
    console.error('Translation failed, using original text:', error);
  } finally {
    setTranslating(false);
  }

  const userMsg = {
    role: "user",
    text: originalText,  // Original language text
    translatedText: wasTranslated ? translatedText : null,  // English translation
    detectedLanguage: wasTranslated ? detectedLanguage : null,
    files: filePreview ? [filePreview] : [],
    mode,
  };

  setAiLoading(true);

  let workingMessages = [];
  setMessages((prev) => {
    workingMessages = [...prev, userMsg];
    return workingMessages;
  });

  let aiText = "";
  try {
    // Use the translated text for API calls
    const textToSend = wasTranslated ? translatedText : promptText;
    
    if (mode === "explore") {
      const profileContext = {};
      try {
        const userProfile = await getUserProfile();
        if (userProfile) {
          profileContext.skills = userProfile.skills;
          profileContext.role = userProfile.role;
          profileContext.experience = userProfile.experience;
          profileContext.interests = userProfile.interests;
          profileContext.location = userProfile.location;
        }
      } catch (profileErr) {
        console.warn("Could not fetch user profile:", profileErr);
      }
      const { data } = await sendExplore({
        question: textToSend,
        profile: profileContext,
      });
      aiText = (data?.answer || data?.output || "No response").toString();
    } else {
      const { data } = await sendPrompt({ prompt: textToSend });
      aiText = (data?.output || data?.answer || "No response").toString();
    }
  } catch (e) {
    console.error("API request failed", e);
    aiText = e?.response?.data?.error
      ? `Error: ${e.response.data.error}`
      : "Error processing request";
  } finally {
    setAiLoading(false);
  }

  // If user message was translated, translate AI response back to user's language
  let aiTextInUserLanguage = aiText;
  if (wasTranslated && detectedLanguage !== 'en') {
    try {
      // You'll need to create a translateFromEnglish function in your translateApi
      // For now, we'll just store the English text and show translation option
      aiTextInUserLanguage = aiText; // This would be the translated response
    } catch (error) {
      console.error('AI response translation failed:', error);
    }
  }

  const aiMsg = { 
    role: "ai", 
    text: aiTextInUserLanguage,  // Response in user's language (for now, English)
    translatedText: wasTranslated ? aiText : null,  // Original English response
    detectedLanguage: wasTranslated ? detectedLanguage : null,
    files: [] 
  };
  
  setMessages((prev) => {
    const newMessages = [...prev, aiMsg];
    persistSession(activeSessionId, newMessages);
    return newMessages;
  });
};

  const persistSession = (sessionId, newMessages) => {
    if (!sessionId || newMessages.length === 0) return;
    const firstUserMsg = newMessages.find((m) => m.role === "user");
    const lastAiMsg = [...newMessages].reverse().find((m) => m.role === "ai");
    const title = firstUserMsg
      ? firstUserMsg.text.substring(0, 50) +
        (firstUserMsg.text.length > 50 ? "..." : "")
      : "Untitled Chat";
    const sessionData = {
      id: sessionId,
      title,
      mode,
      date: new Date(),
      messageCount: newMessages.length,
      preview: firstUserMsg?.text || "",
      lastMessage: lastAiMsg?.text || "",
      messages: newMessages,
    };
    setChatSessions((prev) => {
      const existingIndex = prev.findIndex((s) => s.id === sessionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = sessionData;
        return updated;
      }
      return [sessionData, ...prev];
    });
  };

  const createNewSession = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setShowSuggestions(true);
    setInput("");
    setFilePreview(null);
    setDetectedLang(null);
  };

  const loadSession = (sessionId) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages || []);
      setMode(session.mode);
      setShowSuggestions(session.messages?.length === 0);
      setInput("");
      setFilePreview(null);
      setDetectedLang(null);
    }
  };

  const deleteSession = (sessionId) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      createNewSession();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.prompt);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const currentModeData = MODES.find((m) => m.id === mode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="h-screen flex">
        {/* Left Sidebar - Chat History */}
        {showHistory && (
          <div className="w-80 flex-shrink-0">
            <ChatHistory
              sessions={chatSessions}
              currentSessionId={currentSessionId}
              searchHistory={searchHistory}
              setSearchHistory={setSearchHistory}
              onLoadSession={loadSession}
              onDeleteSession={deleteSession}
              onNewSession={createNewSession}
              speaking={speaking}
              onStopSpeaking={stopSpeaking}
            />
          </div>
        )}
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Toggle History Button */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title={showHistory ? "Hide history" : "Show history"}
            >
              {showHistory ? <ChevronLeft size={20} /> : <MessageSquare size={20} />}
            </button>
          </div>
          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto px-4 py-4 bg-white"
          >
            {messages.length === 0 && showSuggestions ? (
              <div className="h-full flex items-center justify-center">
                <SuggestionCards
                  mode={mode}
                  suggestions={MODE_SUGGESTIONS[mode]}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
            ) : (
              <div className="mx-auto">
                {messages.map((m, idx) => (
                  <MessageBubble
                    key={idx}
                    m={m}
                    onSpeakMessage={speakMessage}
                    setTyping={setTyping}
                  />
                ))}

                {aiLoading && (
                  <div className="flex mb-4">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md shadow-md p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          AI is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-gray-50/50 p-6">
            <div className="max-w-4xl mx-auto">
              {/* Translation indicators */}
              {detectedLang && (
                <div className="mb-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-lg border border-emerald-200">
                  <Globe size={16} />
                  <span className="font-medium">
                    Detected {getLanguageName(detectedLang)} - Auto-translating
                    to English
                  </span>
                </div>
              )}

              {translating && (
                <div className="mb-3 flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-2.5 rounded-lg border border-blue-200">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                  <span className="font-medium">
                    Translating your message...
                  </span>
                </div>
              )}

              {/* File preview */}
              {filePreview && (
                <div className="mb-3 inline-flex items-center gap-3 bg-blue-50 px-4 py-2.5 rounded-lg border border-blue-200">
                  {filePreview.type?.startsWith("image") ? (
                    <ImageIcon size={16} className="text-blue-600" />
                  ) : (
                    <FileText size={16} className="text-blue-600" />
                  )}
                  <span className="text-sm text-blue-700 font-medium">
                    {filePreview.name}
                  </span>
                  <button
                    onClick={() => setFilePreview(null)}
                    className="text-blue-600 hover:text-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* Input row */}
              <div className="flex gap-3">
                {/* Mode Selector Dropdown */}
                <div className="relative" ref={modeDropdownRef}>
                  <button
                    onClick={() => setShowModeDropdown(!showModeDropdown)}
                    className={`h-14 px-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 transition-all duration-200 flex items-center gap-2 font-medium text-sm shadow-sm hover:shadow-md bg-gradient-to-r ${currentModeData.color} text-white`}
                    title="Select mode"
                  >
                    <span className="text-lg">{currentModeData.icon}</span>
                    <span className="hidden sm:inline">{currentModeData.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        showModeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showModeDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setMode(m.id);
                            setShowModeDropdown(false);
                            if (mode !== m.id) {
                              createNewSession();
                            }
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                            mode === m.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <span className="text-2xl">{m.icon}</span>
                          <div className="flex-1">
                            <div
                              className={`font-semibold text-sm mb-1 ${
                                mode === m.id ? "text-blue-700" : "text-gray-900"
                              }`}
                            >
                              {m.label}
                            </div>
                            <div className="text-xs text-gray-500">{m.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!typing && !aiLoading) ask();
                      }
                    }}
                    disabled={typing || aiLoading}
                    placeholder={`Ask anything in ${currentModeData.label} mode...`}
                    className="w-full resize-none p-4 pr-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                    rows={1}
                    style={{ minHeight: "56px", maxHeight: "120px" }}
                  />

                  <label className="absolute right-3 top-3 cursor-pointer p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                    <Upload size={20} />
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => handleFiles(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      listening ? stopListening() : startListening()
                    }
                    disabled={aiLoading}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                      listening
                        ? "bg-red-500 text-white"
                        : "bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600"
                    }`}
                    title={listening ? "Stop listening" : "Start voice input"}
                  >
                    {listening ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    onClick={() => ask()}
                    disabled={
                      aiLoading || typing || (!input && !filePreview)
                    }
                    className={`px-6 py-4 rounded-xl font-medium text-white transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${currentModeData.color}`}
                    title="Send message"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                Press{" "}
                <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd> to
                send,{" "}
                <kbd className="px-2 py-1 bg-gray-200 rounded">
                  Shift + Enter
                </kbd>{" "}
                for new line
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 