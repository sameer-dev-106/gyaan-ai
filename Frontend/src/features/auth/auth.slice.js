import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,
        error: null,
        initialized: false,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setInitialized: (state, action) => {
            state.initialized = action.payload;
        },
        updateTokenUsage: (state, action) => {
            if (state.user) {
                state.user.tokensUsed = action.payload.tokensUsed;
                state.user.tokenLimit = action.payload.tokenLimit;
            }
        },
        updateUsername: (state, action) => {
            if (state.user) {
                state.user.username = action.payload;
            }
        },
    }
});

export const { setUser, setLoading, setError, setInitialized, updateTokenUsage, updateUsername } = authSlice.actions;

export default authSlice.reducer;
