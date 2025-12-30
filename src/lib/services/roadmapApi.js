import axios from "axios";
import { apiClient } from "@/lib/apiClient";

const PROMPT_BASE = (process.env.NEXT_PUBLIC_API_PROMPT_URL || '').replace(/\/$/, '');

export const generateRoadmap = ({
  roadmapName,
  skills = [],
  currentExperience = '',
  targetDuration = ''
}) =>
  axios.post(`${PROMPT_BASE}/roadmap`, {
    roadmapName,
    skills,
    currentExperience,
    targetDuration,
  }, { headers: { 'Content-Type': 'application/json' } });

export const listRoadmaps = (params = {}) => apiClient.get("/roadmaps", { params });

export const createRoadmap = ({
  title,
  description = '',
  totalDuration,
  completionRate = 0,
  progress = 0,
  startDate,
  phases = [],
  email,
  userId,
  ownerName,
}) =>
  apiClient.post("/roadmaps", {
    title,
    description,
    totalDuration,
    completionRate,
    progress,
    startDate,
    phases,
    email,
    userId,
    ownerName,
  });

export const getRoadmapById = (id) => apiClient.get(`/roadmaps/${id}`);
