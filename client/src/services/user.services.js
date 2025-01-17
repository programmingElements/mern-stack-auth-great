import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

export const registerUser = (register) => {
    return api.post("/api/v1/user/register", register);
}

export const loginUser = (login) => {
    return api.post("/api/v1/user/login", login);
}

export const getUserInfo = () => {
    return api.get("/api/v1/user/profile");
}

export const isUserLoggedIn = () => {
    return api.get("/api/v1/user/is-auth");
}

export const logoutUser = () => {
    return api.post("/api/v1/user/logout");
}

export const sendVerifyOtp = () => {
    return api.post("/api/v1/user/send-verify-otp");
}

export const verifyAccount = (data) => {
    return api.post("/api/v1/user/verify-account", data);
}

export const sendResetOtp = (data) => {
    return api.post("/api/v1/user/send-reset-otp", data);
}