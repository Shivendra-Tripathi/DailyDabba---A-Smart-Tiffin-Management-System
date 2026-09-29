// All page URLs live here. To add a page later: create it in /pages and add one <Route>.
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { ProtectedRoute, PublicOnlyRoute } from "./components/routing/RouteGuards";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
