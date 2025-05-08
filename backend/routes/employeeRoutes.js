const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware")
const { getEmployeePendingAppraisals, submitSelfReview, getEmployeeGoals, getEmployeeTrainings, getEmployeeRecognitions
    , updateGoalProgressByEmployee, updateTrainingByEmployee,
    getEmployeeCompletedAppraisals
} = require("../controllers/employeeController")

router.get("/getappraisals", verifyToken, authorizedRoles("employee"), getEmployeePendingAppraisals);
router.post("/submitreview/:appraisalId", verifyToken, authorizedRoles("employee"), submitSelfReview);
router.get("/fetchgoals", verifyToken, authorizedRoles("employee"), getEmployeeGoals);
router.get("/fetchtraining", verifyToken, authorizedRoles("employee"), getEmployeeTrainings);
router.get("/fetchrecognition", verifyToken, authorizedRoles("employee"), getEmployeeRecognitions);
router.put("/updategoal/:goalId", verifyToken, authorizedRoles("employee"), updateGoalProgressByEmployee);
router.put("/updatetraining/:trainingId", verifyToken, authorizedRoles("employee"), updateTrainingByEmployee);
router.get("/history", verifyToken, authorizedRoles("employee"), getEmployeeCompletedAppraisals);


module.exports = router;