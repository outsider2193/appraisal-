import { Routes, Route } from "react-router-dom";
import Landingpage from "./components/pages/Landingpage";
import Register from "./components/pages/Register";
import { ToastContainer } from "react-toastify";
import LoginPage from "./components/pages/LoginPage";

function App() {


  return (
    <div>
      <Routes>
        <Route path="/" element={<Landingpage />}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/login" element={<LoginPage></LoginPage>}></Route>
      </Routes>
      <ToastContainer></ToastContainer>
    </div>

  )
}

export default App
