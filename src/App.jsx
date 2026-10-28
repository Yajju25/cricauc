import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuctionProvider } from "./context/AuctionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/DashBoard";
import SetupTeams from "./pages/SetupTeams";
import SetupPlayers from "./pages/SetupPlayers";
import Bidding from "./pages/Bidding";

function Layout({ children }) {
  return <>
    <Navbar />
    <main>{children}</main>
  </>;
}

export default function App() {
  return (
    <AuctionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/setup-teams" element={<ProtectedRoute><Layout><SetupTeams /></Layout></ProtectedRoute>} />
          <Route path="/setup-players" element={<ProtectedRoute><Layout><SetupPlayers /></Layout></ProtectedRoute>} />
          <Route path="/bidding" element={<ProtectedRoute><Layout><Bidding /></Layout></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuctionProvider>
  );
}