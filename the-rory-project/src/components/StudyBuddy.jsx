import { useState } from "react";
import {
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
} from "@mui/material";
import { authHeader } from "../auth/authHeader";

const StudyBuddy = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const askBuddy = async () => {
        if (!question.trim()) return;

        setLoading(true);
        const res = await fetch("http://localhost:8000/ai/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...authHeader() },
            body: JSON.stringify({ question }),
        });

        const data = await res.json();
        setAnswer(data.answer);
        setLoading(false);
    };

    return (
        <Card sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6">Study Buddy 🤖</Typography>

                <TextField
                    fullWidth
                    placeholder="What should I work on today?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    sx={{ my: 2 }}
                />

                <Button
                    variant="contained"
                    onClick={askBuddy}
                    disabled={loading}
                >
                    {loading ? "Thinking..." : "Ask"}
                </Button>

                {answer && (
                    <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>
                        {answer}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default StudyBuddy;
