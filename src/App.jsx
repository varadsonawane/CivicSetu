import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from "./pages/AdminDashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App