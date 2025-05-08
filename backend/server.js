const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

const authRoutes = require("./routes/authRoutes")
const appraisalRoutes = require("./routes/appraisalRoutes")
const employeeRoutes = require("./routes/employeeRoutes")
const managerRoutes = require("./routes/managerRoutes");


app.use("/auth", authRoutes);
app.use("/hr", appraisalRoutes);
app.use("/employee", employeeRoutes);
app.use("/manager", managerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
