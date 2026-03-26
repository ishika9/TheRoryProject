import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { addTask, updateTaskStatus, addTimeSpent } from "./tasksSlice";
import { Snackbar, Alert } from "@mui/material";
import {
    loadTasks,
    addTaskAsync,
    updateTaskStatusAsync,
    addTimeSpentAsync,
    deleteTaskAsync,
} from "./tasksSlice";
import AIFloatingButton from "../../components/ai/AIFloatingButton";

import AppHeader from "../../components/AppHeader";
import "./tasks.css";
import {
    Container,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
    Box,
    Typography,
    LinearProgress,
} from "@mui/material";

const TasksPage = () => {
    const { goalId } = useParams();
    const dispatch = useDispatch();
    const [taskTitle, setTaskTitle] = useState("");
    const [timeInput, setTimeInput] = useState({});
    const [plannedTime, setPlannedTime] = useState("");
    const [notif, setNotif] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showNotif = (message, severity = "success") => {
        setNotif({ open: true, message, severity });
    };

    const tasks = useSelector((state) =>
        state.tasks.tasks.filter((t) => t.goalId === Number(goalId))
    );
    useEffect(() => {
        dispatch(loadTasks(goalId));
    }, [goalId, dispatch]);

    const totalPlanned = tasks.reduce((sum, task) => sum + task.plannedTime, 0);

    const totalActual = tasks.reduce((sum, task) => sum + task.timeSpent, 0);

    const planAccuracy =
        totalPlanned === 0 ? 0 : Math.round((totalActual / totalPlanned) * 100);

    const completedCount = tasks.filter((t) => t.status === "completed").length;
    const progressPercent =
        tasks.length === 0
            ? 0
            : Math.round((completedCount / tasks.length) * 100);

    const prevProgressRef = React.useRef(0);

    useEffect(() => {
        const prev = prevProgressRef.current;

        if (prev < 50 && progressPercent >= 50) {
            showNotif("🎉 Yay! You’re 50% done with this goal!");
        }

        if (prev < 100 && progressPercent === 100) {
            showNotif("🏆 Goal completed! You crushed it!", "success");
        }

        prevProgressRef.current = progressPercent;
    }, [progressPercent]);

    return (
        <>
            <AppHeader showBack />
            <Container maxWidth="sm" className="tasks-container">
                <Typography variant="h6">Tasks</Typography>
                <Box sx={{ my: 2 }}>
                    <Typography variant="body2">
                        Planned: {totalPlanned} hrs | Spent: {totalActual} hrs |
                        Remaining: {totalPlanned - totalActual} hrs
                    </Typography>
                    {/* <Typography variant="body2">
                        Plan accuracy: {planAccuracy}%
                    </Typography> */}
                </Box>

                <div className="goal-progress-wrapper">
                    <div
                        className="goal-progress-bar"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                <Typography variant="body2">
                    {progressPercent}% completed
                </Typography>

                <TextField
                    fullWidth
                    label="Task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    sx={{ mt: 3 }}
                />

                <TextField
                    fullWidth
                    type="number"
                    label="Planned time (hours)"
                    value={plannedTime}
                    onChange={(e) => setPlannedTime(e.target.value)}
                    sx={{ mt: 2 }}
                />

                <Button
                    variant="contained"
                    sx={{ mt: 2, mb: 3 }}
                    onClick={() => {
                        if (taskTitle.trim()) {
                            dispatch(
                                addTaskAsync({
                                    goalId: Number(goalId),
                                    title: taskTitle,
                                    plannedTime: Number(plannedTime),
                                })
                            );
                            setTaskTitle("");
                            setPlannedTime("");
                        }
                    }}
                    className="primary-button"
                >
                    Add Task
                </Button>

                <List>
                    {tasks.map((task) => {
                        let status = "on-track";

                        if (task.timeSpent > task.plannedTime) {
                            status = "over";
                        } else if (
                            task.plannedTime > 0 &&
                            task.timeSpent / task.plannedTime >= 0.7
                        ) {
                            status = "at-risk";
                        }
                        const isCompleted = task.status === "completed";
                        const taskProgress = isCompleted
                            ? 100
                            : task.plannedTime === 0
                            ? 0
                            : Math.min(
                                  Math.round(
                                      (task.timeSpent / task.plannedTime) * 100
                                  ),
                                  100
                              );

                        return (
                            <ListItem
                                key={task.id}
                                divider
                                className={isCompleted ? "task-completed" : ""}
                            >
                                <Box sx={{ width: "100%" }}>
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
                                                <span>{task.title}</span>
                                            </Box>
                                        }
                                        secondary={`Planned: ${
                                            task.plannedTime
                                        } hrs | Spent: ${
                                            task.timeSpent
                                        } hrs | Remaining: ${
                                            task.plannedTime - task.timeSpent >
                                            0
                                                ? task.plannedTime -
                                                  task.timeSpent
                                                : 0
                                        } hrs`}
                                    />

                                    <div className="task-progress-wrapper">
                                        <div
                                            className={`task-progress-bar ${status}`}
                                            style={{
                                                width: `${taskProgress}%`,
                                            }}
                                        />
                                    </div>

                                    {isCompleted ? (
                                        <span className="status-badge completed">
                                            Completed in {task.timeSpent} hrs
                                            (planned {task.plannedTime} hrs)
                                        </span>
                                    ) : (
                                        <span
                                            className={`status-badge ${status}`}
                                        >
                                            {status === "on-track" &&
                                                "On Track"}
                                            {status === "at-risk" &&
                                                "⏰ Focus Here"}
                                            {status === "over" && "⚠ Overdue"}
                                        </span>
                                    )}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            gap: 1,
                                            mt: 2,
                                            alignItems: "center",
                                        }}
                                    >
                                        <TextField
                                            size="small"
                                            type="number"
                                            label="Hours"
                                            value={timeInput[task.id] || ""}
                                            disabled={isCompleted}
                                            onChange={(e) =>
                                                setTimeInput({
                                                    ...timeInput,
                                                    [task.id]: e.target.value,
                                                })
                                            }
                                        />

                                        <Button
                                            size="small"
                                            disabled={isCompleted}
                                            onClick={() => {
                                                const hours = Number(
                                                    timeInput[task.id]
                                                );
                                                if (hours > 0) {
                                                    dispatch(
                                                        addTimeSpentAsync({
                                                            id: task.id,
                                                            hours,
                                                        })
                                                    );
                                                    setTimeInput({
                                                        ...timeInput,
                                                        [task.id]: "",
                                                    });
                                                }
                                            }}
                                            className="text-button"
                                        >
                                            Log Time
                                        </Button>

                                        <Select
                                            size="small"
                                            value={task.status}
                                            disabled={isCompleted}
                                            onChange={(e) =>
                                                dispatch(
                                                    updateTaskStatusAsync({
                                                        id: task.id,
                                                        status: e.target.value,
                                                    })
                                                )
                                            }
                                        >
                                            <MenuItem value="not_started">
                                                Not Started
                                            </MenuItem>
                                            <MenuItem value="in_progress">
                                                In Progress
                                            </MenuItem>
                                            <MenuItem value="completed">
                                                Completed
                                            </MenuItem>
                                        </Select>
                                        {isCompleted && (
                                            <Button
                                                size="small"
                                                color="warning"
                                                onClick={() => {
                                                    const confirmed =
                                                        window.confirm(
                                                            "Reopen this task? Time logging will be re-enabled."
                                                        );
                                                    if (confirmed) {
                                                        dispatch(
                                                            updateTaskStatusAsync(
                                                                {
                                                                    id: task.id,
                                                                    status: "in_progress",
                                                                }
                                                            )
                                                        );
                                                    }
                                                }}
                                            >
                                                Reopen
                                            </Button>
                                        )}
                                        <Button
                                            size="small"
                                            color="error"
                                            onClick={() => {
                                                const confirmed =
                                                    window.confirm(
                                                        "Delete this task?"
                                                    );
                                                if (confirmed) {
                                                    dispatch(
                                                        deleteTaskAsync(task.id)
                                                    );
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </Box>
                            </ListItem>
                        );
                    })}
                </List>
            </Container>
            <Snackbar
                open={notif.open}
                autoHideDuration={4000}
                onClose={() => setNotif({ ...notif, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setNotif({ ...notif, open: false })}
                    severity={notif.severity}
                    sx={{ width: "100%" }}
                >
                    {notif.message}
                </Alert>
            </Snackbar>
            <AIFloatingButton />
        </>
    );
};

export default TasksPage;
