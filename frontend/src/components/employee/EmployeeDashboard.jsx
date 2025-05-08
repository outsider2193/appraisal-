import React, { useState } from 'react'
import { Box } from "@mui/material";
import SelfAssessment from './SelfAssessment'
import YourGoals from './YourGoals'
import YourTraining from './YourTraining'
import Overview from './Overview';
import EmployeeSidebar from "./EmployeeSidebar";
import EmployeeNavbar from './EmployeeNavbar';

const EmployeeDashboard = () => {
    const [activeView, setActiveView] = useState("overview");

    const renderComponent = () => {
        switch (activeView) {
            case "Overview":
                return <Overview />;
            case "self":
                return <SelfAssessment />;
            case "goals":
                return <YourGoals />;
            case "training":
                return <YourTraining />;
            default:
                return <Overview />;
        }
    };

    return (
        <Box sx={{ display: "flex", overflow: "hidden", height: "100vh" }}>
            <EmployeeSidebar setActiveView={setActiveView} />

            <Box sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 240,
                        right: 0,
                        height: 64,
                        bgcolor: "#004d40",
                        zIndex: 1200,
                    }}
                >
                    <EmployeeNavbar />
                </Box>

                <Box
                    sx={{
                        mt: "64px",
                        pl: 3,
                        pr: 3,
                        pt: 2,
                        pb: 2,
                        overflowY: "auto",
                        height: "calc(100vh - 64px)",
                    }}
                >
                    {renderComponent()}
                </Box>
            </Box>
        </Box>
    );
};


export default EmployeeDashboard
