import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchGoals, createGoal, deleteGoal } from "../../api/goalsApi";

export const loadGoals = createAsyncThunk("goals/loadGoals", async () => {
    return await fetchGoals();
});

export const addGoalAsync = createAsyncThunk("goals/addGoal", async (goal) => {
    return await createGoal(goal);
});

export const deleteGoalAsync = createAsyncThunk(
    "goals/deleteGoal",
    async (goalId) => {
        await deleteGoal(goalId);
        return goalId;
    }
);

// const goalsSlice = createSlice({
//     name: "goals",
//     initialState: {
//         goals: [],
//         loading: false,
//         error: null,
//     },
//     reducers: {
//         addGoal: (state, action) => {
//             state.goals.push({
//                 id: Date.now(),
//                 title: action.payload.title,
//                 status: "active",
//                 due_date: action.payload.due_date || null,
//             });
//         },
//         updateGoalStatus: (state, action) => {
//             const goal = state.goals.find((g) => g.id === action.payload.id);
//             if (goal) {
//                 goal.status = action.payload.status;
//             }
//         },
//         updateGoaldue_date: (state, action) => {
//             const goal = state.goals.find((g) => g.id === action.payload.id);
//             if (goal) {
//                 goal.due_date = action.payload.due_date;
//             }
//         },
//     },
// });

const goalsSlice = createSlice({
    name: "goals",
    initialState: {
        goals: [],
        loading: false,
        error: null,
    },
    reducers: {}, // ← empty for now
    extraReducers: (builder) => {
        builder
            // LOAD GOALS
            .addCase(loadGoals.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadGoals.fulfilled, (state, action) => {
                state.loading = false;
                state.goals = action.payload;
            })
            .addCase(loadGoals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // ADD GOAL
            .addCase(addGoalAsync.fulfilled, (state, action) => {
                state.goals.push(action.payload);
            })

            .addCase(deleteGoalAsync.fulfilled, (state, action) => {
                state.goals = state.goals.filter(
                    (goal) => goal.id !== action.payload
                );
            });
    },
});

export default goalsSlice.reducer;
