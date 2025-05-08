import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    CssBaseline,
    Box,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import RateReviewIcon from "@mui/icons-material/RateReview";
import FlagIcon from "@mui/icons-material/Flag";
import SchoolIcon from "@mui/icons-material/School";

const drawerWidth = 240;

const ManagerSidebar = ({ setActiveView, activeView }) => {
    const menuItems = [
        { key: "overview", label: "Overview", icon: <DashboardIcon /> },
        { key: "review", label: "Review Form", icon: <RateReviewIcon /> },
        { key: "goals", label: "Employee Goals", icon: <FlagIcon /> },
        { key: "training", label: "Employee Training", icon: <SchoolIcon /> },
    ];

    return (
        <>
            <CssBaseline />
            <Drawer
                variant="permanent"
                anchor="left"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: "#1e1e2f",
                        color: "#ffffff",
                    },
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.key}
                            onClick={() => setActiveView(item.key)}
                            selected={activeView === item.key}
                            sx={{
                                "&.Mui-selected": {
                                    bgcolor: "rgba(255, 255, 255, 0.1)",
                                },
                                "&:hover": {
                                    bgcolor: "rgba(255, 255, 255, 0.08)",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
};

export default ManagerSidebar;
