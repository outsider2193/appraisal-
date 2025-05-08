
import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Grid, Button, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, List, ListItem, ListItemText, Divider
} from "@mui/material";
import API from "../../api/Axios"; // adjust path as needed

const ReviewForm = () => {
    const [appraisals, setAppraisals] = useState([]);
    const [selectedAppraisal, setSelectedAppraisal] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [reviewData, setReviewData] = useState({
        feedback: "",
        strengths: "",
        areasOfImprovement: "",
        trainingRecommendations: "",
        overallRating: "",
        comments: "",
        ratings: {
            productivity: 3,
            quality: 3,
            teamwork: 3,
            communication: 3,
            initiative: 3
        }
    });

    useEffect(() => {
        fetchAppraisals();
    }, []);

    // Load existing review data if available
    useEffect(() => {
        if (selectedAppraisal && selectedAppraisal.managerReview) {
            const {
                feedback,
                strengths,
                areasOfImprovement,
                trainingRecommendations,
                overallRating,
                comments,
                ratings
            } = selectedAppraisal.managerReview;

            setReviewData({
                feedback: feedback || "",
                strengths: strengths || "",
                areasOfImprovement: areasOfImprovement || "",
                trainingRecommendations: trainingRecommendations || "",
                overallRating: overallRating || "",
                comments: comments || "",
                ratings: ratings || {
                    productivity: 3,
                    quality: 3,
                    teamwork: 3,
                    communication: 3,
                    initiative: 3
                }
            });
        } else {
            // Reset form if no existing review
            setReviewData({
                feedback: "",
                strengths: "",
                areasOfImprovement: "",
                trainingRecommendations: "",
                overallRating: "",
                comments: "",
                ratings: {
                    productivity: 3,
                    quality: 3,
                    teamwork: 3,
                    communication: 3,
                    initiative: 3
                }
            });
        }
    }, [selectedAppraisal]);

    const fetchAppraisals = async () => {
        setIsLoading(true);
        try {
            const res = await API.get("/manager/getappraisal");
            // Log the response to debug
            console.log("API Response:", res.data);

            const withSelfReview = res.data.appraisals.filter(app => app.selfReview);
            setAppraisals(withSelfReview);
            if (withSelfReview.length > 0) {
                setSelectedAppraisal(withSelfReview[0]); // Auto-select first for demo
            }
        } catch (err) {
            console.error("API Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async () => {
        try {
            await API.post(`/manager/submitreview/${selectedAppraisal._id}`, reviewData);
            alert("Manager review submitted!");
            setOpenDialog(false);
            fetchAppraisals(); // Refresh data after submission
        } catch (err) {
            console.error(err);
            alert("Submission failed.");
        }
    };

    const handleSelectAppraisal = (appraisal) => {
        setSelectedAppraisal(appraisal);
    };

    // Helper function to safely get employee name
    const getEmployeeName = (employee) => {
        if (!employee) return "Employee";

        // Check for both capitalization variations (firstName/lastName)
        const firstName = employee.firstName || employee.firstname || "";
        const lastName = employee.lastName || employee.lastname || "";

        if (!firstName && !lastName) return employee.email || "Employee";
        return `${firstName} ${lastName}`.trim();
    };

    // Helper function to map selfReview fields to component expectations
    const getSelfReviewField = (selfReview, field) => {
        if (!selfReview) return "No data provided.";

        // Map fields from your schema to what the component expects
        switch (field) {
            case 'goals':
                return selfReview.goalsCompleted || "No goals provided.";
            case 'achievements':
                return selfReview.achievements || "No achievements provided.";
            case 'challenges':
                return selfReview.challenges || "No challenges provided.";
            case 'futureGoals':
                return selfReview.futurePlans || "No future goals provided.";
            default:
                return "No data provided.";
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                Employee Performance Reviews
            </Typography>

            {isLoading ? (
                <Typography>Loading appraisals...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {/* Left sidebar with employee list */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Employees
                            </Typography>
                            {appraisals.length === 0 ? (
                                <Typography variant="body2" sx={{ py: 2, textAlign: 'center' }}>
                                    No employee reviews available
                                </Typography>
                            ) : (
                                <List>
                                    {appraisals.map((appraisal) => (
                                        <React.Fragment key={appraisal._id}>
                                            <ListItem
                                                button
                                                selected={selectedAppraisal && selectedAppraisal._id === appraisal._id}
                                                onClick={() => handleSelectAppraisal(appraisal)}
                                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                                            >
                                                <ListItemText
                                                    primary={getEmployeeName(appraisal.employee)}
                                                />
                                                {appraisal.needsReview && (
                                                    <Chip
                                                        label="Updated"
                                                        color="warning"
                                                        size="small"
                                                    />
                                                )}
                                            </ListItem>
                                            <Divider />
                                        </React.Fragment>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>

                    {/* Right content area with selected employee's self-assessment */}
                    <Grid item xs={12} md={8}>
                        {selectedAppraisal ? (
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'left' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6">
                                        {getEmployeeName(selectedAppraisal.employee)}
                                    </Typography>

                                    {selectedAppraisal.needsReview && (
                                        <Chip
                                            label="Self-review updated"
                                            color="warning"
                                            sx={{ ml: 2 }}
                                        />
                                    )}
                                </Box>

                                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                    Email: {selectedAppraisal.employee ?
                                        (selectedAppraisal.employee.email || "No email provided") :
                                        "No email provided"}
                                </Typography>

                                {selectedAppraisal.selfReview ? (
                                    <>
                                        <Box mt={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Goals:
                                            </Typography>
                                            <Typography variant="body1">
                                                {getSelfReviewField(selectedAppraisal.selfReview, 'goals')}
                                            </Typography>
                                        </Box>

                                        <Box mt={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Achievements:
                                            </Typography>
                                            <Typography variant="body1">
                                                {getSelfReviewField(selectedAppraisal.selfReview, 'achievements')}
                                            </Typography>
                                        </Box>

                                        <Box mt={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Challenges:
                                            </Typography>
                                            <Typography variant="body1">
                                                {getSelfReviewField(selectedAppraisal.selfReview, 'challenges')}
                                            </Typography>
                                        </Box>

                                        <Box mt={2}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                Future Goals:
                                            </Typography>
                                            <Typography variant="body1">
                                                {getSelfReviewField(selectedAppraisal.selfReview, 'futureGoals')}
                                            </Typography>
                                        </Box>
                                    </>
                                ) : (
                                    <Box mt={2}>
                                        <Typography variant="body1" color="text.secondary">
                                            No self-review data available
                                        </Typography>
                                    </Box>
                                )}

                                <Box mt={4}>
                                    <Button
                                        variant="contained"
                                        color={selectedAppraisal.needsReview ? "warning" : "primary"}
                                        onClick={() => setOpenDialog(true)}
                                    >
                                        {selectedAppraisal.managerReview
                                            ? (selectedAppraisal.needsReview
                                                ? "UPDATE MANAGER REVIEW"
                                                : "EDIT MANAGER REVIEW")
                                            : "SUBMIT MANAGER REVIEW"
                                        }
                                    </Button>

                                    {selectedAppraisal.managerReview && !selectedAppraisal.needsReview && (
                                        <Typography variant="body2" color="success.main" mt={1}>
                                            Manager review submitted on {new Date(selectedAppraisal.managerReview.submittedAt).toLocaleDateString()}
                                        </Typography>
                                    )}

                                    {selectedAppraisal.needsReview && (
                                        <Typography variant="body2" color="warning.main" mt={1}>
                                            Self-review has been updated since your last review
                                        </Typography>
                                    )}
                                </Box>
                            </Paper>
                        ) : (
                            <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                                <Typography variant="body1">
                                    Select an employee to view their self-assessment
                                </Typography>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            )}

            {/* Dialog for Manager Review Submission */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>
                    {selectedAppraisal && selectedAppraisal.managerReview ? "Update Manager Review" : "Submit Manager Review"}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="feedback"
                                label="Feedback"
                                value={reviewData.feedback}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="strengths"
                                label="Strengths"
                                value={reviewData.strengths}
                                onChange={handleChange}
                                fullWidth
                                multiline
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="areasOfImprovement"
                                label="Areas of Improvement"
                                value={reviewData.areasOfImprovement}
                                onChange={handleChange}
                                fullWidth
                                multiline
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="trainingRecommendations"
                                label="Training Recommendations"
                                value={reviewData.trainingRecommendations}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="overallRating"
                                label="Overall Rating (1-5)"
                                value={reviewData.overallRating}
                                onChange={handleChange}
                                type="number"
                                fullWidth
                                inputProps={{ min: 1, max: 5 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="comments"
                                label="Additional Comments"
                                value={reviewData.comments}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitReview} variant="contained" color="primary">
                        {selectedAppraisal && selectedAppraisal.managerReview ? "Update Review" : "Submit Review"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default ReviewForm;

