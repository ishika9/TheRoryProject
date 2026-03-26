import { useState } from "react";
import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const RegisterPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser(email, password);
        navigate("/login");
    };

    return (
        <Card sx={{ maxWidth: 360, mx: "auto", mt: 12 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Create Account
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterPage;
