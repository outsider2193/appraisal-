const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware");
const { submitManagerReview, getManagerAppraisals, assignGoal, getEmployeeGoals,
    assignTraining, giveRecognition,
    getManagerReviewForm,
    getEmployeeTrainings,
    deleteGoal,
    deleteTraining } = require("../controllers/managerController")

router.get("/getreview/:appraisalId", verifyToken, authorizedRoles("manager"), getManagerReviewForm)
router.post("/submitreview/:appraisalId", verifyToken, authorizedRoles("manager"), submitManagerReview);
router.get("/getappraisal", verifyToken, authorizedRoles("manager"), getManagerAppraisals);
router.post("/assigngoal/:employeeId", verifyToken, authorizedRoles("manager"), assignGoal);
router.get("/fetchgoals/:employeeId", verifyToken, authorizedRoles("manager"), getEmployeeGoals);
router.get("/fetchtrainings/:employeeId", verifyToken, authorizedRoles("manager"), getEmployeeTrainings);
router.post("/assigntraining/:employeeId", verifyToken, authorizedRoles("manager"), assignTraining);
router.post("/assignrecognition/:employeeId", verifyToken, authorizedRoles("manager"), giveRecognition);
router.delete("/goals/:goalId", verifyToken, authorizedRoles("manager"), deleteGoal);
router.delete("/trainings/:trainingId", verifyToken, authorizedRoles("manager"), deleteTraining);

// router.get("/employees", verifyToken, authorizedRoles("manager"), getEmployeesUnderManager)

module.exports = router;