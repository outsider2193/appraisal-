import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FlagIcon from "@mui/icons-material/Flag";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";


const EmployeeSidebar = ({ setActiveView }) => {
    const drawerWidth = 240;

    const menuItems = [
        { key: "overview", label: "Overview", icon: <DashboardIcon /> },
        { key: "self", label: "Self Assessment", icon: <AssessmentIcon /> },
        { key: "goals", label: "Your Goals", icon: <FlagIcon /> },
        { key: "training", label: "Your Training", icon: <SchoolIcon /> }
    ];

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#263238',
                    color: '#ffffff',
                },
            }}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.key} onClick={() => setActiveView(item.key)}>
                        <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default EmployeeSidebar;
