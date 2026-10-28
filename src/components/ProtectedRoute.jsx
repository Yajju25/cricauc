import { Navigate } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuction();
  return isLoggedIn ? children : <Navigate to="/login" />;
}