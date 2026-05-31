import { useState } from "react";

const API_BASE = "http://localhost:8000";

type Screen = "form" | "processor" | "processing" | "success";

export default function PaymentGateway() {
  const [screen, setScreen] = useState<Screen>("form");
  const[name , setName] = useState("Ravi Kumar");
  const [email, setEmail] = useState("ravi@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [amount, setAmount] = useState("1499");
  const [sessionId, setSessionId] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const handleProceed = async () => {
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phonenumber: phone, amount: Number(amount) }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const data = await res.json();
      setSessionId(data.order.sessionId);

      // Redirect to Stripe checkout URL
      window.location.href = data.url;
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const handlePay = () => {
    setScreen("processing");
    setTimeout(() => {
      setSessionId("pay_" + Math.random().toString(36).substr(2, 16).toUpperCase());
      setTime(new Date().toLocaleTimeString());
      setScreen("success");
    }, 2200);
  };

  return (
    <div style={s.root}>
      {/* SCREEN 1 — Form */}
      {screen === "form" && (
        <div style={s.card}>
          <p style={s.title}>Create payment</p>
          <p style={s.sub}>Enter customer details to begin</p>
          <Field label="Name" type="text" value={name} onChange={setName} placeholder="Ravi Kumar" />
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="customer@email.com" />
          <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
          <Field label="Amount (₹)" type="number" value={amount} onChange={setAmount} placeholder="1499" />

          {error && <p style={s.error}>{error}</p>}

          <button style={s.btn} onClick={handleProceed}>Proceed to payment →</button>
        </div>
      )}

      {/* SCREEN 2 — Processor (simulated) */}
      {screen === "processor" && (
        <div style={s.card}>
          <span style={s.back} onClick={() => setScreen("form")}>← back</span>
          <p style={s.title}>
            Payment page{" "}
            <span style={s.badge}>Processor</span>
          </p>
          <p style={s.sub}>Simulating Razorpay / Stripe checkout</p>

          <div style={s.summary}>
            <Row label="Product" value="Premium plan" />
            <Row label="Tax (18%)" value="₹ 229.00" />
            <Row label="Total" value="₹ 1,499.00" bold />
          </div>

          <Field label="Card number" type="text" value="4242 4242 4242 4242" onChange={() => {}} placeholder="4242 4242 4242 4242" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Expiry" type="text" value="12/27" onChange={() => {}} placeholder="MM/YY" />
            <Field label="CVV" type="text" value="123" onChange={() => {}} placeholder="•••" />
          </div>

          <button style={s.btn} onClick={handlePay}>Pay ₹ 1,499.00</button>
        </div>
      )}

      {/* SCREEN 3 — Processing */}
      {screen === "processing" && (
        <div style={{ ...s.card, textAlign: "center" }}>
          <p style={s.title}>Processing payment</p>
          <p style={s.sub}>Please wait, do not close this window</p>
          <div style={s.spinner} />
          <p style={{ fontSize: 13, color: "#888" }}>Verifying with bank...</p>
        </div>
      )}

      {/* SCREEN 4 — Success */}
      {screen === "success" && (
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={s.successIcon}>✓</div>
          <p style={s.title}>Payment successful</p>
          <p style={{ ...s.sub, marginBottom: "0.5rem" }}>Your transaction is confirmed</p>

          <div style={s.pid}>
            payment_id: <span style={{ color: "#111", fontWeight: 500 }}>{sessionId}</span>
          </div>

          <div style={s.grid}>
            <InfoCell label="Amount" value="₹ 1,499.00" />
            <InfoCell label="Status" value="Success" valueStyle={{ color: "#16a34a" }} />
            <InfoCell label="Email" value={email} />
            <InfoCell label="Time" value={time} />
          </div>

          <button style={{ ...s.btn, marginTop: "1.5rem" }} onClick={() => setScreen("form")}>
            New payment
          </button>
        </div>
      )}

      <style>{css}</style>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div style={s.field}>
      <label style={s.label}>{label}</label>
      <input
        style={s.input}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="pay-input"
      />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ ...s.row, ...(bold ? { fontWeight: 500, fontSize: 15, borderBottom: "none" } : {}) }}>
      <span style={{ color: "#888" }}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function InfoCell({ label, value, valueStyle }: { label: string; value: string; valueStyle?: React.CSSProperties }) {
  return (
    <div style={{ textAlign: "left" }}>
      <p style={{ fontSize: 12, color: "#888" }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 500, ...valueStyle }}>{value}</p>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
    fontFamily: "system-ui, sans-serif",
    padding: "2rem 1.5rem",
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 16,
    padding: "1.5rem",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  title: { fontSize: 18, fontWeight: 500, marginBottom: 4, color: "#111" },
  sub: { fontSize: 13, color: "#888", marginBottom: "1.5rem" },
  field: { marginBottom: "1rem" },
  label: { fontSize: 13, color: "#888", marginBottom: 6, display: "block" },
  input: {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    fontSize: 14,
    color: "#111",
    outline: "none",
    background: "#fafafa",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    padding: 10,
    background: "#111",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  back: { fontSize: 13, color: "#888", cursor: "pointer", marginBottom: "1.25rem", display: "inline-flex", alignItems: "center", gap: 4 },
  badge: { fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#eff6ff", color: "#3b82f6", marginLeft: 8 },
  summary: { background: "#fafafa", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" },
  row: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 },
  spinner: {
    width: 36, height: 36,
    border: "3px solid #e5e5e5",
    borderTopColor: "#111",
    borderRadius: "50%",
    margin: "1.5rem auto",
    animation: "spin 0.8s linear infinite",
  },
  successIcon: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#dcfce7",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 1rem", fontSize: 22, color: "#16a34a",
  },
  pid: {
    fontSize: 12, fontFamily: "monospace",
    background: "#fafafa", border: "1px solid #e5e5e5",
    borderRadius: 8, padding: "8px 12px",
    marginTop: "1rem", color: "#888", wordBreak: "break-all",
  },
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
    marginTop: "1.5rem", paddingTop: "1rem",
    borderTop: "1px solid #e5e5e5",
  },
  error: { fontSize: 12, color: "#dc2626", marginTop: "0.5rem" },
};

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .pay-input:focus { border-color: #111 !important; background: #fff !important; }
  button:hover { opacity: 0.85; }
`;