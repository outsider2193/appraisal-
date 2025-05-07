import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
// import CreateAppraisalForm from "./CreateAppraisalForm";
// import AppraisalTable from "./AppraisalTable";
// import FilterAppraisals from "./FilterAppraisals";
import API from "../../api/Axios";
import HrSidebar from "./HrSidebar";

const HrDashboard = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const fetchAllData = async () => {
    const [empRes, mgrRes, apprRes] = await Promise.all([
      API.get("/hr/fetchemployees"),
      API.get("/hr/fetchmanagers"),
      API.get("/hr/fetchallappraisals"),
    ]);
    console.log(empRes.data.employees);
    console.log(mgrRes.data.managers);
    console.log(apprRes.data.appraisals);
    setEmployees(empRes.data.employees);
    setManagers(mgrRes.data.managers);
    setAppraisals(apprRes.data.appraisals);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <>
    <HrSidebar/>
     {/* <Container>
       <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
         HR Dashboard
       </Typography>
       <Grid container spacing={3}>
         <Grid item xs={12} md={6}>
           <CreateAppraisalForm employees={employees} managers={managers} refreshAppraisals={fetchAllData} />
         </Grid>
         <Grid item xs={12} md={6}>
           <FilterAppraisals setAppraisals={setAppraisals} employees={employees} managers={managers} />
         </Grid>
         <Grid item xs={12}>
           <AppraisalTable appraisals={appraisals} />
         </Grid>
       </Grid>
     </Container> */}
    </>
  );
};

export default HrDashboard;

