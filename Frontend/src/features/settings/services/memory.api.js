import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const API = axios.create({
  baseURL: `${BACKEND_URL}/api/memory`,
  withCredentials: true,
});

export const getMemoryApi = async () => {
  try {
    const response = await API.get("/");
    return { success: true, data: response.data };
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch memory";
  }
};

export const updatePreferencesApi = async (preferences) => {
  try {
    const response = await API.put("/preferences", preferences);
    return { success: true, data: response.data };
  } catch (err) {
    throw err.response?.data?.message || "Failed to update preferences";
  }
};

export const clearFactsApi = async () => {
  try {
    const response = await API.delete("/facts");
    return { success: true, data: response.data };
  } catch (err) {
    throw err.response?.data?.message || "Failed to clear memory";
  }
};
