import { useState, useEffect, useRef } from "react";
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./ai.css";
import axios from "axios";
import { authHeader } from "../../auth/authHeader";

const AIChatPanel = ({ onClose }) => {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hi 👋 I’m your Study Buddy. What are you working on today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const [thinkingText, setThinkingText] = useState("Thinking");
    const bottomRef = useRef(null);

    const thinkingPhrases = [
        "Thinking",
        "Analyzing your progress",
        "Planning next steps",
        "Optimizing your prep",
    ];

    useEffect(() => {
        if (!isThinking) return;

        let i = 0;

        const interval = setInterval(() => {
            setThinkingText(thinkingPhrases[i % thinkingPhrases.length]);
            i++;
        }, 1200);

        return () => clearInterval(interval);
    }, [isThinking]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isThinking]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsThinking(true);

        try {
            const res = await axios.post(
                "http://localhost:8000/ai/ask",
                {
                    question: input, // ✅ body
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...authHeader(), // ✅ actual headers
                    },
                }
            );

            const aiMsg = {
                role: "assistant",
                content: res.data.answer,
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <Paper
            elevation={6}
            sx={{
                position: "fixed",
                bottom: 90,
                right: 24,
                width: 360,
                height: 480,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                zIndex: 1200,
            }}
            className="ai-chat-panel"
        >
            {/* Header */}
            <Box
                sx={{
                    p: 1.5,
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                className="ai-chat-header"
            >
                <Typography fontWeight={600} className="ai-chat-title">
                    Study Buddy
                </Typography>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Messages */}
            <Box
                sx={{
                    flex: 1,
                    p: 1.5,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                }}
                className="ai-chat-messages"
            >
                {/* Messages */}
                {messages.map((msg, i) => (
                    <Box
                        key={i}
                        className={`ai-message ${msg.role}`}
                        sx={{
                            alignSelf:
                                msg.role === "user" ? "flex-end" : "flex-start",
                            backgroundColor:
                                msg.role === "user"
                                    ? "primary.main"
                                    : "#f5f5f5",
                            color: msg.role === "user" ? "white" : "black",
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            maxWidth: "80%",
                            fontSize: "0.9rem",
                        }}
                    >
                        {msg.content}
                    </Box>
                ))}

                {/* ✅ Thinking state (ONLY ONCE, outside map) */}
                {isThinking && (
                    <Box
                        className="ai-message assistant thinking"
                        sx={{
                            alignSelf: "flex-start",
                            backgroundColor: "#f5f5f5",
                            color: "black",
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            maxWidth: "80%",
                            fontSize: "0.9rem",
                            fontStyle: "italic",
                            opacity: 0.8,
                        }}
                    >
                        {thinkingText}
                        <span className="typing-dots"></span>
                    </Box>
                )}

                <div ref={bottomRef} />
            </Box>

            {/* Input */}
            <Box
                sx={{
                    p: 1,
                    borderTop: "1px solid #eee",
                    display: "flex",
                    gap: 1,
                }}
                className="ai-chat-input"
            >
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Ask me anything…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                    variant="contained"
                    onClick={sendMessage}
                    className="ai-chat-btn"
                >
                    Send
                </Button>
            </Box>
        </Paper>
    );
};

export default AIChatPanel;
