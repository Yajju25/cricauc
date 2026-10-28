import { useState } from "react";
import { useAuction } from "../context/AuctionContext";

export default function SetupTeams() {
  const { teams, addTeam, removeTeam } = useAuction();
  const [form, setForm] = useState({ name: "", logo: "", budget: "" });

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!form.name || !form.budget) return alert("Name and budget required");
    addTeam(form);
    setForm({ name: "", logo: "", budget: "" });
  };

  return (
    <div className="page">
      <h2 className="gold" style={{ marginBottom: 20 }}>Manage Teams</h2>
      <div className="grid-2" style={{ gap: 24 }}>
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Add Team</h3>
          <label className="label">Team Name</label>
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ marginBottom: 12 }} />
          <label className="label">Budget (₹ lakhs)</label>
          <input className="input" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} style={{ marginBottom: 12 }} />
          <label className="label">Team Logo</label>
          <input type="file" accept="image/*" onChange={handleLogo} style={{ marginBottom: 16, color: "#aaa", fontSize: 13 }} />
          {form.logo && <img src={form.logo} alt="logo" style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />}
          <button className="btn btn-gold" style={{ width: "100%" }} onClick={handleAdd}>Add Team</button>
        </div>
        <div>
          {teams.length === 0 && <p style={{ color: "#666" }}>No teams added yet.</p>}
          {teams.map(t => (
            <div key={t.id} className="card flex" style={{ marginBottom: 12, justifyContent: "space-between" }}>
              <div className="flex">
                {t.logo ? <img src={t.logo} alt={t.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} /> : <div style={{ width: 44, height: 44, background: "#333", borderRadius: 8 }} />}
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "#aaa" }}>Budget: ₹{t.budget}L</div>
                </div>
              </div>
              <button className="btn btn-red" style={{ padding: "6px 12px" }} onClick={() => removeTeam(t.id)}>Remove</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}