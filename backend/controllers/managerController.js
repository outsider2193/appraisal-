// controllers/managerReviewController.js
const ManagerReview = require('../models/managerReviewModel');
const Appraisal = require('../models/appraisalModel');
const Goal = require("../models/goalModel");
const User = require("../models/userModel");
const Training = require('../models/trainingModel');
const Recognition = require('../models/recognitionModel');



const getManagerReviewForm = async (req, res) => {
    try {
        const { appraisalId } = req.params;


        const appraisal = await Appraisal.findById(appraisalId).populate('selfReview');


        if (!appraisal || appraisal.manager.toString() !== req.user.id) {
            return res.status(404).json({ message: "Appraisal not found or you're not authorized to review this." });
        }


        if (!appraisal.selfReview) {
            return res.status(400).json({ message: "Employee has not completed the self-review yet." });
        }


        res.status(200).json({
            appraisalId: appraisal._id,
            employeeId: appraisal.employee.id,
            employeeName: `${appraisal.employee.firstName} ${appraisal.employee.lastName}`,
            selfReview: appraisal.selfReview,
        });
    } catch (err) {
        console.error("Error fetching manager review form:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// const submitManagerReview = async (req, res) => {
//     try {
//         const { feedback, strengths, areasOfImprovement, trainingRecommendations, ratings, overallRating, comments } = req.body;
//         const managerId = req.user.id;
//         const { appraisalId } = req.params;

//         const appraisal = await Appraisal.findById(appraisalId);
//         if (!appraisal || appraisal.manager.toString() !== managerId) {
//             return res.status(403).json({ message: "Not authorized or appraisal not found" });
//         }

//         const managerReview = new ManagerReview({
//             appraisal: appraisalId,
//             feedback,
//             strengths,
//             areasOfImprovement,
//             trainingRecommendations,
//             ratings,
//             overallRating,
//             comments,
//             submittedAt: new Date()
//         });

//         const savedReview = await managerReview.save();

//         appraisal.managerReview = savedReview._id;
//         appraisal.status = "manager_review_completed";
//         await appraisal.save();

//         res.status(201).json({ message: "Manager review submitted", managerReview: savedReview });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };

const submitManagerReview = async (req, res) => {
    try {
        const { feedback, strengths, areasOfImprovement, trainingRecommendations, ratings, overallRating, comments } = req.body;
        const managerId = req.user.id;
        const { appraisalId } = req.params;

        const appraisal = await Appraisal.findById(appraisalId);
        if (!appraisal || appraisal.manager.toString() !== managerId) {
            return res.status(403).json({ message: "Not authorized or appraisal not found" });
        }

        // Check if there's an existing review to update
        if (appraisal.managerReview) {
            // Update the existing review
            const updatedReview = await ManagerReview.findByIdAndUpdate(
                appraisal.managerReview,
                {
                    feedback,
                    strengths,
                    areasOfImprovement,
                    trainingRecommendations,
                    ratings,
                    overallRating,
                    comments,
                    submittedAt: new Date() // Update submission date
                },
                { new: true }
            );

            res.status(200).json({ message: "Manager review updated", managerReview: updatedReview });
        } else {
            // Create a new review
            const managerReview = new ManagerReview({
                appraisal: appraisalId,
                feedback,
                strengths,
                areasOfImprovement,
                trainingRecommendations,
                ratings,
                overallRating,
                comments,
                submittedAt: new Date()
            });

            const savedReview = await managerReview.save();

            appraisal.managerReview = savedReview._id;
            appraisal.status = "manager_review_completed";
            await appraisal.save();

            res.status(201).json({ message: "Manager review submitted", managerReview: savedReview });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getManagerAppraisals = async (req, res) => {
    try {
        const managerId = req.user.id;

        const appraisals = await Appraisal.find({ manager: managerId })
            .populate("employee", "firstName lastName email")
            .populate("selfReview")
            .populate("managerReview");

        const processedAppraisals = await Promise.all(appraisals.map(async (appraisal) => {
            const processedAppraisal = appraisal.toObject();

            // Add review flag
            if (appraisal.selfReview && appraisal.managerReview) {
                const selfReviewUpdated = new Date(appraisal.selfReview.updatedAt || appraisal.selfReview.createdAt);
                const managerReviewDate = new Date(appraisal.managerReview.submittedAt);
                processedAppraisal.needsReview = selfReviewUpdated > managerReviewDate;
            }

            // 🔽 Fetch related goals and trainings
            const employeeId = appraisal.employee._id;
            const employeeGoals = await Goal.find({ employee: employeeId }).lean();
            const employeeTrainings = await Training.find({ employee: employeeId }).lean();

            processedAppraisal.employeeGoals = employeeGoals;
            processedAppraisal.employeeTrainings = employeeTrainings;

            return processedAppraisal;
        }));

        res.status(200).json({ appraisals: processedAppraisals });
    } catch (err) {
        console.error("Error in getManagerAppraisals:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const assignGoal = async (req, res) => {
    try {
        const { title, description, targetDate, priority } = req.body;
        const { employeeId } = req.params;
        const goal = new Goal({
            employee: employeeId,
            title,
            description,
            startDate: new Date(),
            targetDate,
            status: 'not_started',
            priority,
            progress: 0,
            managerFeedback: '',
        });

        const savedGoal = await goal.save();
        res.status(201).json({ message: "Goal assigned successfully", goal: savedGoal });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const getEmployeeGoals = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await User.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const goals = await Goal.find({ employee: employeeId });
        res.status(200).json({ goals });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};



const deleteGoal = async (req, res) => {
    try {
        const { goalId } = req.params;

        const deletedGoal = await Goal.findByIdAndDelete(goalId);

        if (!deletedGoal) {
            return res.status(404).json({ message: "Goal not found" });
        }

        res.status(200).json({ message: "Goal deleted successfully" });
    } catch (err) {
        console.error("Error deleting goal:", err);
        res.status(500).json({ message: "Server error" });
    }
};


const getEmployeeTrainings = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const employee = await User.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const trainings = await Training.find({ employee: employeeId });
        res.status(200).json({ trainings });
    } catch (err) {
        console.error("Error fetching employee trainings:", err);
        res.status(500).json({ message: "Server error" });
    }
};




const assignTraining = async (req, res) => {
    try {
        const { title, description, type, startDate, completionDate } = req.body;
        const { employeeId } = req.params;

        const training = new Training({
            employee: employeeId,
            title,
            description,
            type,
            startDate,
            completionDate,
            status: 'planned',
            recommendedBy: req.user.id,
        });

        const savedTraining = await training.save();
        res.status(201).json({ message: "Training assigned successfully", training: savedTraining });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteTraining = async (req, res) => {
    try {
        const { trainingId } = req.params;

        const deletedTraining = await Training.findByIdAndDelete(trainingId);

        if (!deletedTraining) {
            return res.status(404).json({ message: "Training not  found" });
        }

        res.status(200).json({ message: "Training deleted successfully" });
    } catch (err) {
        console.error("Error deleting Training:", err);
        res.status(500).json({ message: "Server error" });
    }
};



const giveRecognition = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const { employeeId } = req.params;
        const recognition = new Recognition({
            employee: employeeId,
            givenBy: req.user.id,
            title,
            description,
            category,
        });

        const savedRecognition = await recognition.save();
        res.status(201).json({ message: "Recognition given successfully", recognition: savedRecognition });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// const getEmployeesUnderManager = async (req, res) => {
//     try {
//         const managerId = req.user.id;


//         const employees = await User.find({ manager: managerId });


//         if (!employees || employees.length === 0) {
//             return res.status(404).json({ message: "No employees found under this manager." });
//         }


//         const employeeDetails = await Promise.all(employees.map(async (employee) => {
//             const goals = await Goal.find({ employee: employee._id });
//             const trainings = await Training.find({ employee: employee._id });

//             return {
//                 employee,
//                 goals,
//                 trainings
//             };
//         }));


//         res.status(200).json({ employees: employeeDetails });

//     } catch (err) {
//         console.error("Error fetching employees under manager:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };



module.exports = {
    submitManagerReview, getManagerAppraisals, assignGoal, getEmployeeGoals, assignTraining, giveRecognition,
    getManagerReviewForm, getEmployeeTrainings, deleteGoal, deleteTraining

};
