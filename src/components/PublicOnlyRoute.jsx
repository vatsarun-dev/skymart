import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAppContext();

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
