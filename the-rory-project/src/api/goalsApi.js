import { authHeader } from "../auth/authHeader";
const API_BASE = "https://rory-backend-dwdu.onrender.com";

export const fetchGoals = async () => {
    const res = await fetch(`${API_BASE}/goals/`, {
        headers: { "Content-Type": "application/json", ...authHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch goals");
    return res.json();
};

export const createGoal = async (goal) => {
    const res = await fetch(`${API_BASE}/goals/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(goal),
    });

    if (!res.ok) throw new Error("Failed to create goal");
    return res.json();
};

export const updateGoal = async (id, updates) => {
    const res = await fetch(`${API_BASE}/goals/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...authHeader(),
        },
        body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update goal");
    return res.json();
};

export const deleteGoal = async (goalId) => {
    const res = await fetch(`${API_BASE}/goals/${goalId}`, {
        method: "DELETE",
        headers: { ...authHeader() },
    });

    if (!res.ok) throw new Error("Failed to delete goal");
    return res.json();
};
