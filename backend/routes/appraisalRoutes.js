const express = require("express");
const router = express.Router();
const { verifyToken, authorizedRoles } = require("../middleware/authMiddleware")
const { createAppraisal, submitFinalHRReview, getAllEmployees, getAllAppraisals, updateAppraisalByHR, filterAppraisals, getHRReviewForm, getAllManagers } = require("../controllers/appraisalController");

router.post("/createappraisal", verifyToken, authorizedRoles("hr"), createAppraisal);
router.get("/getreview/:appraisalId", verifyToken, authorizedRoles("hr"), getHRReviewForm);
router.post("/finalreview/:appraisalId", verifyToken, authorizedRoles("hr"), submitFinalHRReview);
router.get("/fetchemployees", verifyToken, authorizedRoles("hr"), getAllEmployees);
router.get("/fetchmanagers", verifyToken, authorizedRoles("hr"), getAllManagers)
router.get("/fetchallappraisals", verifyToken, authorizedRoles("hr"), getAllAppraisals)
router.put("/updateappraisal/:appraisalId", verifyToken, authorizedRoles("hr"), updateAppraisalByHR);
router.get("/filter", verifyToken, authorizedRoles("hr"), filterAppraisals);

module.exports = router;