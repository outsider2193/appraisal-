import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Rating,

} from "@mui/material";
import axios from "../../api/Axios";
import { toast } from "react-toastify";

const SelfAssessment = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppraisalId, setSelectedAppraisalId] = useState(null);
  const [form, setForm] = useState({
    achievements: "",
    challenges: "",
    goalsCompleted: "",
    futurePlans: "",
    trainingNeeds: "",
    comments: "",
    ratings: {
      productivity: 3,
      quality: 3,
      teamwork: 3,
      communication: 3,
      initiative: 3
    }
  });

  const fetchAppraisals = async () => {
    try {
      const res = await axios.get("/employee/getappraisals");
      setAppraisals(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch appraisals");
    }
  };

  useEffect(() => {
    fetchAppraisals();
  }, []);

  const handleOpenDialog = (id) => {
    setSelectedAppraisalId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppraisalId(null);
    setForm({
      achievements: "",
      challenges: "",
      goalsCompleted: "",
      futurePlans: "",
      trainingNeeds: "",
      comments: "",
      ratings: {
        productivity: 3,
        quality: 3,
        teamwork: 3,
        communication: 3,
        initiative: 3
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    const {
      achievements,
      challenges,
      goalsCompleted,
      futurePlans,
      trainingNeeds
    } = form;

    if (!achievements || !challenges || !goalsCompleted || !futurePlans || !trainingNeeds) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await axios.post(`/employee/submitreview/${selectedAppraisalId}`, form);
      toast.success(res.data.message);
      handleCloseDialog();
      fetchAppraisals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Self Assessment
      </Typography>

      {appraisals.length === 0 ? (
        <Typography>No pending appraisals</Typography>
      ) : (
        <Grid container spacing={2} direction="column">
          {appraisals.map((item) => (
            <Grid item key={item._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">
                    Appraisal ID: {item._id}
                  </Typography>
                  <Typography>Status: {item.status}</Typography>
                  <Typography>
                    Manager: {item.manager?.firstName} ({item.manager?.email})
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => handleOpenDialog(item._id)}
                    disabled={item.status !== "pending"}
                  >
                    {item.status === "pending"
                      ? "Submit Self Assessment"
                      : "Assessment Submitted"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Self Assessment</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                label="Achievements"
                name="achievements"
                fullWidth
                multiline
                value={form.achievements}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Challenges"
                name="challenges"
                fullWidth
                multiline
                value={form.challenges}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Goals Completed"
                name="goalsCompleted"
                fullWidth
                multiline
                value={form.goalsCompleted}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Future Plans"
                name="futurePlans"
                fullWidth
                multiline
                value={form.futurePlans}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Training Needs"
                name="trainingNeeds"
                fullWidth
                multiline
                value={form.trainingNeeds}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Ratings:</Typography>
              {["productivity", "quality", "teamwork", "communication", "initiative"].map((key) => (
                <Box key={key} display="flex" alignItems="center" my={1}>
                  <Typography sx={{ minWidth: 120 }}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Typography>
                  <Rating
                    name={key}
                    value={form.ratings[key]}
                    onChange={(e, val) => handleRatingChange(key, val)}
                  />
                </Box>
              ))}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Additional Comments"
                name="comments"
                fullWidth
                multiline
                value={form.comments}
                onChange={handleChange}
              />
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SelfAssessment;
