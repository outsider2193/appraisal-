import { Routes, Route } from "react-router-dom";
import Landingpage from "./components/pages/Landingpage";
import Register from "./components/pages/Register";
import LoginPage from "./components/pages/LoginPage";
import { ToastContainer } from "react-toastify";
import HrDashboard from "./components/hr/HrDashboard";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";

function App() {


  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Landingpage />}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/hr/dashboard/:id" element={<HrDashboard />}></Route>
          <Route path="/manager/dashboard/:id" element={<ManagerDashboard />}></Route>
          <Route path="/employee/dashboard/:id" element={<EmployeeDashboard />}></Route>
        </Routes>
        <ToastContainer />
      </div>
    </>

  )
}

export default App
