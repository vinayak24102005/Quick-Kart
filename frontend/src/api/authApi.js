import api from "./apiClient";

// These functions only talk to the backend. If a request fails they throw,
// and the page that called them shows the error message.

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
};

// changes can be { name } or { currentPassword, newPassword }
export const updateProfile = async (changes) => {
    const response = await api.put("/auth/profile", changes);
    return response.data;
};
