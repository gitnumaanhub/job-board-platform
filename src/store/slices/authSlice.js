import { createSlice } from '@reduxjs/toolkit';

// get userdata from localstorage

const getUserFromLocalStorage = () => {
    try{
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
} catch {
    return null;
}
};   
const gettokenfromstorage = () => {
    return localStorage.getItem('token') || null;
};

const initialState = {
    user: getUserFromLocalStorage(),
    token: gettokenfromstorage(),
    isAuthenticated: !!gettokenfromstorage(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        
        //save to localstorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
        loginFailure(state, action) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = action.payload;

        //remove from localstorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;

        //remove from localstorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        },
        clearError(state) {
            state.error = null;
        },
    },
});
export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;