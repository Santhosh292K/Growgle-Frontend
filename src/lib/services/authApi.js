

import { apiClient } from '../apiClient';

export const register = (data) =>
	apiClient.post('/auth/register', data);

export const loginUser = (data) =>
	apiClient.post('/auth/login', data);

export const forgotPassword = (data, token) =>
	apiClient.post('/auth/forgot-password', data, {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});

export const resetPassword = (data, token) =>
	apiClient.post('/auth/reset-password', data, {
		headers: { Authorization: `Bearer ${token}` },
	});

export const verifyToken = (data) =>
	apiClient.post('/auth/verify-token', data);

export const verifyMainToken = (data) =>
	apiClient.post('/auth/verify-main-token', data);

export const refreshToken = () =>
	apiClient.post('/auth/refresh-token', {}, { withCredentials: true });

export const verifyTokenForgot = (token) =>
	apiClient.get('/auth/verify-token-forgot', {
		headers: { Authorization: `Bearer ${token}` },
	});
