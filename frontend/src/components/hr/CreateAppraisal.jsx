import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../../api/Axios";
import dayjs from "dayjs";

const CreateAppraisal = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    employeeId: "",
    managerId: "",
    appraisalCycle: "annual",
    startDate: null,
    dueDate: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, mgrRes] = await Promise.all([
          axios.get("/hr/fetchemployees"),
          axios.get("/hr/fetchmanagers"),
        ]);
        setEmployees(empRes.data.employees);
        setManagers(mgrRes.data.managers);
      } catch (err) {
        console.error("Error fetching data:", err);
        setErrorMsg("Failed to fetch employees or managers.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate?.toISOString(),
        dueDate: formData.dueDate?.toISOString(),
      };
      const res = await axios.post("/hr/createappraisal", payload);
      setSuccessMsg("Appraisal created successfully.");
      setFormData({
        employeeId: "",
        managerId: "",
        appraisalCycle: "annual",
        startDate: null,
        dueDate: null,
      });
    } catch (err) {
      console.error("Error creating appraisal:", err);
      setErrorMsg(err.response?.data?.message || "Failed to create appraisal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box p={3} maxWidth="700px" mx="auto">
        <Typography variant="h4" fontWeight={600} color="primary" gutterBottom>
          Create Appraisal
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              select
              fullWidth
              required
              label="Select Employee"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {employees.map((emp) => (
                <MenuItem key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName} ({emp.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              required
              label="Select Manager"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {managers.map((mgr) => (
                <MenuItem key={mgr._id} value={mgr._id}>
                  {mgr.firstName} {mgr.lastName} ({mgr.email})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Appraisal Cycle"
              name="appraisalCycle"
              value={formData.appraisalCycle}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="annual">Annual</MenuItem>
              <MenuItem value="probation">Probation</MenuItem>
              <MenuItem value="special">Special</MenuItem>
            </TextField>

            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => handleDateChange("startDate", date)}
              renderInput={(params) => (
                <TextField fullWidth required {...params} sx={{ mb: 2 }} />
              )}
            />

            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(date) => handleDateChange("dueDate", date)}
              renderInput={(params) => (
                <TextField fullWidth required {...params} sx={{ mb: 3 }} />
              )}
            />

            {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
            {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Create Appraisal"}
            </Button>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default CreateAppraisal;
