import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>    
  )
}

export default App