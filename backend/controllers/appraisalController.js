// const Appraisal = require("../models/appraisalModel")
// const User = require("../models/userModel");
// const HRReview = require("../models/hrReviewModel")

// const createAppraisal = async (req, res) => {
//     try {
//         const { employeeId, managerId, appraisalCycle, startDate, dueDate } = req.body;
//         const hrId = req.user.id;
//         if (!employeeId || !managerId || !startDate || !dueDate) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         const [employeeExists, managerExists] = await Promise.all([
//             User.findById(employeeId),
//             User.findById(managerId)
//         ]);

//         if (!employeeExists || !managerExists) {
//             return res.status(404).json({ message: "Employee or Manager not found" });
//         }


//         const existingAppraisal = await Appraisal.findOne({
//             employee: employeeId,
//             appraisalCycle,
//             startDate: { $gte: new Date(startDate) },
//             dueDate: { $lte: new Date(dueDate) }
//         });

//         if (existingAppraisal) {
//             return res.status(409).json({ message: "Appraisal already exists for this cycle and time period." });
//         }

//         const appraisal = new Appraisal({
//             employee: employeeId,
//             manager: managerId,
//             hr: hrId,
//             appraisalCycle: appraisalCycle || "annual",
//             startDate,
//             dueDate,
//             status: "pending"
//         });

//         const savedAppraisal = await appraisal.save();

//         await User.findByIdAndUpdate(employeeId, {
//             $addToSet: { appraisals: savedAppraisal._id },
//         });

//         await User.findByIdAndUpdate(managerId, {
//             $addToSet: { appraisals: savedAppraisal._id },
//         });

//         res.status(201).json({ message: "Appraisal created successfully", appraisal });
//     } catch (error) {
//         console.error("Error creating appraisal:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// };

// const getHRReviewForm = async (req, res) => {
//     try {
//         const { appraisalId } = req.params; 


//         const appraisal = await Appraisal.findById(appraisalId).populate('managerReview');


//         if (!appraisal || appraisal.hr.toString() !== req.user.id) {
//             return res.status(404).json({ message: "Appraisal not found or you're not authorized to review this." });
//         }


//         if (!appraisal.managerReview) {
//             return res.status(400).json({ message: "Manager has not completed the review yet." });
//         }


//         res.status(200).json({ managerReview: appraisal.managerReview });
//     } catch (err) {
//         console.error("Error fetching HR review form:", err);
//         res.status(500).json({ message: "Server error" });
//     }
// };


// const submitFinalHRReview = async (req, res) => {
//     try {
//         const { salaryIncreasePercentage, finalRating, promotionRecommendation, comments, additionalRemarks } = req.body;
//         const hrId = req.user.id;
//         const { appraisalId } = req.params;

//         const appraisal = await Appraisal.findById(appraisalId);
//         if (!appraisal) {
//             return res.status(404).json({ message: "Appraisal not found" });
//         }



//         const hrReview = new HRReview({
//             appraisal: appraisalId,
//             hr: hrId,
//             salaryIncreasePercentage,
//             finalRating,
//             promotionRecommendation,
//             comments,
//             additionalRemarks,
//             submittedAt: new Date()
//         });

//         const savedReview = await hrReview.save();

//         appraisal.hrReview = savedReview._id;
//         appraisal.status = "completed";
//         await appraisal.save();

//         res.status(201).json({ message: "HR final review submitted", hrReview: savedReview });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Server error" });
//     }
// };
// const getAllEmployees = async (req, res) => {
//     try {
//         const employees = await User.find({ role: "employee" }).select("-password");
//         if (!employees) {
//             return res.status(400).json({ message: "No employees found" })
//         }
//         res.status(200).json({ employees });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Error fetching employees" });
//     }
// };


// const getAllAppraisals = async (req, res) => {
//     try {
//         const hrId = req.user.id;

//         const appraisals = await Appraisal.find({ hr: hrId })
//             .populate("employee", "firstname lastname email")
//             .populate("manager", "firstname lastname email");

//         res.status(200).json({ appraisals });
//     } catch (err) {
//         console.error("Error fetching HR appraisals:", err);
//         res.status(500).json({ message: "Server error while fetching appraisals" });
//     }
// };



// const updateAppraisalByHR = async (req, res) => {
//     try {
//         const { appraisalId } = req.params;
//         const {
//             employee,
//             manager,
//             appraisalCycle,
//             startDate,
//             dueDate
//         } = req.body;

//         const appraisal = await Appraisal.findById(appraisalId);
//         if (!appraisal) {
//             return res.status(404).json({ message: "Appraisal not found" });
//         }


//         if (["self_review_completed", "manager_review_completed", "hr_review_completed", "completed"].includes(appraisal.status)) {
//             return res.status(400).json({ message: "Cannot update appraisal after the review process has started" });
//         }


//         if (employee && !(await User.findById(employee))) {
//             return res.status(404).json({ message: "Employee not found" });
//         }
//         if (manager && !(await User.findById(manager))) {
//             return res.status(404).json({ message: "Manager not found" });
//         }


//         const validCycles = ["annual", "probation", "special"];
//         if (appraisalCycle && !validCycles.includes(appraisalCycle)) {
//             return res.status(400).json({ message: "Invalid appraisal cycle" });
//         }


//         if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
//             return res.status(400).json({ message: "Due date cannot be before start date" });
//         }


//         appraisal.employee = employee ?? appraisal.employee;
//         appraisal.manager = manager ?? appraisal.manager;
//         appraisal.appraisalCycle = appraisalCycle ?? appraisal.appraisalCycle;
//         appraisal.startDate = startDate ?? appraisal.startDate;
//         appraisal.dueDate = dueDate ?? appraisal.dueDate;

//         await appraisal.save();

//         res.status(200).json({ message: "Appraisal updated successfully", appraisal });
//     } catch (err) {
//         console.error("Error updating appraisal:", err);
//         res.status(500).json({ message: "Server error while updating appraisal" });
//     }
// };

// const filterAppraisals = async (req, res) => {
//     try {
//         const { status, employeeId, managerId } = req.query;


//         const query = {};

//         if (status) {
//             if (!["pending", "self_review_completed", "manager_review_completed", "hr_review_completed", "completed"].includes(status)) {
//                 return res.status(400).json({ message: "Invalid status value" });
//             }
//             query.status = status;
//         }

//         if (employeeId) {
//             query.employee = employeeId;
//         }

//         if (managerId) {
//             query.manager = managerId;
//         }


//         query.hr = req.user.id;

//         const appraisals = await Appraisal.find(query)
//             .populate('employee', 'firstname lastname email')
//             .populate('manager', 'firstname lastname email')
//             .populate('hr', 'firstname lastname email')
//             .populate('selfReview')
//             .populate('managerReview')
//             .populate('hrReview');

//         if (appraisals.length === 0) {
//             return res.status(404).json({ message: "No appraisals found for the specified filters." });
//         }
//         res.status(200).json({ count: appraisals.length, appraisals });
//     } catch (err) {
//         console.error("Error filtering appraisals:", err);
//         res.status(500).json({ message: "Server error while filtering appraisals" });
//     }
// };







// module.exports = {
//     createAppraisal,
//     submitFinalHRReview,
//     getAllEmployees,
//     getAllAppraisals,
//     updateAppraisalByHR,
//     filterAppraisals,
//     getHRReviewForm
// };


const Appraisal = require("../models/appraisalModel");
const User = require("../models/userModel");
const HRReview = require("../models/hrReviewModel");


const createAppraisal = async (req, res) => {
    try {
        const { employeeId, managerId, appraisalCycle, startDate, dueDate } = req.body;
        const hrId = req.user.id;


        if (!employeeId || !managerId || !startDate || !dueDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        const [employeeExists, managerExists] = await Promise.all([
            User.findById(employeeId),
            User.findById(managerId)
        ]);

        if (!employeeExists || !managerExists) {
            return res.status(404).json({ message: "Employee or Manager not found" });
        }


        const existingAppraisal = await Appraisal.findOne({
            employee: employeeId,
            appraisalCycle,
            startDate: { $gte: new Date(startDate) },
            dueDate: { $lte: new Date(dueDate) }
        });

        if (existingAppraisal) {
            return res.status(409).json({ message: "Appraisal already exists for this cycle and time period." });
        }


        const appraisal = new Appraisal({
            employee: employeeId,
            manager: managerId,
            hr: hrId,
            appraisalCycle: appraisalCycle || "annual",
            startDate,
            dueDate,
            status: "pending"
        });

        const savedAppraisal = await appraisal.save();


        await Promise.all([
            User.findByIdAndUpdate(employeeId, { $addToSet: { appraisals: savedAppraisal._id } }),
            User.findByIdAndUpdate(managerId, { $addToSet: { appraisals: savedAppraisal._id } })
        ]);

        res.status(201).json({ message: "Appraisal created successfully", appraisal: savedAppraisal });
    } catch (error) {
        console.error("Error creating appraisal:", error);
        res.status(500).json({ message: "Server error" });
    }
};


const getHRReviewForm = async (req, res) => {
    try {
        const { appraisalId } = req.params;

        const appraisal = await Appraisal.findById(appraisalId).populate('managerReview');

        if (!appraisal || appraisal.hr.toString() !== req.user.id) {
            return res.status(404).json({ message: "Appraisal not found or you're not authorized to review this." });
        }

        if (!appraisal.managerReview) {
            return res.status(400).json({ message: "Manager has not completed the review yet." });
        }

        res.status(200).json({ managerReview: appraisal.managerReview });
    } catch (err) {
        console.error("Error fetching HR review form:", err);
        res.status(500).json({ message: "Server error" });
    }
};


const submitFinalHRReview = async (req, res) => {
    try {
        const { salaryIncreasePercentage, finalRating, promotionRecommendation, comments, additionalRemarks } = req.body;
        const hrId = req.user.id;
        const { appraisalId } = req.params;

        const appraisal = await Appraisal.findById(appraisalId);
        if (!appraisal) {
            return res.status(404).json({ message: "Appraisal not found" });
        }


        if (appraisal.hrReview) {
            return res.status(400).json({ message: "HR review already submitted for this appraisal." });
        }

        const hrReview = new HRReview({
            appraisal: appraisalId,
            hr: hrId,
            salaryIncreasePercentage,
            finalRating,
            promotionRecommendation,
            comments,
            additionalRemarks,
            submittedAt: new Date()
        });

        const savedReview = await hrReview.save();

        appraisal.hrReview = savedReview._id;
        appraisal.status = "completed";
        await appraisal.save();

        res.status(201).json({ message: "HR final review submitted", hrReview: savedReview });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


const getAllEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" })
            .select("firstName lastName email department designation");

        if (!employees.length) {
            return res.status(404).json({ message: "No employees found" });
        }

        res.status(200).json({ employees });
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ message: "Error fetching employees" });
    }
};


const getAllManagers = async (req, res) => {
    try {
        const managers = await User.find({ role: "manager" }).select("firstName lastName email department");
        if (!managers.length) {
            return res.status(404).json({ message: "No managers found" });
        }
        res.status(200).json({ managers });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching managers" });
    }
};



const getAllAppraisals = async (req, res) => {
    try {
        const hrId = req.user.id;

        const appraisals = await Appraisal.find({ hr: hrId })
            .populate("employee", "firstName lastName email")
            .populate("manager", "firstName lastName email");

        res.status(200).json({ appraisals });
    } catch (err) {
        console.error("Error fetching HR appraisals:", err);
        res.status(500).json({ message: "Server error while fetching appraisals" });
    }
};


const updateAppraisalByHR = async (req, res) => {
    try {
        const { appraisalId } = req.params;
        const { employee, manager, appraisalCycle, startDate, dueDate } = req.body;

        const appraisal = await Appraisal.findById(appraisalId);
        if (!appraisal) {
            return res.status(404).json({ message: "Appraisal not found" });
        }


        if (["self_review_completed", "manager_review_completed", "hr_review_completed", "completed"].includes(appraisal.status)) {
            return res.status(400).json({ message: "Cannot update appraisal after the review process has started" });
        }

        if (employee && !(await User.findById(employee))) {
            return res.status(404).json({ message: "Employee not found" });
        }
        if (manager && !(await User.findById(manager))) {
            return res.status(404).json({ message: "Manager not found" });
        }


        const validCycles = ["annual", "probation", "special"];
        if (appraisalCycle && !validCycles.includes(appraisalCycle)) {
            return res.status(400).json({ message: "Invalid appraisal cycle" });
        }

        if (startDate && dueDate && new Date(dueDate) < new Date(startDate)) {
            return res.status(400).json({ message: "Due date cannot be before start date" });
        }


        appraisal.employee = employee ?? appraisal.employee;
        appraisal.manager = manager ?? appraisal.manager;
        appraisal.appraisalCycle = appraisalCycle ?? appraisal.appraisalCycle;
        appraisal.startDate = startDate ?? appraisal.startDate;
        appraisal.dueDate = dueDate ?? appraisal.dueDate;

        await appraisal.save();

        res.status(200).json({ message: "Appraisal updated successfully", appraisal });
    } catch (err) {
        console.error("Error updating appraisal:", err);
        res.status(500).json({ message: "Server error while updating appraisal" });
    }
};

const filterAppraisals = async (req, res) => {
    try {
        const { status, employeeId, managerId } = req.query;

        const query = { hr: req.user.id };

        if (status) {
            const validStatuses = ["pending", "self_review_completed", "manager_review_completed", "hr_review_completed", "completed"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: "Invalid status value" });
            }
            query.status = status;
        }

        if (employeeId) query.employee = employeeId;
        if (managerId) query.manager = managerId;

        const appraisals = await Appraisal.find(query)
            .populate('employee', 'firstName lastName email')
            .populate('manager', 'firstName lastName email')
            .populate('hr', 'firstName lastName email')
            .populate('selfReview')
            .populate('managerReview')
            .populate('hrReview');

        if (appraisals.length === 0) {
            return res.status(200).json({ count: 0, appraisals: [] }); // ✅ Return 200 instead of 404
        }

        res.status(200).json({ count: appraisals.length, appraisals });
    } catch (err) {
        console.error("Error filtering appraisals:", err);
        res.status(500).json({ message: "Server error while filtering appraisals" });
    }
};

module.exports = {
    createAppraisal,
    submitFinalHRReview,
    getAllEmployees,
    getAllManagers,
    getAllAppraisals,
    updateAppraisalByHR,
    filterAppraisals,
    getHRReviewForm
};
