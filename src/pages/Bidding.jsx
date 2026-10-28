import { useState } from "react";
import { useAuction } from "../context/AuctionContext";

export default function Bidding() {
  const { teams, players, sellPlayer, markUnsold, auctionStarted, setAuctionStarted } = useAuction();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [activePlayerId, setActivePlayerId] = useState(null);

  const pendingPlayers = players.filter(p => p.status === "pending");
  const unsoldPlayers = players.filter(p => p.status === "unsold");
  const activePlayer = players.find(p => p.id === activePlayerId) || null;

  if (!auctionStarted) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: 80 }}>
        <h2 className="gold" style={{ marginBottom: 16 }}>Start Auction</h2>
        <p style={{ color: "#888", marginBottom: 28 }}>Make sure teams and players are set up before starting.</p>
        <button className="btn btn-gold" style={{ fontSize: 16, padding: "14px 40px" }} onClick={() => setAuctionStarted(true)}>🏏 Start Bidding</button>
      </div>
    );
  }

  const selectPlayer = (id) => {
    setActivePlayerId(id);
    setSelectedTeam("");
    setBidAmount("");
  };

  const handleSell = () => {
    if (!activePlayer) return alert("Select a player first");
    if (!selectedTeam || !bidAmount) return alert("Select team and enter bid amount");
    const team = teams.find(t => t.id === Number(selectedTeam));
    if (Number(bidAmount) < Number(activePlayer.basePrice)) return alert(`Bid must be at least ₹${activePlayer.basePrice}L`);
    if (Number(bidAmount) > team.budget) return alert("Bid exceeds team budget!");
    sellPlayer(activePlayer.id, team.id, Number(bidAmount));
    setActivePlayerId(null);
    setSelectedTeam("");
    setBidAmount("");
  };

  const handleUnsold = () => {
    if (!activePlayer) return alert("Select a player first");
    markUnsold(activePlayer.id);
    setActivePlayerId(null);
    setSelectedTeam("");
    setBidAmount("");
  };

  // Re-bid unsold: move player back to pending
  const handleRebid = (playerId) => {
    // We'll just select them — sell/unsold handles the rest
    selectPlayer(playerId);
  };

  const PlayerRow = ({ p, isActive, showRebid }) => (
    <div
      onClick={() => selectPlayer(p.id)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 8px", borderRadius: 8, cursor: "pointer",
        marginBottom: 6,
        background: isActive ? "#2a2200" : "transparent",
        border: isActive ? "1px solid #c9a800" : "1px solid transparent",
        transition: "all 0.2s"
      }}
    >
      {p.photo
        ? <img src={p.photo} alt={p.name} style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", flexShrink: 0, opacity: showRebid ? 0.6 : 1 }} />
        : <div style={{ width: 38, height: 38, borderRadius: "50%", background: showRebid ? "#2a1a1a" : "#333", flexShrink: 0 }} />}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: showRebid ? "#ccc" : "#f0f0f0" }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "#888" }}>{p.role} · ₹{p.basePrice}L</div>
      </div>
      {isActive
        ? <span style={{ color: "#c9a800", fontSize: 12, flexShrink: 0 }}>Selected</span>
        : showRebid
          ? <span style={{ fontSize: 11, color: "#c9a800", border: "1px solid #c9a800", borderRadius: 4, padding: "2px 6px", flexShrink: 0 }}>Re-bid</span>
          : null}
    </div>
  );

  return (
    <div className="page">
      <h2 className="gold" style={{ marginBottom: 20 }}>Live Bidding</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 28 }}>

        {/* LEFT — Pending Players */}
        <div className="card" style={{ maxHeight: 520, display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: 14 }}>
            Pending
            <span style={{ fontSize: 13, color: "#888", fontWeight: 400, marginLeft: 8 }}>({pendingPlayers.length})</span>
          </h3>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {pendingPlayers.length === 0
              ? <p style={{ color: "#666", fontSize: 13 }}>No pending players.</p>
              : pendingPlayers.map(p => (
                <PlayerRow key={p.id} p={p} isActive={activePlayerId === p.id} showRebid={false} />
              ))}
          </div>
        </div>

        {/* MIDDLE — Bid Panel */}
        <div className="card" style={{ textAlign: "center" }}>
          {!activePlayer ? (
            <div style={{ paddingTop: 60, color: "#555" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>👈</div>
              <p style={{ fontSize: 14 }}>Select any player from either list to start bidding</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
                {activePlayer.status === "unsold" ? "Re-Bidding" : "Now Bidding"}
              </div>
              {activePlayer.status === "unsold" && (
                <div style={{ background: "#2a1a1a", border: "1px solid #c0392b", borderRadius: 6, padding: "6px 12px", fontSize: 12, color: "#f44336", marginBottom: 12 }}>
                  Previously Unsold — Re-entering auction
                </div>
              )}
              {activePlayer.photo
                ? <img src={activePlayer.photo} alt={activePlayer.name} style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", marginBottom: 12, border: "3px solid #c9a800" }} />
                : <div style={{ width: 90, height: 90, borderRadius: "50%", background: "#333", margin: "0 auto 12px", border: "3px solid #c9a800" }} />}
              <h2 style={{ marginBottom: 4 }}>{activePlayer.name}</h2>
              <p style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>{activePlayer.role} · {activePlayer.country}</p>
              <p className="gold" style={{ fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Base: ₹{activePlayer.basePrice}L</p>

              <label className="label" style={{ textAlign: "left" }}>Bid Amount (₹ lakhs)</label>
              <input
                className="input"
                type="number"
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                placeholder={`Min ₹${activePlayer.basePrice}L`}
                style={{ marginBottom: 12 }}
              />
              <label className="label" style={{ textAlign: "left" }}>Assign to Team</label>
              <select className="input" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} style={{ marginBottom: 20 }}>
                <option value="">Select team...</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} (₹{t.budget}L left)</option>
                ))}
              </select>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button className="btn btn-gold" onClick={handleSell}>SOLD ✓</button>
                <button className="btn btn-red" onClick={handleUnsold}>UNSOLD ✗</button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT — Unsold Players */}
        <div className="card" style={{ maxHeight: 520, display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: 14, color: "#f44336" }}>
            Unsold
            <span style={{ fontSize: 13, color: "#888", fontWeight: 400, marginLeft: 8 }}>({unsoldPlayers.length})</span>
          </h3>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>Click any unsold player to re-enter them in bidding.</p>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {unsoldPlayers.length === 0
              ? <p style={{ color: "#666", fontSize: 13 }}>No unsold players yet.</p>
              : unsoldPlayers.map(p => (
                <PlayerRow key={p.id} p={p} isActive={activePlayerId === p.id} showRebid={activePlayerId !== p.id} />
              ))}
          </div>
        </div>

      </div>

      {/* Team Budgets */}
      <h3 style={{ marginBottom: 14 }}>Team Budgets</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {teams.map(t => (
          <div key={t.id} className="card" style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              {t.logo
                ? <img src={t.logo} alt={t.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }} />
                : <div style={{ width: 36, height: 36, borderRadius: 6, background: "#333" }} />}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>Squad: {t.squad.length}</div>
              </div>
            </div>
            <div style={{ background: "#111", borderRadius: 6, height: 8, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "#c9a800",
                width: `${Math.max(0, (t.budget / (t.budget + t.spent)) * 100)}%`,
                transition: "width 0.5s"
              }} />
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>₹{t.budget}L left · ₹{t.spent}L spent</div>
          </div>
        ))}
      </div>
    </div>
  );
}