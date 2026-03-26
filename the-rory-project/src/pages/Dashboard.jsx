import React from "react";
import { useSelector } from "react-redux";
import AppHeader from "../components/AppHeader";
import StudyConsistencyChart from "../components/StudyConsistencyChart";
import { fetchDailyStudyHours } from "../api/statsApi";
import GoalEffortPieChart from "../components/GoalEffortPieChart";
import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    LinearProgress,
} from "@mui/material";
import StudyBuddy from "../components/StudyBuddy";
import AIFloatingButton from "../components/ai/AIFloatingButton";
import GoalWiseEffortChart from "../components/GoalWiseEffortChart";

const Dashboard = () => {
    const goals = useSelector((state) => state.goals.goals);
    const tasks = useSelector((state) => state.tasks.tasks);
    const goalsWithStatus = goals.map((goal) => {
        const goalTasks = tasks.filter((task) => task.goalId === goal.id);

        const isCompleted =
            goalTasks.length > 0 &&
            goalTasks.every((task) => task.status === "completed");

        return {
            ...goal,
            status: isCompleted ? "completed" : "active",
        };
    });
    const [studyData, setStudyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyStudyHours()
            .then((data) => setStudyData(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const completedGoals = goalsWithStatus.filter(
        (goal) => goal.status === "completed"
    );

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (task) => task.status === "completed"
    ).length;

    const totalTimeSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);

    const overallProgress =
        totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    const totalPlannedTime = tasks.reduce(
        (sum, task) => sum + task.plannedTime,
        0
    );
    const calculateCurrentStreak = (studyData) => {
        if (!studyData.length) return 0;

        const daysWithStudy = new Set(
            studyData.filter((d) => d.hoursStudied > 0).map((d) => d.date)
        );

        let streak = 0;
        let currentDate = new Date();

        while (true) {
            const dateStr = currentDate.toISOString().split("T")[0];
            if (!daysWithStudy.has(dateStr)) break;

            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }

        return streak;
    };

    const calculateLongestStreak = (studyData) => {
        if (!studyData.length) return 0;

        const dates = studyData
            .filter((d) => d.hoursStudied > 0)
            .map((d) => new Date(d.date))
            .sort((a, b) => a - b);

        let longest = 1;
        let current = 1;

        for (let i = 1; i < dates.length; i++) {
            const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);

            if (diff === 1) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 1;
            }
        }

        return longest;
    };

    const calculateAverageDailyTime = (studyData) => {
        if (!studyData.length) return 0;

        const studyDays = studyData.filter((d) => d.hoursStudied > 0);

        if (!studyDays.length) return 0;

        const totalHours = studyDays.reduce(
            (sum, d) => sum + d.hoursStudied,
            0
        );

        return (totalHours / studyDays.length).toFixed(1);
    };
    const getTodayHours = (studyData) => {
        if (!studyData.length) return 0;

        const today = new Date().toISOString().split("T")[0];

        const todayEntry = studyData.find((d) => d.date === today);

        return todayEntry ? todayEntry.hoursStudied : 0;
    };

    const todayHours = getTodayHours(studyData);

    const currentStreak = calculateCurrentStreak(studyData);
    const longestStreak = calculateLongestStreak(studyData);
    const avgDailyTime = calculateAverageDailyTime(studyData);

    const planningAccuracy =
        totalPlannedTime === 0
            ? 0
            : Math.round((totalTimeSpent / totalPlannedTime) * 100);

    return (
        <>
            <AppHeader />
            <Container
                maxWidth="md"
                style={{
                    padding: 24,
                    marginTop: 24,
                }}
            >
                <Typography variant="h5" style={{ marginBottom: 24 }}>
                    Dashboard
                </Typography>

                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <StatCard
                        title="Current Streak 🔥"
                        value={`${currentStreak} days`}
                    />
                    <StatCard
                        title="Longest Streak 🏆"
                        value={`${longestStreak} days`}
                    />
                    <StatCard
                        title="Avg Daily Study ⏱️"
                        value={`${avgDailyTime} hrs`}
                    />

                    <StatCard title="Goals" value={goals.length} />
                    <StatCard
                        title="Goals Achieved"
                        value={completedGoals.length}
                    />
                    {/* <StatCard title="Completed Tasks" value={completedTasks} /> */}
                    <StatCard
                        title="Time Logged Today"
                        value={`${todayHours} hrs`}
                    />
                    {/* <StatCard
                        title="Planning Accuracy"
                        value={`${planningAccuracy}%`}
                    /> */}
                </Box>
                <Box style={{ marginTop: 24 }}>
                    <Typography variant="subtitle1">
                        Overall Progress
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={overallProgress}
                        sx={{ mt: 1 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {overallProgress}% completed
                    </Typography>
                </Box>
                {!loading && <StudyConsistencyChart data={studyData} />}
                <Box sx={{ mt: 4 }}>
                    {/* Section Heading */}
                    <Typography
                        variant="h5"
                        sx={{
                            mb: 2,
                            fontWeight: 600,
                            color: "text.primary",
                        }}
                    >
                        Goal-Wise Effort Overview
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 3,
                        }}
                    >
                        <GoalWiseEffortChart />
                        <GoalEffortPieChart />
                    </Box>
                </Box>
                <AIFloatingButton />
            </Container>
        </>
    );
};

const StatCard = ({ title, value }) => (
    <Card style={{ width: 200 }}>
        <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
                {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
        </CardContent>
    </Card>
);

export default Dashboard;
