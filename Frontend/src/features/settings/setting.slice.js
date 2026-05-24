import { createSlice } from "@reduxjs/toolkit";

const settingSlice = createSlice({
    name: "setting",
    initialState: {
        theme: "dark",
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
    },
});

export const { setTheme } = settingSlice.actions;
export default settingSlice.reducer;
