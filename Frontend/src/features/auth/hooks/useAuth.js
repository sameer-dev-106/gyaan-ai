import { useDispatch } from "react-redux";
import { registerApi, loginApi, getMeApi, logoutApi } from "../services/auth.api";
import { setUser, setLoading, setError, setInitialized } from "../auth.slice";

export const useAuth = () => {

    const dispatch = useDispatch()

    const handleRegister = async ({username, email, password}) => {
        dispatch(setLoading(true));
        try {
            const response = await registerApi(username, email, password);
            const user = response?.data?.user;
            if (user) dispatch(setUser(user));
            return { success: true, user: user };
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registration failed"))
            return { success: false, error: err }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleLogin = async ({email, password}) => {
        dispatch(setLoading(true));
        try {
            const response = await loginApi(email, password);
            const user = response?.data?.user;
            if (user) dispatch(setUser(user));
            return { success: true, user: user }
        } catch (err) {
            return { success: false, error: err }
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleGetMe = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getMeApi();
            const user = response?.data?.user;
            if (user) dispatch(setUser(user));
            return user ?? null
        } catch {
            dispatch(setUser(null))
            return null
        } finally {
            dispatch(setLoading(false))
            dispatch(setInitialized(true))
        }
    }

    const handleLogout = async () => {
        try {
            await logoutApi()
            dispatch(setUser(null))
        } catch (err) {
            console.error('Logout failed:', err)
        }
    }

    return {
        handleLogin,
        handleRegister,
        handleGetMe,
        handleLogout,
    }
}
