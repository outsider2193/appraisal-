import React, { useState } from "react";
import { Box } from "@mui/material";
import ManagerSidebar from "./ManagerSidebar";
import ManagerNavbar from "./ManagerNavbar";

// Replace these with actual Manager-specific components
import ManagerOverview from "./ManagerOverview";
import ReviewForm from "./ReviewForm";
import Training from "./Training";
import Goals from "./Goals";

const ManagerDashboard = () => {
  const [activeView, setActiveView] = useState("overview");

  const renderComponent = () => {
    switch (activeView) {
      case "overview":
        return <ManagerOverview />;
      case "review":
        return <ReviewForm />;
      case "goals":
        return <Goals />;
      case "training":
        return <Training />;  
      default:
        return <ManagerOverview />;
    }
  };

  return (
    <Box sx={{ display: "flex", overflow: "hidden", height: "100vh" }}>
      <ManagerSidebar setActiveView={setActiveView} />

      <Box sx={{ flexGrow: 1 }}>
        {/* Navbar with fixed positioning */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 240,
            right: 0,
            height: 64,
            bgcolor: "#003366",
            zIndex: 1200,
          }}
        >
          <ManagerNavbar />
        </Box>

        {/* Dynamic component content */}
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

export default ManagerDashboard;

