import React, { useEffect, useState } from 'react';
import axios from '../../api/Axios';
import {
  Card, CardContent, Typography, Grid, MenuItem,
  TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';
import { toast } from 'react-toastify';

const YourTraining = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noTrainings, setNoTrainings] = useState(false);
  const [updates, setUpdates] = useState({});

  const fetchTrainings = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/employee/fetchtraining');
      const assignedTrainings = res.data.trainings.filter(t => t.status !== 'completed');
      setTrainings(assignedTrainings);
      setNoTrainings(assignedTrainings.length === 0);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === "No training assigned") {
        setNoTrainings(true);
      } else {
        toast.error(err.response?.data?.message || 'Error fetching trainings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (trainingId, field, value) => {
    setUpdates(prev => ({
      ...prev,
      [trainingId]: {
        ...prev[trainingId],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (trainingId) => {
    const data = updates[trainingId];
    if (!data) return;

    try {
      await axios.put(`/employee/updatetraining/${trainingId}`, data);
      toast.success("Training updated successfully");
      fetchTrainings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update training");
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Your Assigned Trainings</Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && noTrainings && (
        <Box my={4}>
          <Alert severity="info" variant="outlined">
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              No trainings have been assigned to you yet.
            </Typography>
          </Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        {!noTrainings && trainings.map(training => (
          <Grid item xs={12} md={6} key={training._id}>
            <Card elevation={4} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">{training.title}</Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>{training.description}</Typography>

                <Typography><strong>Type:</strong> {training.type}</Typography>
                <Typography><strong>Start:</strong> {new Date(training.startDate).toLocaleDateString()}</Typography>
                <Typography><strong>Completion:</strong> {training.completionDate ? new Date(training.completionDate).toLocaleDateString() : "N/A"}</Typography>
                <Typography><strong>Status:</strong> {training.status}</Typography>
                {training.outcomes && (
                  <Typography mt={1}><strong>Outcomes:</strong> {training.outcomes}</Typography>
                )}

                <Box mt={2}>
                  <TextField
                    select
                    label="Update Status"
                    value={updates[training._id]?.status || ''}
                    onChange={(e) => handleChange(training._id, 'status', e.target.value)}
                    fullWidth
                    size="small"
                    sx={{ mb: 2 }}
                  >
                    {["planned", "in_progress", "completed"].map(status => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleUpdate(training._id)}
                  >
                    Update Training
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YourTraining;
