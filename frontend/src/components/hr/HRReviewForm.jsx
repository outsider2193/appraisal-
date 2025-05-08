import React, { useState, useEffect } from "react";
import API from "../../api/Axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Box,
  Paper,
  Divider,
  Grid,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WorkIcon from '@mui/icons-material/Work';
import RateReviewIcon from '@mui/icons-material/RateReview';

const HRReviewForm = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [selectedAppraisalId, setSelectedAppraisalId] = useState(null);
  const [managerReview, setManagerReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [finalRating, setFinalRating] = useState('');
  const [salaryIncreasePercentage, setSalaryIncreasePercentage] = useState('');
  const [promotionRecommendation, setPromotionRecommendation] = useState(false);
  const [comments, setComments] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('');

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch all appraisals for HR
  useEffect(() => {
    const fetchAppraisals = async () => {
      try {
        const res = await API.get("/hr/fetchallappraisals");
        setAppraisals(res.data.appraisals);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setErrorMessage(err?.response?.data?.message || "Error fetching appraisals");
      }
    };

    fetchAppraisals();
  }, []);

  // Fetch manager review based on selected appraisalId
  useEffect(() => {
    if (selectedAppraisalId) {
      const fetchManagerReview = async () => {
        try {
          const res = await API.get(`/hr/getreview/${selectedAppraisalId}`);
          setManagerReview(res.data.managerReview);
        } catch (err) {
          setManagerReview(null);
          setErrorMessage(err?.response?.data?.message || "Error fetching manager review");
        }
      };

      fetchManagerReview();
    }
  }, [selectedAppraisalId]);

  const handleAppraisalSelection = (e) => {
    setSelectedAppraisalId(e.target.value);
    setManagerReview(null);
    setErrorMessage("");
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "finalRating":
        setFinalRating(value);
        break;
      case "salaryIncreasePercentage":
        setSalaryIncreasePercentage(value);
        break;
      case "promotionRecommendation":
        setPromotionRecommendation(value === "true");
        break;
      case "comments":
        setComments(value);
        break;
      case "additionalRemarks":
        setAdditionalRemarks(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(`/hr/finalreview/${selectedAppraisalId}`, {
        finalRating,
        salaryIncreasePercentage,
        promotionRecommendation,
        comments,
        additionalRemarks
      });
      console.log(res.data);
      alert("Review updated successfully");
      setOpenDialog(false);
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Error submitting review");
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Without AppBar */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        mb: 3,
        backgroundColor: '#1976d2',
        color: 'white'
      }}>
        <AssessmentIcon sx={{ mr: 2, fontSize: 30 }} />
        <Typography variant="h5" component="div">
          HR Performance Appraisal System
        </Typography>
      </Box>

      <Container maxWidth="md" sx={{ pl: { xs: 2, md: 0 } }}>
        <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', ml: { xs: 0, md: -4 } }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Employee Performance Review
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" paragraph>
            Complete the final review process for employee performance appraisals
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Appraisal Selection Card */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <PersonIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                <Typography variant="h6">Select an Employee Appraisal</Typography>
              </Box>

              {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress />
                </Box>
              ) : errorMessage ? (
                <Typography color="error">{errorMessage}</Typography>
              ) : (
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel>Employee Appraisal</InputLabel>
                  <Select
                    value={selectedAppraisalId || ""}
                    onChange={handleAppraisalSelection}
                    label="Employee Appraisal"
                  >
                    <MenuItem value="">Select an Employee</MenuItem>
                    {appraisals.map((appraisal) => (
                      <MenuItem key={appraisal._id} value={appraisal._id}>
                        {appraisal.employee.firstName} {appraisal.employee.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>

          {/* If an appraisal is selected, show the manager review details or error message */}
          {selectedAppraisalId && (
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                {managerReview ? (
                  <>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                      <RateReviewIcon color="primary" sx={{ fontSize: 30, mr: 1 }} />
                      <Typography variant="h6">Manager Evaluation Details</Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            <strong>Manager Feedback</strong>
                          </Typography>
                          <Typography variant="body1">{managerReview.feedback || "Not available"}</Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            <strong>Strengths</strong>
                          </Typography>
                          <Typography variant="body1">{managerReview.strengths || "Not available"}</Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5'}}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            <strong>Areas of Improvement</strong>
                          </Typography>
                          <Typography variant="body1">{managerReview.areasOfImprovement || "Not available"}</Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5'}}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            <strong>Training Recommendations</strong>
                          </Typography>
                          <Typography variant="body1">{managerReview.trainingRecommendations || "Not available"}</Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            <strong>Overall Rating</strong>
                          </Typography>
                          <Typography variant="body1">{managerReview.overallRating || "Not available"}</Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper elevation={1} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            <strong>Additional Comments</strong>
                          </Typography>
                          <Typography variant="body1">{managerReview.comments || "Not available"}</Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Box display="flex" justifyContent="center" mt={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleDialogOpen}
                        startIcon={<WorkIcon />}
                      >
                        Finalize HR Review
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="error" gutterBottom>
                      {errorMessage || "No manager review found for this employee"}
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                      The selected employee does not have a manager review yet. Please select another employee or check back later.
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedAppraisalId(null);
                        setManagerReview(null);
                        setErrorMessage("");
                      }}
                      startIcon={<PersonIcon />}
                      sx={{ mt: 2 }}
                    >
                      Select Different Employee
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dialog for updating final review */}
          <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
              HR Final Review
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Final Rating (1-5)"
                    type="number"
                    fullWidth
                    margin="normal"
                    name="finalRating"
                    value={finalRating}
                    onChange={handleInputChange}
                    inputProps={{ min: 1, max: 5 }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Salary Increase Percentage (%)"
                    type="number"
                    fullWidth
                    margin="normal"
                    name="salaryIncreasePercentage"
                    value={salaryIncreasePercentage}
                    onChange={handleInputChange}
                    variant="outlined"
                    InputProps={{ endAdornment: '%' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel>Promotion Recommendation</InputLabel>
                    <Select
                      name="promotionRecommendation"
                      value={promotionRecommendation ? "true" : "false"}
                      onChange={handleInputChange}
                      label="Promotion Recommendation"
                    >
                      <MenuItem value="false">No</MenuItem>
                      <MenuItem value="true">Yes</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="HR Comments"
                    fullWidth
                    margin="normal"
                    name="comments"
                    value={comments}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Add your comments regarding the employee's performance..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Additional Remarks (Internal HR Notes)"
                    fullWidth
                    margin="normal"
                    name="additionalRemarks"
                    value={additionalRemarks}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Add any internal notes or follow-up actions..."
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={handleDialogClose} color="inherit" variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary" variant="contained">
                Submit Final Review
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Container>
    </Box>
  );
};

export default HRReviewForm;