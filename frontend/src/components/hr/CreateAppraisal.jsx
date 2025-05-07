import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
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

  // Fetch employees and managers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [empRes, mgrRes] = await Promise.all([
          axios.get("/hr/fetchemployees"),
          axios.get("/hr/fetchmanagers"),
        ]);
        setEmployees(empRes.data.employees || []);
        setManagers(mgrRes.data.managers || []);
      } catch (err) {
        setErrorMsg("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    try {
      const { employeeId, managerId, appraisalCycle, startDate, dueDate } = formData;

      if (!employeeId || !managerId || !startDate || !dueDate) {
        setErrorMsg("Please fill all required fields");
        setLoading(false);
        return;
      }

      const res = await axios.post("/hr/createappraisal", {
        employeeId,
        managerId,
        appraisalCycle,
        startDate,
        dueDate,
      });

      setSuccessMsg(res.data.message);
      setFormData({
        employeeId: "",
        managerId: "",
        appraisalCycle: "annual",
        startDate: null,
        dueDate: null,
      });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to create appraisal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", mt: 4 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={600} mb={3} color="primary">
          Create New Appraisal
        </Typography>

        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="employeeId"
                label="Select Employee"
                fullWidth
                value={formData.employeeId}
                onChange={handleChange}
                required
              >
                {employees.map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName} ({emp.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="managerId"
                label="Select Manager"
                fullWidth
                value={formData.managerId}
                onChange={handleChange}
                required
              >
                {managers.map((mgr) => (
                  <MenuItem key={mgr._id} value={mgr._id}>
                    {mgr.firstName} {mgr.lastName} ({mgr.email})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                name="appraisalCycle"
                label="Appraisal Cycle"
                fullWidth
                value={formData.appraisalCycle}
                onChange={handleChange}
              >
                <MenuItem value="annual">Annual</MenuItem>
                <MenuItem value="probation">Probation</MenuItem>
                <MenuItem value="special">Special</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: date ? dayjs(date).toISOString() : null,
                  }))
                }
                renderInput={(params) => <TextField fullWidth required {...params} />}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: date ? dayjs(date).toISOString() : null,
                  }))
                }
                renderInput={(params) => <TextField fullWidth required {...params} />}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Create Appraisal"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAppraisal;

