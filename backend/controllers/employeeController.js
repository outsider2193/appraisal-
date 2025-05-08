const Appraisal = require("../models/appraisalModel");
const SelfReview = require('../models/selfReviewModel');
const Goal = require('../models/goalModel');
const Training = require('../models/trainingModel');
const Recognition = require('../models/recognitionModel');

const getEmployeePendingAppraisals = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const appraisals = await Appraisal.find({
            employee: employeeId,
            status: "pending"
        }).populate("manager", "firstName email");

        if (!appraisals.length) {
            return res.status(400).json({ message: "No appraisals assigned yet" })
        }

        res.status(200).json(appraisals);
    } catch (error) {
        console.error("Error fetching pending appraisals:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

const submitSelfReview = async (req, res) => {
    try {
        const { achievements, challenges, goalsCompleted, futurePlans, trainingNeeds, ratings, comments } = req.body;
        const employeeId = req.user.id;
        const { appraisalId } = req.params;


        const appraisal = await Appraisal.findById(appraisalId);
        if (!appraisal || appraisal.employee.toString() !== employeeId) {
            return res.status(403).json({ message: "Not authorized or appraisal not found" });
        }

        const selfReview = new SelfReview({
            appraisal: appraisalId,
            achievements,
            challenges,
            goalsCompleted,
            futurePlans,
            trainingNeeds,
            ratings,
            comments,
            submittedAt: new Date()
        });

        const savedReview = await selfReview.save();


        appraisal.selfReview = savedReview._id;
        appraisal.status = "self_review_completed";
        await appraisal.save();

        res.status(201).json({ message: "Self review submitted", selfReview: savedReview });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}


const getEmployeeGoals = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const goals = await Goal.find({ employee: employeeId }).populate("employee", "firstName lastName email").exec();
        if (!goals.length) {
            return res.status(400).json({ message: "No goal assigned" })
        }
        res.status(200).json({ goals });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching goals" });
    }
};


const updateGoalProgressByEmployee = async (req, res) => {
    try {
        const { goalId } = req.params;
        const { progress, status } = req.body;

        const validStatuses = ["not_started", "in_progress", "completed", "deferred"];


        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const goal = await Goal.findById(goalId);

        if (!goal || goal.employee.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized or goal not found" });
        }

        if (progress !== undefined) {
            if (typeof progress !== "number" || progress < 0 || progress > 100) {
                return res.status(400).json({ message: "Progress must be a number between 0 and 100" });
            }
            goal.progress = progress;
        }

        if (status) goal.status = status;

        await goal.save();
        res.status(200).json({ message: "Goal progress updated", goal });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating goal" });
    }
};

const getEmployeeTrainings = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const trainings = await Training.find({ employee: employeeId });
        if (!trainings.length) {
            return res.status(400).json({ message: "No training assigned" })
        }
        res.status(200).json({ trainings });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching trainings" });
    }
};


const updateTrainingByEmployee = async (req, res) => {
    try {
        const { trainingId } = req.params;
        const { status } = req.body;
        const validStatuses = ["planned", "in_progress", "completed"];


        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const training = await Training.findById(trainingId);

        if (!training || training.employee.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized or training not found" });
        }

        training.status = status ?? training.status;

        await training.save();
        res.status(200).json({ message: "Training status updated", training });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while updating training" });
    }
};

const getEmployeeRecognitions = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const recognitions = await Recognition.find({ employee: employeeId });

        if (!recognitions) {
            return res.status(400).json({ message: "No recognitions available" })
        }
        res.status(200).json({ recognitions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while fetching recognitions" });
    }
};



const getEmployeeCompletedAppraisals = async (req, res) => {
    try {
        const employeeId = req.user.id;

        const completedAppraisals = await Appraisal.find({
            employee: employeeId,
            status: "completed"
        })
            .populate("manager", "firstName lastName email")
            .populate("hr", "firstName lastName email")
            .populate("selfReview")
            .populate("managerReview")
            .populate("hrReview");

        if (!completedAppraisals || completedAppraisals.length === 0) {
            return res.status(404).json({ message: "No completed appraisals found" });
        }

        res.status(200).json(completedAppraisals);
    } catch (error) {
        console.error("Error fetching completed appraisals:", error);
        res.status(500).json({ message: "Server Error" });
    }
};





module.exports = {
    getEmployeePendingAppraisals, submitSelfReview, getEmployeeGoals, getEmployeeTrainings, getEmployeeRecognitions,
    updateGoalProgressByEmployee, updateTrainingByEmployee, getEmployeeCompletedAppraisals
}