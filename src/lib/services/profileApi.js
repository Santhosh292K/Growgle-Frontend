import { apiClient } from "../apiClient";

function getAuthHeaders() {
	if (typeof window === "undefined") return {};
	const token = localStorage.getItem("accessToken");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getUserProfile = () =>
	apiClient.get("/profile/user", { headers: getAuthHeaders() });

export const updateUserProfile = (data) =>
	apiClient.patch("/profile/user", data, { headers: getAuthHeaders() });

export const getDashboardData = () =>
	apiClient.get("/profile/dashboard", { headers: getAuthHeaders() });

export const uploadResume = async (formData) => {
	const base = (apiClient.defaults && apiClient.defaults.baseURL) || "";
	const url = `${base && base.endsWith('/') ? base.slice(0, -1) : base}/profile/resume`;
	const headers = getAuthHeaders();
	const res = await fetch(url, {
		method: "POST",
		headers,
		body: formData,
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		const message = data?.error || data?.message || `Upload failed with ${res.status}`;
		throw new Error(message);
	}
	return { data };
};

export function compileLatex(latex){
	return apiClient.post(
		"/compile",
		latex,
		{
			headers: { ...getAuthHeaders(), "Content-Type": "text/plain" },
			responseType: "blob",
		}
	);
}

export const enhanceResume = (payload) =>
	apiClient.post("/profile/resume/enhance", payload, { headers: getAuthHeaders() });

export const getResumeSource = () =>
	apiClient.get("/profile/resume/source", { headers: getAuthHeaders(), responseType: "text" });
