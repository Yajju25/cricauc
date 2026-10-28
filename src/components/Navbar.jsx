import { Link, useNavigate } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

export default function Navbar() {
  const { logout } = useAuction();
  const nav = useNavigate();
  return (
    <nav style={{ background: "#111", borderBottom: "1px solid #333", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span className="gold" style={{ fontWeight: 700, fontSize: 20 }}>🏏 Cricket Auction</span>
      <div className="flex">
        <Link to="/dashboard" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>Dashboard</Link>
        <Link to="/setup-teams" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>Teams</Link>
        <Link to="/setup-players" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>Players</Link>
        <Link to="/bidding" style={{ color: "#ccc", textDecoration: "none", fontSize: 14 }}>Bidding</Link>
        <button className="btn btn-outline" style={{ padding: "6px 14px" }} onClick={() => { logout(); nav("/login"); }}>Logout</button>
      </div>
    </nav>
  );
}