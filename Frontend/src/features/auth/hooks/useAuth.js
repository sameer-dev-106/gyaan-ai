import { useDispatch } from "react-redux";
import { registerApi, loginApi, verifyEmailApi, getMeApi, logoutApi } from "../services/auth.api";
import { setUser, setLoading, setError, setInitialized } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const handleRegister = async ({ username, email, password }) => {
        dispatch(setLoading(true));
        try {
            await registerApi({ username, email, password });
            return { success: true };
        } catch (err) {
            const message = typeof err === "string" ? err : err?.message || "Registration failed";
            dispatch(setError(message));
            return { success: false, error: message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async ({ email, password }) => {
        dispatch(setLoading(true));
        try {
            const response = await loginApi(email, password);
            const user = response?.data?.user;
            if (user) dispatch(setUser(user));
            return { success: true, user };
        } catch (err) {
            const message = typeof err === "string" ? err : err?.message || "Login failed";
            return { success: false, error: message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleVerifyEmail = async (token) => {
        dispatch(setLoading(true));
        try {
            const response = await verifyEmailApi(token);
            return { success: true, alreadyVerified: response?.data?.alreadyVerified ?? false };
        } catch (err) {
            const message =
                typeof err === "string" ? err : err?.message || "Verification failed";
            dispatch(setError(message));
            return { success: false, error: message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getMeApi();
            const user = response?.data?.user;
            if (user) dispatch(setUser(user));
            return user ?? null;
        } catch {
            dispatch(setUser(null));
            return null;
        } finally {
            dispatch(setLoading(false));
            dispatch(setInitialized(true));
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi();
            dispatch(setUser(null));
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return {
        handleLogin,
        handleRegister,
        handleVerifyEmail,
        handleGetMe,
        handleLogout,
    };
};
