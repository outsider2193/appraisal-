import React, { useEffect, useState } from 'react';
import axios from '../../api/Axios';
import {
  Card, CardContent, Typography, Grid, MenuItem,
  TextField, Button, Box, CircularProgress, Alert
} from '@mui/material';
import { toast } from 'react-toastify';

const YourGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noGoals, setNoGoals] = useState(false);
  const [updates, setUpdates] = useState({});

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/employee/fetchgoals');
      setGoals(res.data.goals);
      setNoGoals(false);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === "No goal assigned") {
        setNoGoals(true);
      } else {
        toast.error(err.response?.data?.message || 'Error fetching goals');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (goalId, field, value) => {
    setUpdates(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [field]: value
      }
    }));
  };

  const handleUpdate = async (goalId) => {
    const data = updates[goalId];
    if (!data) return;

    try {
      await axios.put(`/employee/updategoal/${goalId}`, data);
      toast.success("Goal updated successfully");
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update goal");
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);
  const filteredGoals = goals.filter(goal => goal.status !== 'completed');
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom fontWeight="bold">Your Assigned Goals</Typography>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={3}>
          {filteredGoals.length > 0 ? (
            filteredGoals.map(goal => (
              <Grid item xs={12} md={6} key={goal._id}>
                <Card elevation={4} sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">{goal.title}</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>{goal.description}</Typography>

                    <Typography><strong>Start:</strong> {new Date(goal.startDate).toLocaleDateString()}</Typography>
                    <Typography><strong>Target:</strong> {new Date(goal.targetDate).toLocaleDateString()}</Typography>
                    <Typography><strong>Priority:</strong> {goal.priority}</Typography>
                    <Typography><strong>Status:</strong> {goal.status}</Typography>
                    <Typography><strong>Progress:</strong> {goal.progress}%</Typography>

                    {goal.managerFeedback && (
                      <Typography mt={1} color="success.main"><strong>Manager Feedback:</strong> {goal.managerFeedback}</Typography>
                    )}

                    <Box mt={2}>
                      <TextField
                        select
                        label="Update Status"
                        value={updates[goal._id]?.status || ''}
                        onChange={(e) => handleChange(goal._id, 'status', e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                      >
                        {["not_started", "in_progress", "completed", "deferred"].map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        label="Progress (%)"
                        type="number"
                        inputProps={{ min: 0, max: 100 }}
                        value={updates[goal._id]?.progress || ''}
                        onChange={(e) => handleChange(goal._id, 'progress', Number(e.target.value))}
                        fullWidth
                        size="small"
                        sx={{ mb: 2 }}
                      />

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleUpdate(goal._id)}
                      >
                        Update Goal
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box my={4}>
              <Alert severity="info" variant="outlined">
                <Typography variant="h6" fontWeight="bold" color="text.primary">
                  {noGoals ? "No goals have been assigned to you yet." : "All goals have been completed!"}
                </Typography>
              </Alert>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default YourGoals;
