import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Stack,
} from '@mui/material';
import API from '../../api/Axios';

const Goals = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [goalsData, setGoalsData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    targetDate: '',
    priority: 'medium',
  });

  // Fetch appraisals on component mount
  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const response = await API.get('/manager/getappraisal');
        setAppraisals(response.data.appraisals);
      } catch (error) {
        console.error('Error fetching appraisals:', error);
      }
    };

    fetchAppraisals();
  }, []);

  // Fetch goals for each employee
  useEffect(() => {
    const fetchGoals = async () => {
      const newGoalsData = {};
      for (const appraisal of appraisals) {
        const employeeId = appraisal.employee._id;
        try {
          const response = await API.get(`/manager/fetchgoals/${employeeId}`);
          newGoalsData[employeeId] = response.data.goals;
        } catch (error) {
          console.error(`Error fetching goals for employee ${employeeId}:`, error);
          newGoalsData[employeeId] = [];
        }
      }
      setGoalsData(newGoalsData);
    };

    if (appraisals.length > 0) {
      fetchGoals();
    }
  }, [appraisals]);

  const handleOpenDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee(null);
    setGoalForm({
      title: '',
      description: '',
      targetDate: '',
      priority: 'medium',
    });
  };

  const handleAssignGoal = async () => {
    if (!selectedEmployee) return;
    try {
      await API.post(`/manager/assigngoal/${selectedEmployee._id}`, goalForm);
      // Refresh goals for the selected employee
      const response = await API.get(`/manager/fetchgoals/${selectedEmployee._id}`);
      setGoalsData((prev) => ({
        ...prev,
        [selectedEmployee._id]: response.data.goals,
      }));
      handleCloseDialog();
    } catch (error) {
      console.error('Error assigning goal:', error);
    }
  };

  const handleRemoveGoal = async (employeeId, goalId) => {
    try {
      await API.delete(`/manager/goals/${goalId}`);
      // Refresh goals for the employee
      const response = await API.get(`/manager/fetchgoals/${employeeId}`);
      setGoalsData((prev) => ({
        ...prev,
        [employeeId]: response.data.goals,
      }));
    } catch (error) {
      console.error('Error removing goal:', error);
    }
  };

  const uniqueAppraisals = [
    ...new Map(appraisals.map((item) => [item.employee._id, item])).values(),
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Employee Goals
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'flex-start',
        }}
      >
        {uniqueAppraisals.map((appraisal) => {
          const employee = appraisal.employee;
          const goals = goalsData[employee._id] || [];
          return (
            <Box
              key={employee._id}
              sx={{
                flex: '1 1 30%',
                minWidth: 300,
                maxWidth: 400,
                display: 'flex',
              }}
            >
              <Card
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  minHeight: 360,
                  width: '100%',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {employee.firstname} {employee.lastname}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {employee.email}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1">Assigned Goals:</Typography>
                    <Box sx={{ minHeight: 150, mt: 1 }}>
                      {goals.length > 0 ? (
                        <Stack spacing={1}>
                          {goals.map((goal) => (
                            <Box
                              key={goal._id}
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                padding: 1,
                              }}
                            >
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{goal.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {goal.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                  <Chip label={goal.priority} size="small" />
                                  <Chip
                                    label={goal.status?.replace("_", " ") || "not_started"}
                                    size="small"
                                    color={
                                      goal.status === "completed" ? "success" :
                                        goal.status === "in_progress" ? "primary" :
                                          goal.status === "deferred" ? "error" :
                                            "default"
                                    }
                                  />
                                </Box>
                              </Box>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleRemoveGoal(employee._id, goal._id)}
                              >
                                Remove
                              </Button>
                            </Box>
                          ))}
                        </Stack>
                      ) : (
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            No goals assigned.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleOpenDialog(employee)}
                    disabled={goals.length > 0}
                  >
                    Assign Goal
                  </Button>
                </CardActions>
              </Card>
            </Box>
          );
        })}
      </Box>

      {/* Assign Goal Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Assign Goal</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={goalForm.title}
            onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={goalForm.description}
            onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Target Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={goalForm.targetDate}
            onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Priority"
            fullWidth
            select
            SelectProps={{ native: true }}
            value={goalForm.priority}
            onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleAssignGoal} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Goals;
