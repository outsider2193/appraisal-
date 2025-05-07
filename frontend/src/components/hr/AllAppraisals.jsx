import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import API from "../../api/Axios";
const AllAppraisals = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [appraisals, setAppraisals] = useState([]);

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch employees, managers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, mgrRes, appRes] = await Promise.all([
          API.get("/hr/fetchemployees"),
          API.get("/hr/fetchmanagers"),
          API.get("/hr/fetchallappraisals"),
        ]);
        console.log(empRes?.data.employees);
        console.log(appRes?.data.appraisals);
        
        setEmployees(empRes.data.employees);
        setManagers(mgrRes.data.managers);
        console.log(mgrRes?.data.employees);
        setAppraisals(appRes.data.appraisals);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const handleFilter = async () => {
    try {
      const params = {};
      if (selectedEmployee) params.employeeId = selectedEmployee;
      if (selectedManager) params.managerId = selectedManager;
      if (selectedStatus) params.status = selectedStatus;

      const res = await API.get("/hr/filter", { params });
      setAppraisals(res.data.appraisals);
    } catch (err) {
      console.error("Error filtering appraisals", err);
    }
  };

  const resetFilters = async () => {
    setSelectedEmployee("");
    setSelectedManager("");
    setSelectedStatus("");
    try {
      const res = await API.get("/hr/fetchallappraisals");
      setAppraisals(res.data.appraisals);
    } catch (err) {
      console.error("Error fetching all appraisals", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>All Appraisals</Typography>

      {/* Filter Section */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Employee</InputLabel>
          <Select
            value={selectedEmployee}
            label="Employee"
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Manager</InputLabel>
          <Select
            value={selectedManager}
            label="Manager"
            onChange={(e) => setSelectedManager(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {managers.map((mgr) => (
              <MenuItem key={mgr._id} value={mgr._id}>
                {mgr.firstName} {mgr.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="self_review_completed">Self Review Done</MenuItem>
            <MenuItem value="manager_review_completed">Manager Review Done</MenuItem>
            <MenuItem value="hr_review_completed">HR Review Done</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleFilter}>
          Filter
        </Button>
        <Button variant="outlined" color="secondary" onClick={resetFilters}>
          Show All
        </Button>
      </Box>

      {/* Appraisal Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Appraisal Cycle</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appraisals.map((a) => (
              <TableRow key={a._id}>
                <TableCell>
                  {a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : "Not available"}
                </TableCell>
                <TableCell>
                  {a.manager ? `${a.manager.firstName} ${a.manager.lastName}` : "Not available"}
                </TableCell>
                <TableCell>{a.appraisalCycle ?? "Not available"}</TableCell>
                <TableCell>{a.startDate ? new Date(a.startDate).toLocaleDateString() : "Not available"}</TableCell>
                <TableCell>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "Not available"}</TableCell>
                <TableCell>{a.status ?? "Not available"}</TableCell>
              </TableRow>
            ))}
            {appraisals.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appraisals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllAppraisals;
