import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./AppHeader.css";

const AppHeader = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (!confirm) return;
        logout();
        navigate("/login");
    };

    return (
        <AppBar position="static" className="app-header">
            <Toolbar>
                <Typography variant="h6" className="app-title">
                    The Rory Project
                </Typography>

                <Button
                    className="nav-button"
                    onClick={() => navigate("/dashboard")}
                >
                    Dashboard
                </Button>
                <Button
                    className="nav-button"
                    onClick={() => navigate("/goals")}
                >
                    Goals
                </Button>
                <Button className="nav-button" onClick={handleLogout}>
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
