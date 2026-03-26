import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { fetchGoalWiseEffort } from "../api/statsApi";
import { Card, CardContent, Typography } from "@mui/material";
import "./GoalWiseEffortChart.css";

const GoalWiseEffortChart = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchGoalWiseEffort().then(setData);
    }, []);

    return (
        <Card className="study-consistency-chart" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Goal-wise Effort (Hours)
                </Typography>

                {data.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No effort data yet. Log time on tasks to see this chart.
                    </Typography>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="goalTitle" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="hoursSpent"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={42}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default GoalWiseEffortChart;
