import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { fetchGoalEffortDistribution } from "../api/statsApi";
import "./GoalEffortPieChart.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const GoalEffortPieChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchGoalEffortDistribution().then(setData);
    }, []);

    return (
        <Card
            className="goal-effort-pie-chart"
            sx={{ borderRadius: 3, height: 300 }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    % Time Spent per Goal
                </Typography>

                {data.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Log time on tasks to see this breakdown
                    </Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="hoursSpent"
                                nameKey="goalTitle"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default GoalEffortPieChart;
