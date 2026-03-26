import { authHeader } from "../auth/authHeader";
const BASE_URL = "https://rory-backend-dwdu.onrender.com/auth";

export const loginUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Invalid credentials");
    }

    return res.json(); // { access_token }
};

export const registerUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        throw new Error("Registration failed");
    }

    return res.json();
};
