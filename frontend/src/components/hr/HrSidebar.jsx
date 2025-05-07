import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PeopleIcon from "@mui/icons-material/People";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RateReviewIcon from "@mui/icons-material/RateReview";

const HrSidebar = ({ setActiveView }) => {
    const drawerWidth = 240;

    const menuItems = [
        { key: "overview", label: "Overview", icon: <DashboardIcon /> },
        { key: "create", label: "Create Appraisal", icon: <AddBoxIcon /> },
        { key: "employees", label: "Employees", icon: <PeopleIcon /> },
        { key: "managers", label: "Managers", icon: <SupervisorAccountIcon /> },
        { key: "all", label: "All Appraisals", icon: <FolderOpenIcon /> },
        { key: "review", label: "HR Review Form", icon: <RateReviewIcon /> },
    ];

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    bgcolor: '#1e1e2f',
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

export default HrSidebar;
