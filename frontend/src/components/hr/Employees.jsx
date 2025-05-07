import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../api/Axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/hr/fetchemployees");
      setEmployees(response.data.employees);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columns = [
    { field: "id", headerName: "#", width: 90 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
  ];

  const rows = employees.map((emp, index) => ({
    id: index + 1,
    ...emp,
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }} color="primary">
        Employee Directory
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableRowSelectionOnClick
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
          }}
        />
      )}
    </Box>
  );
};

export default Employees;
