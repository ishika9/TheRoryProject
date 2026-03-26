import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import "./StudyConsistencyChart.css";

export default function StudyConsistencyChart({ data }) {
    return (
        <Card className="study-consistency-chart" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Study Hours per Day
                </Typography>

                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                            dataKey="hoursStudied"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={42}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
