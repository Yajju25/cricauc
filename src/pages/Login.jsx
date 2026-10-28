import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuction } from "../context/AuctionContext";

export default function Login() {
  const { login } = useAuction();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [err, setErr] = useState("");

  const handleSubmit = () => {
    if (login(form.username, form.password)) nav("/dashboard");
    else setErr("Invalid credentials. Try admin / admin123");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ width: 360 }}>
        <h2 className="gold" style={{ marginBottom: 24, textAlign: "center" }}>🏏 Auction Login</h2>
        <label className="label">Username</label>
        <input className="input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} style={{ marginBottom: 14 }} />
        <label className="label">Password</label>
        <input className="input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ marginBottom: 20 }} />
        {err && <p style={{ color: "#e74c3c", fontSize: 13, marginBottom: 12 }}>{err}</p>}
        <button className="btn btn-gold" style={{ width: "100%" }} onClick={handleSubmit}>Login</button>
        <p style={{ fontSize: 12, color: "#666", textAlign: "center", marginTop: 12 }}>Default: admin / admin123</p>
      </div>
    </div>
  );
}