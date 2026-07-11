import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3000";

type Screen = "form" | "success" | "cancel";

export default function PaymentGateway() {
  const [screen, setScreen] = useState<Screen>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if Stripe redirected back with a status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") setScreen("success");
    if (status === "cancel") setScreen("cancel");
  }, []);

  const handleProceed = async () => {
    setError("");
    if (!name || !email || !phone || !amount) {
      setError("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phonenumber: phone, amount: Number(amount) }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();
      // Redirect to Stripe — user leaves this page
      window.location.href = data.url;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const reset = () => {
    setScreen("form");
    setName(""); setEmail(""); setPhone(""); setAmount("");
    window.history.replaceState({}, "", window.location.pathname);
  };

  return (
    <div style={s.root}>
      {/* FORM */}
      {screen === "form" && (
        <div style={s.card}>
          <p style={s.title}>Create payment</p>
          <p style={s.sub}>Enter customer details to begin</p>
          <Field label="Name" type="text" value={name} onChange={setName} placeholder="Ravi Kumar" />
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="customer@email.com" />
          <Field label="Phone" type="tel" value={phone} onChange={setPhone} placeholder="+91 98765 43210" />
          <Field label="Amount (₹)" type="number" value={amount} onChange={setAmount} placeholder="1499" />
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} onClick={handleProceed} disabled={loading}>
            {loading ? "Redirecting..." : "Proceed to payment →"}
          </button>
          <p style={s.footnote}>You'll be redirected to Stripe's secure checkout</p>
        </div>
      )}

      {/* SUCCESS — shown after Stripe redirects back */}
      {screen === "success" && (
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={s.successIcon}>✓</div>
          <p style={s.title}>Payment successful</p>
          <p style={s.sub}>Your transaction has been confirmed</p>
          <button style={s.btn} onClick={reset}>New payment</button>
        </div>
      )}

      {/* CANCEL — shown if user cancels on Stripe */}
      {screen === "cancel" && (
        <div style={{ ...s.card, textAlign: "center" }}>
          <div style={s.cancelIcon}>✕</div>
          <p style={s.title}>Payment cancelled</p>
          <p style={s.sub}>Your payment was not completed</p>
          <button style={s.btn} onClick={reset}>Try again</button>
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
  footnote: { fontSize: 11, color: "#aaa", textAlign: "center", marginTop: "0.75rem" },
  successIcon: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#dcfce7",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 1rem", fontSize: 22, color: "#16a34a",
  },
  cancelIcon: {
    width: 52, height: 52, borderRadius: "50%",
    background: "#fee2e2",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 1rem", fontSize: 22, color: "#dc2626",
  },
  error: { fontSize: 12, color: "#dc2626", marginTop: "0.5rem" },
};

const css = `
  .pay-input:focus { border-color: #111 !important; background: #fff !important; }
  button:hover { opacity: 0.85; }
`;