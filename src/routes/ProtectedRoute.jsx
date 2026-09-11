import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --------------------------------
// Wrap any route that requires login:
// <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
// --------------------------------
function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;