import { authHeader } from "../auth/authHeader";

const BASE_URL = "https://rory-backend-dwdu.onrender.com/tasks";

/* Get all tasks for a goal */
export const fetchTasksByGoal = async (goalId) => {
    const res = await fetch(`${BASE_URL}/goal/${goalId}`, {
        headers: { "Content-Type": "application/json", ...authHeader() },
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
};

/* Create a task */
export const createTask = async (task) => {
    const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
};

/* Update task status */
export const updateTaskStatus = async (taskId, status) => {
    const res = await fetch(`${BASE_URL}/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update task status");
    return res.json();
};

/* Add time spent */
export const addTimeSpent = async (taskId, hours) => {
    const res = await fetch(`${BASE_URL}/${taskId}/time`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ hours }),
    });
    if (!res.ok) throw new Error("Failed to add time");
    return res.json();
};

/* Delete task */
export const deleteTask = async (taskId) => {
    const res = await fetch(`${BASE_URL}/${taskId}`, {
        method: "DELETE",
        headers: { ...authHeader() },
    });

    if (!res.ok) throw new Error("Failed to delete task");
    return res.json();
};
