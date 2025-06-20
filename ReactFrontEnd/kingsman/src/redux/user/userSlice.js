import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    lording: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logInStart: (state) => {
            state.lording = true;
            state.error = null;
        },
        logInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.lording = false;
            state.error = null;
        },
        logInFailure: (state, action) => {
            state.error = action.payload;
            state.lording = false;
        },
        updateStart: (state) => {
            state.lording = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.lording = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.error = action.payload;
            state.lording = false;
        },
        logOutSuccess: (state) => {
            state.currentUser = null;
            state.lording = false;
            state.error = null;
        },
        resetPasswordStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        resetPasswordSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        resetPasswordFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { logInStart, logInSuccess, logInFailure, updateStart, updateSuccess, updateFailure, logOutSuccess, resetPasswordStart, resetPasswordSuccess, resetPasswordFailure  } = userSlice.actions;

export default userSlice.reducer;