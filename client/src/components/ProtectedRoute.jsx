import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingBlock } from "./StateBlocks";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "80px 20px" }}>
        <LoadingBlock label="Checking your session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
