// import React, { useEffect, useState } from "react";
// import {
//     Box, Typography, Paper, Grid, Button,
//     Dialog, DialogTitle, DialogContent, DialogActions,
//     TextField
// } from "@mui/material";
// import API from "../../api/Axios"; // adjust path as needed

// const ReviewForm = () => {
//     const [appraisals, setAppraisals] = useState([]);
//     const [selectedAppraisal, setSelectedAppraisal] = useState(null);
//     const [openDialog, setOpenDialog] = useState(false);

//     const [reviewData, setReviewData] = useState({
//         feedback: "",
//         strengths: "",
//         areasOfImprovement: "",
//         trainingRecommendations: "",
//         overallRating: "",
//         comments: ""
//     });

//     useEffect(() => {
//         const fetchAppraisals = async () => {
//             try {
//                 const res = await API.get("/manager/getappraisal");
//                 const withSelfReview = res.data.appraisals.filter(app => app.selfReview);
//                 setAppraisals(withSelfReview);
//                 if (withSelfReview.length > 0) {
//                     setSelectedAppraisal(withSelfReview[0]); // Auto-select first for demo
//                 }
//             } catch (err) {
//                 console.error(err);
//             }
//         };

//         fetchAppraisals();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setReviewData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleSubmitReview = async () => {
//         try {
//             await API.post(`/manager/submitreview/${selectedAppraisal._id}`, reviewData);
//             alert("Manager review submitted!");
//             setOpenDialog(false);
//         } catch (err) {
//             console.error(err);
//             alert("Submission failed.");
//         }
//     };

//     return (
//         <Box sx={{ p: 4 }}>
//             <Typography variant="h5" fontWeight="bold" mb={3}>
//                 Employee Self-Assessment
//             </Typography>

//             {selectedAppraisal && (
//                 <Grid container spacing={3}>
//                     <Grid item xs={12} md={8}>
//                         <Paper elevation={3} sx={{ p: 3, textAlign: 'left' }}>
//                             <Typography variant="h6" gutterBottom>
//                                 {selectedAppraisal.employee.firstname} {selectedAppraisal.employee.lastname}
//                             </Typography>
//                             <Typography variant="subtitle2" color="textSecondary" gutterBottom>
//                                 Email: {selectedAppraisal.employee.email}
//                             </Typography>

//                             <Box mt={2}>
//                                 <Typography variant="subtitle1" fontWeight="bold">
//                                     Goals:
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     {selectedAppraisal.selfReview.goals || "No goals provided."}
//                                 </Typography>
//                             </Box>

//                             <Box mt={2}>
//                                 <Typography variant="subtitle1" fontWeight="bold">
//                                     Achievements:
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     {selectedAppraisal.selfReview.achievements || "No achievements provided."}
//                                 </Typography>
//                             </Box>

//                             <Box mt={2}>
//                                 <Typography variant="subtitle1" fontWeight="bold">
//                                     Challenges:
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     {selectedAppraisal.selfReview.challenges || "No challenges provided."}
//                                 </Typography>
//                             </Box>

//                             <Box mt={2}>
//                                 <Typography variant="subtitle1" fontWeight="bold">
//                                     Future Goals:
//                                 </Typography>
//                                 <Typography variant="body1">
//                                     {selectedAppraisal.selfReview.futureGoals || "No future goals provided."}
//                                 </Typography>
//                             </Box>

//                             <Box mt={4}>
//                                 <Button
//                                     variant="contained"
//                                     color="primary"
//                                     onClick={() => setOpenDialog(true)}
//                                     disabled={!!selectedAppraisal.managerReview} // disables if review exists
//                                 >
//                                     {selectedAppraisal.managerReview ? "Review Submitted" : "Submit Manager Review"}
//                                 </Button>
//                                 {selectedAppraisal.managerReview && (
//                                     <Typography variant="body2" color="success.main" mt={1}>
//                                         Manager review already submitted.
//                                     </Typography>
//                                 )}

//                             </Box>
//                         </Paper>
//                     </Grid>
//                 </Grid>
//             )}

//             {/* Dialog for Manager Review Submission */}
//             <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
//                 <DialogTitle>Manager Review</DialogTitle>
//                 <DialogContent dividers>
//                     <Grid container spacing={2}>
//                         <Grid item xs={12}>
//                             <TextField
//                                 name="feedback"
//                                 label="Feedback"
//                                 value={reviewData.feedback}
//                                 onChange={handleChange}
//                                 fullWidth
//                                 multiline
//                                 rows={3}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 name="strengths"
//                                 label="Strengths"
//                                 value={reviewData.strengths}
//                                 onChange={handleChange}
//                                 fullWidth
//                                 multiline
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 name="areasOfImprovement"
//                                 label="Areas of Improvement"
//                                 value={reviewData.areasOfImprovement}
//                                 onChange={handleChange}
//                                 fullWidth
//                                 multiline
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 name="trainingRecommendations"
//                                 label="Training Recommendations"
//                                 value={reviewData.trainingRecommendations}
//                                 onChange={handleChange}
//                                 fullWidth
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 name="overallRating"
//                                 label="Overall Rating (1-5)"
//                                 value={reviewData.overallRating}
//                                 onChange={handleChange}
//                                 type="number"
//                                 fullWidth
//                                 inputProps={{ min: 1, max: 5 }}
//                             />
//                         </Grid>
//                         <Grid item xs={12}>
//                             <TextField
//                                 name="comments"
//                                 label="Additional Comments"
//                                 value={reviewData.comments}
//                                 onChange={handleChange}
//                                 fullWidth
//                                 multiline
//                                 rows={2}
//                             />
//                         </Grid>
//                     </Grid>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpenDialog(false)} color="inherit">
//                         Cancel
//                     </Button>
//                     <Button onClick={handleSubmitReview} variant="contained" color="primary">
//                         Submit Review
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </Box>
//     );
// };

// export default ReviewForm;

import React, { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Grid, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField
} from "@mui/material";
import API from "../../api/Axios"; // adjust path as needed

const ReviewForm = () => {
    const [appraisals, setAppraisals] = useState([]);
    const [selectedAppraisal, setSelectedAppraisal] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const [reviewData, setReviewData] = useState({
        feedback: "",
        strengths: "",
        areasOfImprovement: "",
        trainingRecommendations: "",
        overallRating: "",
        comments: ""
    });

    useEffect(() => {
        const fetchAppraisals = async () => {
            try {
                const res = await API.get("/manager/getappraisal");
                const withSelfReview = res.data.appraisals.filter(app => app.selfReview);
                setAppraisals(withSelfReview);
                if (withSelfReview.length > 0) {
                    setSelectedAppraisal(withSelfReview[0]); // auto-select first
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchAppraisals();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async () => {
        try {
            const res = await API.post(`/manager/submitreview/${selectedAppraisal._id}`, reviewData);
            alert("Manager review submitted!");
            setOpenDialog(false);

            setSelectedAppraisal((prev) => ({
                ...prev,
                managerReview: res.data.managerReview
            }));
        } catch (err) {
            console.error(err);
            alert("Submission failed.");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                Employee Self-Assessment
            </Typography>

            {selectedAppraisal && !selectedAppraisal.managerReview && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ p: 3, textAlign: 'left' }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedAppraisal.employee.firstname} {selectedAppraisal.employee.lastname}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                Email: {selectedAppraisal.employee.email}
                            </Typography>

                            <Box mt={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Goals:</Typography>
                                <Typography variant="body1">
                                    {selectedAppraisal.selfReview.goals || "No goals provided."}
                                </Typography>
                            </Box>

                            <Box mt={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Achievements:</Typography>
                                <Typography variant="body1">
                                    {selectedAppraisal.selfReview.achievements || "No achievements provided."}
                                </Typography>
                            </Box>

                            <Box mt={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Challenges:</Typography>
                                <Typography variant="body1">
                                    {selectedAppraisal.selfReview.challenges || "No challenges provided."}
                                </Typography>
                            </Box>

                            <Box mt={2}>
                                <Typography variant="subtitle1" fontWeight="bold">Future Goals:</Typography>
                                <Typography variant="body1">
                                    {selectedAppraisal.selfReview.futurePlans || "No future goals provided."}
                                </Typography>
                            </Box>

                            <Box mt={4}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenDialog(true)}
                                >
                                    Submit Manager Review
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {selectedAppraisal?.managerReview && (
                <Typography variant="h6" color="success.main">
                    Manager review has already been submitted and the form is closed.
                </Typography>
            )}

            {/* Dialog for Manager Review Submission */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
                <DialogTitle>Manager Review</DialogTitle>
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
                        Submit Review
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ReviewForm;
