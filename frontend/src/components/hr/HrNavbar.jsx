import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Button,
    Box,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";

const HrNavbar = () => {
    const token = localStorage.getItem("hr");
    let firstName = "";

    if (token) {
        try {
            const decoded = jwtDecode(token);
            firstName = decoded.firstName || "";
        } catch (error) {
            console.error("Token decode failed:", error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login"; // Direct redirection since you're not using routing
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#003366',
                width: `calc(100% - 240px)`,
                ml: '240px',
            }}
        >


            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    HR Dashboard
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#fff", color: "#003366", fontWeight: "bold" }}>
                        {firstName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Button
                        color="inherit"
                        variant="outlined"
                        sx={{ color: "#fff", borderColor: "#fff" }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HrNavbar;
