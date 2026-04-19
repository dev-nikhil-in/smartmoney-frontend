import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import useAuthStore from "./store/authStore";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/settings/Settings";
import Loans from "./pages/loans/Loans";
import LoanForm from "./pages/loans/LoanForm";



function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loans" element={<ProtectedRoute><Loans /></ProtectedRoute>} />
        <Route path="/loans/add" element={<ProtectedRoute><LoanForm /></ProtectedRoute>} />
        <Route path="/loans/:id/edit" element={<ProtectedRoute><LoanForm /></ProtectedRoute>} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
            }
          />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
       </Routes>
    </BrowserRouter>
  );
}