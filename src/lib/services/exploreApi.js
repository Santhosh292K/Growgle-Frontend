import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_PROMPT_URL;

const apiClient = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

export const sendPrompt = ({ prompt, temperature, maxTokens, responseMimeType } = {}) =>
  apiClient.post("/prompt", { prompt, temperature, maxTokens, responseMimeType });

// New /explore endpoint tailored for consolidated career/geopolicy insights
// Params:
//  question: main user query
//  profile: { role, skills, experience, interests, location, profileFreeText }
//  includeTrending: boolean (default true)
//  verbose/debug: optional query params for richer metadata
export const sendExplore = ({
  question,
  profile = {},
  includeTrending = true,
  verbose = false,
  debug = false,
} = {}) => {
  const searchParams = new URLSearchParams();
  if (verbose) searchParams.set("verbose", "true");
  if (debug) searchParams.set("debug", "true");
  const qs = searchParams.toString();
  return apiClient.post(`/explore${qs ? `?${qs}` : ""}`, {
    question,
    profile,
    includeTrending,
  });
};

// Convenience wrappers (still map to legacy prompt until migrated)
export const learningPrompt = (prompt, opts) => sendPrompt({ prompt, ...opts });
export const interviewPrompt = (prompt, opts) => sendPrompt({ prompt, ...opts });
export const mentorshipPrompt = (prompt, opts) => sendPrompt({ prompt, ...opts });
export const explorePrompt = (prompt, opts) => sendPrompt({ prompt, ...opts });
export const roadmapPrompt = (prompt, opts) => sendPrompt({ prompt, ...opts });

export const generateContent = sendPrompt;
