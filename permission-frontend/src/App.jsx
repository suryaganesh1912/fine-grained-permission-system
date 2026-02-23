import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import EmployeeList from "./pages/EmployeeList";
import Profile from "./pages/Profile";
import PermissionManager from "./pages/PermissionManager";
import Layout from "./components/Layout";

const RootRedirect = () => {
  const { hasPermission, token, loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("RootRedirect: Checking auth state...", { loading, token: !!token, user: !!user });
    if (!loading && token && user) {
      if (hasPermission("VIEW_EMPLOYEE")) {
        console.log("RootRedirect: Navigating to /employees");
        navigate("/employees", { replace: true });
      } else if (hasPermission("VIEW_SELF")) {
        console.log("RootRedirect: Navigating to /profile");
        navigate("/profile", { replace: true });
      } else if (hasPermission("ASSIGN_PERMISSION")) {
        console.log("RootRedirect: Navigating to /permissions");
        navigate("/permissions", { replace: true });
      } else {
        console.log("RootRedirect: No specific permissions found, redirecting to /profile");
        navigate("/profile", { replace: true });
      }
    } else if (!loading && !token) {
      console.log("RootRedirect: No token found, redirecting to /login");
      navigate("/login", { replace: true });
    }
  }, [loading, token, user, hasPermission, navigate]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)' }}>
      <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderLeftColor: 'var(--primary)', width: '3rem', height: '3rem' }}></div>
      <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem', marginTop: '1rem' }}>Determining your landing page...</p>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RootRedirect />} />

            <Route
              path="/employees"
              element={<ProtectedRoute requiredPermission="VIEW_EMPLOYEE" />}
            >
              <Route index element={<Layout><EmployeeList /></Layout>} />
            </Route>

            <Route
              path="/profile"
              element={<ProtectedRoute requiredPermission="VIEW_SELF" />}
            >
              <Route index element={<Layout><Profile /></Layout>} />
            </Route>

            <Route
              path="/permissions"
              element={<ProtectedRoute requiredPermission="ASSIGN_PERMISSION" />}
            >
              <Route index element={<Layout><PermissionManager /></Layout>} />
            </Route>
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}