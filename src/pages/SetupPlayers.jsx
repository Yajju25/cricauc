import { useState } from "react";
import { useAuction } from "../context/AuctionContext";

const ROLES = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

export default function SetupPlayers() {
  const { players, addPlayer, removePlayer } = useAuction();
  const [form, setForm] = useState({ name: "", role: "Batsman", country: "", basePrice: "", photo: "" });

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!form.name || !form.basePrice) return alert("Name and base price required");
    addPlayer(form);
    setForm({ name: "", role: "Batsman", country: "", basePrice: "", photo: "" });
  };

  const statusColor = { pending: "#c9a800", sold: "#4caf50", unsold: "#f44336" };

  return (
    <div className="page">
      <h2 className="gold" style={{ marginBottom: 20 }}>Manage Players</h2>
      <div className="grid-2" style={{ gap: 24, marginBottom: 28 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Add Player</h3>
          <label className="label">Player Name</label>
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 12 }} />
          <label className="label">Role</label>
          <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ marginBottom: 12 }}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
          <label className="label">Country</label>
          <input className="input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={{ marginBottom: 12 }} />
          <label className="label">Base Price (₹ lakhs)</label>
          <input className="input" type="number" value={form.basePrice} onChange={e => setForm({ ...form, basePrice: e.target.value })} style={{ marginBottom: 12 }} />
          <label className="label">Photo</label>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ marginBottom: 10, color: "#aaa", fontSize: 13 }} />
          {form.photo && <img src={form.photo} alt="preview" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />}
          <button className="btn btn-gold" style={{ width: "100%" }} onClick={handleAdd}>Add Player</button>
        </div>
        <div style={{ fontSize: 14, color: "#aaa" }}>
          <p>Total players: <strong style={{ color: "#f0f0f0" }}>{players.length}</strong></p>
          <p style={{ marginTop: 6 }}>Sold: <span style={{ color: "#4caf50" }}>{players.filter(p => p.status === "sold").length}</span></p>
          <p style={{ marginTop: 6 }}>Unsold: <span style={{ color: "#f44336" }}>{players.filter(p => p.status === "unsold").length}</span></p>
          <p style={{ marginTop: 6 }}>Pending: <span style={{ color: "#c9a800" }}>{players.filter(p => p.status === "pending").length}</span></p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {players.map(p => (
          <div key={p.id} className="card" style={{ textAlign: "center", position: "relative" }}>
            {p.photo ? <img src={p.photo} alt={p.name} style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }} />
              : <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#333", margin: "0 auto 10px" }} />}
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{p.role} · {p.country}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 8 }}>Base: ₹{p.basePrice}L</div>
            <span className={`badge badge-${p.status}`}>{p.status}</span>
            {p.status === "pending" && (
              <button className="btn btn-red" style={{ position: "absolute", top: 8, right: 8, padding: "3px 8px", fontSize: 12 }} onClick={() => removePlayer(p.id)}>✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}