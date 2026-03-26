import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addGoalAsync, loadGoals, deleteGoalAsync } from "./goalsSlice";
import { useEffect } from "react";
import "./goals.css";
import AppHeader from "../../components/AppHeader";
import {
    Container,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
} from "@mui/material";
import AIFloatingButton from "../../components/ai/AIFloatingButton";

const GoalsPage = () => {
    const [goalTitle, setGoalTitle] = useState("");
    const [due_date, setdue_date] = useState("");
    const goals = useSelector((state) => state.goals.goals);
    const tasks = useSelector((state) => state.tasks.tasks);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(loadGoals());
    }, [dispatch]);

    const handleAddGoal = () => {
        console.log("Create clicked", goalTitle, due_date);
        if (goalTitle.trim()) {
            dispatch(
                addGoalAsync({
                    title: goalTitle,
                    due_date: due_date || null,
                })
            );
            setGoalTitle("");
            setdue_date("");
        }
    };

    const getUrgency = (due_date) => {
        if (!due_date) return "none";

        const today = new Date();
        const due = new Date(due_date);

        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "overdue";
        if (diffDays <= 3) return "high";
        if (diffDays <= 7) return "medium";
        return "low";
    };
    const goalsWithMeta = goals.map((goal) => {
        const goalTasks = tasks.filter((task) => task.goalId === goal.id);

        const isCompleted =
            goalTasks.length > 0 &&
            goalTasks.every((task) => task.status === "completed");

        const urgency = getUrgency(goal.due_date);

        return {
            ...goal,
            status: isCompleted ? "completed" : "active",
            urgency,
        };
    });

    return (
        <>
            <AppHeader />
            <Container maxWidth="sm" className="goals-container">
                <div className="card create-goal-card">
                    <Typography
                        variant="h5"
                        className="page-title"
                        style={{ marginBottom: 8 }}
                    >
                        Create Goal
                    </Typography>

                    <TextField
                        fullWidth
                        label="Goal title"
                        value={goalTitle}
                        size="small"
                        onChange={(e) => setGoalTitle(e.target.value)}
                        className="goal-input"
                        sx={{
                            "& .MuiOutlinedInput-input": {
                                padding: "8px",
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        type="date"
                        size="small"
                        label="Due date (optional)"
                        InputLabelProps={{ shrink: true }}
                        value={due_date}
                        onChange={(e) => setdue_date(e.target.value)}
                        className="goal-input"
                        sx={{
                            "& .MuiOutlinedInput-input": {
                                padding: "8px",
                            },
                        }}
                    />

                    <Button
                        variant="contained"
                        className="primary-button"
                        onClick={handleAddGoal}
                    >
                        Create Goal
                    </Button>
                </div>

                <Typography variant="h6" gutterBottom>
                    Your Goals
                </Typography>

                <List>
                    {goalsWithMeta.map((goal) => {
                        const isCompleted = goal.status === "completed";

                        return (
                            <ListItem
                                key={goal.id}
                                className={`goal-list-item ${
                                    isCompleted ? "goal-completed" : ""
                                }`}
                                onClick={() => navigate(`/goals/${goal.id}`)}
                            >
                                <ListItemText
                                    primary={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            {isCompleted && <span>✅</span>}
                                            <span>{goal.title}</span>
                                            {goal.urgency === "high" && (
                                                <span className="badge urgent">
                                                    ⏰ Due soon
                                                </span>
                                            )}
                                            {goal.urgency === "overdue" && (
                                                <span className="badge overdue">
                                                    ⚠ Overdue
                                                </span>
                                            )}
                                        </Box>
                                    }
                                    secondary={
                                        goal.due_date
                                            ? `Due: ${goal.due_date}`
                                            : "No due date"
                                    }
                                />
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 🔥 prevents navigation
                                        const confirmed = window.confirm(
                                            "Delete this goal? All tasks will be deleted."
                                        );
                                        if (confirmed) {
                                            dispatch(deleteGoalAsync(goal.id));
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </ListItem>
                        );
                    })}
                </List>
            </Container>
            <AIFloatingButton />
        </>
    );
};

export default GoalsPage;
