
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return <div className="p-6 text-center">Đang tải...</div>; // chờ xíu
    }
    if (!isAuthenticated) {
        // lưu lại trang người dùng định vào (location.pathname)
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
