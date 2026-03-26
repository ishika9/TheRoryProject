import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    fetchTasksByGoal,
    createTask,
    updateTaskStatus,
    addTimeSpent,
    deleteTask,
} from "../../api/tasksApi";

//* -------------------- THUNKS -------------------- */

// Load tasks
export const loadTasks = createAsyncThunk("tasks/loadTasks", async (goalId) => {
    return await fetchTasksByGoal(goalId);
});

// Create task
export const addTaskAsync = createAsyncThunk(
    "tasks/addTaskAsync",
    async (task) => {
        return await createTask(task);
    }
);

// Update task status
export const updateTaskStatusAsync = createAsyncThunk(
    "tasks/updateTaskStatusAsync",
    async ({ id, status }) => {
        return await updateTaskStatus(id, status);
    }
);

// Add time spent
export const addTimeSpentAsync = createAsyncThunk(
    "tasks/addTimeSpentAsync",
    async ({ id, hours }) => {
        return await addTimeSpent(id, hours);
    }
);

export const deleteTaskAsync = createAsyncThunk(
    "tasks/deleteTask",
    async (taskId) => {
        await deleteTask(taskId);
        return taskId;
    }
);

/* -------------------- SLICE -------------------- */

const tasksSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {
        // ❌ NO local-only addTask anymore
        // backend is source of truth
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
            })

            .addCase(addTaskAsync.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })

            .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) state.tasks[index] = action.payload;
            })

            .addCase(addTimeSpentAsync.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    (t) => t.id === action.payload.id
                );
                if (index !== -1) state.tasks[index] = action.payload;
            })

            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(
                    (t) => t.id !== action.payload
                );
            });
    },
});

export default tasksSlice.reducer;
