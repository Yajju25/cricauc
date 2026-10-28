import { useAuction } from "../context/AuctionContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { teams, players, resetAuction } = useAuction();
  const nav = useNavigate();

  const sold = players.filter(p => p.status === "sold");
  const unsold = players.filter(p => p.status === "unsold");
  const pending = players.filter(p => p.status === "pending");

  return (
    <div className="page">
      <h2 className="gold" style={{ marginBottom: 24 }}>Auction Dashboard</h2>

      {/* Stats Row */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Players", value: players.length, color: "#f0f0f0" },
          { label: "Sold", value: sold.length, color: "#4caf50" },
          { label: "Unsold", value: unsold.length, color: "#f44336" },
          { label: "Pending", value: pending.length, color: "#c9a800" },
          { label: "Teams", value: teams.length, color: "#f0f0f0" },
          { label: "Total Budget", value: `₹${teams.reduce((s, t) => s + t.budget + t.spent, 0)}L`, color: "#c9a800" },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex" style={{ marginBottom: 28, gap: 12 }}>
        <button className="btn btn-gold" onClick={() => nav("/bidding")}>Go to Bidding</button>
        <button className="btn btn-outline" onClick={() => nav("/setup-teams")}>Manage Teams</button>
        <button className="btn btn-outline" onClick={() => nav("/setup-players")}>Manage Players</button>
        <button className="btn btn-red" onClick={() => { if (confirm("Reset all auction data?")) resetAuction(); }}>Reset Auction</button>
      </div>

      {/* Teams Overview */}
      <h3 style={{ marginBottom: 14 }}>Teams</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {teams.map(t => {
          const squad = players.filter(p => p.soldTo === t.id);
          return (
            <div key={t.id} className="card">
              <div className="flex" style={{ marginBottom: 12 }}>
                {t.logo ? <img src={t.logo} alt={t.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                  : <div style={{ width: 48, height: 48, borderRadius: 8, background: "#333" }} />}
                <div>
                  <div style={{ fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>₹{t.budget}L remaining</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#aaa", marginBottom: 8 }}>Squad ({squad.length} players):</div>
              {squad.map(p => (
                <div key={p.id} className="flex" style={{ padding: "6px 0", borderBottom: "1px solid #222" }}>
                  <span style={{ fontSize: 13 }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "#c9a800", marginLeft: "auto" }}>₹{p.soldPrice}L</span>
                </div>
              ))}
              {squad.length === 0 && <p style={{ fontSize: 13, color: "#555" }}>No players yet.</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}