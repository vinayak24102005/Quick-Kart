import api from "./apiClient";

// These throw on failure; callers show the message with getErrorMessage(error).
export const registerUser = async (userData) => (await api.post("/auth/register", userData)).data;
export const loginUser = async (userData) => (await api.post("/auth/login", userData)).data;
