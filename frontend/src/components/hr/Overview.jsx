import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Group,
  ManageAccounts,
  AssignmentLate,
  RateReview,
  CheckCircle,
} from "@mui/icons-material";
import axios from "../../api/Axios";
import { useTheme } from "@mui/material/styles";

// ⬇️ New imports for the chart
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Overview = () => {
  const [stats, setStats] = useState({
    employees: 0,
    managers: 0,
    totalAppraisals: 0,
    hrReviewPending: 0,
    hrReviewSubmitted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState([]); // ⬅️ New state for pie chart
  const theme = useTheme();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, manRes, appRes] = await Promise.all([
          axios.get("/hr/fetchemployees"),
          axios.get("/hr/fetchmanagers"),
          axios.get("/hr/fetchallappraisals"),
        ]);

        const appraisals = appRes.data.appraisals;
        const totalAppraisals = appraisals.length;
        const hrReviewPending = appraisals.filter((a) => !a.hrReview).length;
        const hrReviewSubmitted = totalAppraisals - hrReviewPending;

        setStats({
          employees: empRes.data.employees.length,
          managers: manRes.data.managers.length,
          totalAppraisals,
          hrReviewPending,
          hrReviewSubmitted,
        });

        // ⬇️ Calculate status distribution
        const statusCount = appraisals.reduce((acc, curr) => {
          const status = curr.status;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(statusCount).map(([status, count]) => ({
          name: status.replace(/_/g, " ").toUpperCase(),
          value: count,
          status,
        }));

        setStatusData(chartData);
      } catch (err) {
        console.error("Error fetching overview stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const STATUS_COLORS = {
    pending: "#FFB74D",
    self_review_completed: "#4FC3F7",
    manager_review_completed: "#9575CD",
    hr_review_completed: "#81C784",
    completed: theme.palette.primary.main,
  };

  const cardData = [
    {
      title: "Total Employees",
      count: stats.employees,
      icon: <Group sx={{ color: theme.palette.primary.main }} fontSize="large" />,
    },
    {
      title: "Total Managers",
      count: stats.managers,
      icon: <ManageAccounts sx={{ color: theme.palette.primary.main }} fontSize="large" />,
    },
    {
      title: "Pending Appraisals",
      count: stats.totalAppraisals,
      icon: <AssignmentLate sx={{ color: theme.palette.primary.main }} fontSize="large" />,
    },
    {
      title: "HR Review Pending",
      count: stats.hrReviewPending,
      icon: <RateReview sx={{ color: theme.palette.primary.main }} fontSize="large" />,
    },
    {
      title: "HR Review Submitted",
      count: stats.hrReviewSubmitted,
      icon: <CheckCircle sx={{ color: theme.palette.primary.main }} fontSize="large" />,
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} color="primary" fontWeight={600}>
        HR Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={4}
              sx={{ borderLeft: `5px solid ${theme.palette.primary.main}`, borderRadius: 2 }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {card.count}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ⬇️ Pie Chart */}
      <Box mt={5}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h6" mb={2} fontWeight={600}>
              Appraisal Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#ccc"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Overview;
