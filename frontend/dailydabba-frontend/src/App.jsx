// All page URLs live here. To add a page later: create it in /pages and add one <Route>.
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import VendorProfilePage from "./pages/VendorProfilePage";
import EditVendorProfilePage from "./pages/EditVendorProfilePage";
import VendorCatalogPage from "./pages/VendorCatalogPage";
import CustomerProfilePage from "./pages/CustomerProfilePage";
import EditCustomerProfilePage from "./pages/EditCustomerProfilePage";
import { ProtectedRoute, PublicOnlyRoute } from "./components/routing/RouteGuards";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/vendor/profile" element={<ProtectedRoute><VendorProfilePage /></ProtectedRoute>} />
      <Route path="/vendor/profile/edit" element={<ProtectedRoute><EditVendorProfilePage /></ProtectedRoute>} />
      <Route path="/vendor/catalog" element={<ProtectedRoute><VendorCatalogPage /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute><CustomerProfilePage /></ProtectedRoute>} />
      <Route path="/customer/profile/edit" element={<ProtectedRoute><EditCustomerProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

