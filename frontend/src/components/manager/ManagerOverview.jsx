import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "../../api/Axios";

const ManagerOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const COLORS = [theme.palette.primary.main, "#f44336"];

  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const res = await axios.get("/manager/getappraisal");
        setData(res.data.appraisals || []);
      } catch (err) {
        console.error("Failed to fetch appraisals", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppraisals();
  }, []);

  const getPieData = (goals) => {
    const completed = goals.filter((g) => g.status === "completed").length;
    const notCompleted = goals.length - completed;
    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: notCompleted },
    ];
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom color="primary">
        Manager Overview
      </Typography>
      <Grid container spacing={3}>
        {data.map((appraisal, idx) => {
          const employee = appraisal.employee;
          const goals = appraisal.employeeGoals || [];
          const trainings = appraisal.employeeTrainings || [];

          return (
            <Grid item xs={12} md={6} key={idx}>
              <Card sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" color="primary.main">
                    {employee.firstName} {employee.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {employee.email}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1">Goals Assigned: {goals.length}</Typography>
                  <List dense>
                    {goals.map((goal, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemText
                          primary={goal.title}
                          secondary={`Status: ${goal.status}`}
                        />
                        <Chip label={goal.status} size="small" color={goal.status === "completed" ? "success" : "warning"} />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1">Trainings Assigned: {trainings.length}</Typography>
                  <List dense>
                    {trainings.map((training, i) => (
                      <ListItem key={i} disablePadding>
                        <ListItemText
                          primary={training.title}
                          secondary={`Status: ${training.status}`}
                        />
                        <Chip label={training.status} size="small" color={training.status === "completed" ? "success" : "info"} />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" gutterBottom>
                    Goal Completion Chart
                  </Typography>
                  <PieChart width={300} height={200}>
                    <Pie
                      data={getPieData(goals)}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label
                    >
                      {getPieData(goals).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ManagerOverview;

