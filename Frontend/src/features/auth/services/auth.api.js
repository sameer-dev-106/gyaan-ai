import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const API = axios.create({
    baseURL: `${BACKEND_URL}/api/auth`,
    withCredentials: true,
});

const handleApiError = (err, fallbackMessage) => {
    throw (
        err?.response?.data?.message ||
        err?.message ||
        fallbackMessage
    );
};

export const registerApi = async ({ username, email, password }) => {
    try {
        const response = await API.post("/register", { username, email, password });
        return { success: true, data: response.data };
    } catch (err) {
        handleApiError(err, "Registration failed");
    }
};

export const loginApi = async (email, password) => {
    try {
        const response = await API.post("/login", { email, password });
        return { success: true, data: response.data };
    } catch (err) {
        handleApiError(err, "Login failed");
    }
};

export const verifyEmailApi = async (token) => {
    try {
        const response = await API.get(`/verify-email?token=${token}`);
        return { success: true, data: response.data };
    } catch (err) {
        handleApiError(err, "Email verification failed");
    }
};

export const getMeApi = async () => {
    try {
        const response = await API.get("/me");
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "Something went wrong";
    }
};

export const logoutApi = async () => {
    try {
        await API.post("/logout");
        return { success: true };
    } catch (err) {
        handleApiError(err, "Failed to fetch user");
    }
};

export const updateProfileApi = async ({ username }) => {
    try {
        const response = await API.put("/update-profile", { username });
        return { success: true, data: response.data };
    } catch (err) {
        handleApiError(err, "Profile update failed");
    }
};

export const changePasswordApi = async ({ currentPassword, newPassword }) => {
    try {
        const response = await API.put("/change-password", { currentPassword, newPassword });
        return { success: true, data: response.data };
    } catch (err) {
        handleApiError(err, "Password change failed");
    }
};
