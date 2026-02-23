import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ requiredPermission }) => {
    const { token, user, hasPermission, loading } = useAuth();

    
    const isValidating = (loading && token) || (token && !user);

    if (isValidating) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-main)', gap: '1rem' }}>
                <div className="spinner" style={{ borderTopColor: 'var(--primary)', borderLeftColor: 'var(--primary)', width: '3rem', height: '3rem' }}></div>
                <p style={{ color: 'var(--text-muted)', fontWeight: '500', fontSize: '0.875rem' }}>Verifying authorization...</p>
            </div>
        );
    }

    if (!token) {
        console.log("ProtectedRoute: No token, redirecting to login.");
        return <Navigate to="/login" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        console.warn(`ProtectedRoute: Missing ${requiredPermission} permission.`);

        if (requiredPermission === "VIEW_SELF") {
            console.log("ProtectedRoute: Allowing VIEW_SELF as basic user right.");
            return <Outlet />;
        }

        console.log("ProtectedRoute: Redirecting to profile as fallback.");
        return <Navigate to="/profile" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
