import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Box,
  LinearProgress,
  useTheme,
  Divider,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axios from "../../api/Axios";

const COLORS = ["#1976d2", "#4caf50", "#ff9800", "#f44336"];

const Overview = () => {
  const [appraisals, setAppraisals] = useState({ pending: 0, completed: 0 });
  const [goals, setGoals] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [recognitions, setRecognitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, completedRes, goalsRes, trainingsRes, recognitionRes] =
          await Promise.all([
            axios.get("/employee/getappraisals"),
            axios.get("/employee/history"),
            axios.get("/employee/fetchgoals"),
            axios.get("/employee/fetchtraining"),
            axios.get("/employee/fetchrecognition"),
          ]);

        setAppraisals({
          pending: pendingRes.data.length,
          completed: completedRes.data.length,
        });

        setGoals(goalsRes.data.goals);
        setTrainings(trainingsRes.data.trainings);
        setRecognitions(recognitionRes.data.recognitions);
      } catch (err) {
        console.error("Error loading employee overview data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getGoalStatusCounts = () => {
    const counts = {
      not_started: 0,
      in_progress: 0,
      completed: 0,
      deferred: 0,
    };
    goals.forEach((goal) => counts[goal.status]++);
    return counts;
  };

  const getTrainingStatusCounts = () => {
    const counts = {
      planned: 0,
      in_progress: 0,
      completed: 0,
    };
    trainings.forEach((training) => counts[training.status]++);
    return counts;
  };

  const averageProgress =
    goals.length > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
      : 0;

  const goalStatus = getGoalStatusCounts();
  const trainingStatus = getTrainingStatusCounts();

  const trainingChartData = [
    { name: "Planned", value: trainingStatus.planned },
    { name: "In Progress", value: trainingStatus.in_progress },
    { name: "Completed", value: trainingStatus.completed },
  ];

  if (loading) return <CircularProgress sx={{ color: "primary.main" }} />;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
        Employee Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Training Status Overview with Pie */}
        <Grid item xs={12} md={6}>
          <Card sx={{ mt: 2, borderTop: `5px solid ${theme.palette.primary.main}`, height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Training Status Overview</Typography>
              <Divider sx={{ my: 1 }} />
              {trainingChartData.length ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: 300,
                    mt: 3,
                    overflow: "hidden", // Prevent overflow
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={trainingChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                      >
                        {trainingChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography variant="body2">No training data available.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Appraisal Summary */}
        <Grid item xs={12} md={4} mt={6}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Appraisals</Typography>
              <Typography>Total: {appraisals.pending + appraisals.completed}</Typography>
              <Chip
                label={`Pending: ${appraisals.pending}`}
                color="warning"
                sx={{ mr: 1, mt: 1 }}
              />
              <Chip
                label={`Completed: ${appraisals.completed}`}
                color="success"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Goal Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardContent>
              <Typography variant="h6">Goals</Typography>
              <Typography>Total: {goals.length}</Typography>
              <Typography sx={{ mt: 1 }}>Avg Progress</Typography>
              <LinearProgress
                variant="determinate"
                value={averageProgress}
                sx={{ height: 10, borderRadius: 5, mt: 1 }}
                color="primary"
              />
              <Box mt={2}>
                {Object.entries(goalStatus).map(([key, val]) => (
                  <Chip key={key} label={`${key}: ${val}`} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recognitions */}
        <Grid item xs={12} md={6}>
          <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recent Recognitions
              </Typography>
              {recognitions.length === 0 ? (
                <Typography>No recognitions yet.</Typography>
              ) : (
                recognitions.slice(0, 3).map((rec, i) => (
                  <Box key={i} mb={1}>
                    <Typography>
                      ✨ {rec.title} - {new Date(rec.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
