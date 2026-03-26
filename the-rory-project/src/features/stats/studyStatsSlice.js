import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

export default function StudyConsistencyChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6">Study Consistency</Typography>
                    <Typography variant="body2" color="text.secondary">
                        No study data yet. Log your first study session 📚
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Study Consistency (Hours per Day)
                </Typography>

                <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis
                            allowDecimals={false}
                            label={{
                                value: "Hours",
                                angle: -90,
                                position: "insideLeft",
                            }}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="hoursStudied"
                            stroke="#1976d2"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
