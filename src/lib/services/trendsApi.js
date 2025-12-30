import axios from "axios";

const BASE = process.env.NEXT_PUBLIC_API_PROMPT_URL

const trendsClient = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

export const getTrends = (params = {}) => trendsClient.get("/trends", { params });

export const getOverview = (params = {}) => trendsClient.get("/overview", { params });
