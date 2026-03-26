import { useState } from "react";
import { Fab } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/Assistant";
import AIChatPanel from "./AIChatPanel";
import "./ai.css";

const AIFloatingButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Fab
                color="primary"
                onClick={() => setOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 1200,
                }}
                className="ai-fab"
            >
                <SmartToyIcon />
            </Fab>

            {open && <AIChatPanel onClose={() => setOpen(false)} />}
        </>
    );
};

export default AIFloatingButton;
