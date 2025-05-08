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

const EmployeeNavbar = () => {
    const token = localStorage.getItem("token");
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
        window.location.href = "/login";
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "#004d40",
                width: `calc(100% - 240px)`,
                ml: "240px",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
                    Welcome, {firstName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: "#80cbc4", color: "#004d40", fontWeight: "bold" }}>
                        {firstName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Button
                        color="error"
                        variant="contained"
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

export default EmployeeNavbar;
