import { authHeader } from "../auth/authHeader";

const BASE_URL = "http://localhost:8000/study";

export const fetchDailyStudyHours = async () => {
    const res = await fetch(`${BASE_URL}/daily`, {
        headers: { "Content-Type": "application/json", ...authHeader() },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch study data");
    }
    return res.json();
};

export const fetchGoalWiseEffort = async () => {
    const res = await fetch(`${BASE_URL}/goal-effort`, {
        headers: { "Content-Type": "application/json", ...authHeader() },
    });
    return res.json();
};

export const fetchGoalEffortDistribution = async () => {
    const res = await fetch(`${BASE_URL}/goal-effort-distribution`, {
        headers: { "Content-Type": "application/json", ...authHeader() },
    });
    return res.json();
};
