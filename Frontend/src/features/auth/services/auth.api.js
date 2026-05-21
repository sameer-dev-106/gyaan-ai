import axios from "axios";

const API = axios.create({
    baseURL: "https://gyaan-ai-epi0.onrender.com/api/auth",
    withCredentials: true,
});

export const registerApi = async ({ username, email, password }) => {
    try {
        const response = await API.post("/register", { username, email, password });
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "Something went wrong";
    }
};

export const loginApi = async (email, password) => {
    try {
        const response = await API.post("/login", { email, password });
        return { success: true, data: response.data };
    } catch (err) {
        throw err.response?.data?.message || "auth.api - Something went wrong";
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
        throw err.response?.data?.message || "Something went wrong";
    }
};