import React, { useEffect, useState } from "react";
import API from "../../api/Axios";
import HrSidebar from "./HrSidebar";
import HrNavbar from "./HrNavbar";
import { Box } from "@mui/material";

import Overview from "./Overview";
import CreateAppraisal from "./CreateAppraisal";
import Employees from "./Employees";
import Managers from "./Managers";
import AllAppraisals from "./AllAppraisals";
import HRReviewForm from "./HRReviewForm";

const HrDashboard = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [activeView, setActiveView] = useState("overview");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [empRes, mgrRes, apprRes] = await Promise.all([
          API.get("/hr/fetchemployees"),
          API.get("/hr/fetchmanagers"),
          API.get("/hr/fetchallappraisals"),
        ]);
        setEmployees(empRes.data.employees);
        setManagers(mgrRes.data.managers);
        setAppraisals(apprRes.data.appraisals);
      } catch (error) {
        console.error("Error fetching HR data:", error);
      }
    };
    fetchAllData();
  }, []);

  const renderComponent = () => {
    switch (activeView) {
      case "overview":
        return <Overview />;
      case "create":
        return <CreateAppraisal />;
      case "employees":
        return <Employees />;
      case "managers":
        return <Managers />;
      case "all":
        return <AllAppraisals />;
      case "review":
        return <HRReviewForm />;
      default:
        return <Overview />;
    }
  };

  return (
    <Box sx={{ display: "flex", overflow: "hidden", height: "100vh" }}>
  {/* Sidebar stays fixed at 240px */}
  <HrSidebar setActiveView={setActiveView} />

  {/* Main content container */}
  <Box sx={{ flexGrow: 1 }}>
    {/* Navbar with fixed positioning */}
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 240, // EXACTLY aligns with sidebar
        right: 0,
        height: 64,
        bgcolor: "#003366",
        zIndex: 1200,
      }}
    >
      <HrNavbar />
    </Box>

    {/* Dynamic component content */}
    <Box
      sx={{
        mt: "64px", // same as navbar height
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

export default HrDashboard;
