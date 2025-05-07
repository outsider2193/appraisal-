import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import API from "../../api/Axios";

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchManagers = async () => {
    try {
      const response = await API.get("/hr/fetchmanagers");
      setManagers(response.data.managers);
    } catch (error) {
      console.error("Error fetching managers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "department", headerName: "Department", flex: 1 },
  ];

  const rows = managers.map((mgr, index) => ({
    id: index + 1,
    ...mgr,
  }));

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }} color="primary">
        List of Managers
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          sx={{ bgcolor: "#fff", borderRadius: 2 }}
        />
      )}
    </Box>
  );
};

export default Managers;

