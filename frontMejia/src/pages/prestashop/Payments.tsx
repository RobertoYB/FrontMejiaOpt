import { useEffect, useState } from "react";
import axios from "axios";

interface Payment {
  id: number;
  order_reference: string;
  amount: number;
  payment_method: string;
  transaction_id: number;
  date_add: string;
}

function Row({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}
    >
      <span style={{ color: color }}>{label}</span>
      <span style={{ fontWeight: 500, color: color }}>{value}</span>
    </div>
  );
}

export default function Payments() {
  const [payment, setPayment] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "http://localhost:8000/api/prestashop/payments/",
        );
        setPayment(res.data.data.order_payments);
      } catch (err) {
        if (axios.isCancel?.(err) || err.name === "CanceledError") return;
        if (err.response) {
          setError(
            `Server error: ${err.response.status} ${err.response.statusText}`,
          );
        } else if (err.request) {
          setError("Network error: no response from server");
        } else {
          setError(`Request error: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const cardColors = isDark
    ? ["#1f2937", "#111827", "#064e3b", "#1e3a5f"]
    : ["#ffffff", "#f3f4f6", "#e1f5ee", "#e6f1fb"];

  const letterColors = isDark
    ? ["#f9fafb", "#f9fafb", "#ecfdf5", "#eff6ff"]
    : ["#111827", "#111827", "#065f46", "#1e3a5f"];

  if (loading) return <p>Loading payments…</p>;
  if (error) return <p role="alert">{error}</p>;
  return (
    <div>
      <h1>Pagos Prestashop</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {payment.map((p, i) => (
          <div
            key={p.id}
            style={{
              border: "0.5px solid #e5e7eb",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              background: cardColors[i % cardColors.length],
              color: letterColors[i % letterColors.length],
            }}
          >
            <p
              style={{
                fontWeight: 500,
                fontSize: 15,
                marginBottom: 12,
                color: letterColors[i % letterColors.length],
              }}
            >
              Pago #{p.id}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Row
                label="Referencia"
                value={p.order_reference}
                color={letterColors[i % letterColors.length]}
              />
              <Row
                label="Monto"
                value={`$${p.amount}`}
                color={letterColors[i % letterColors.length]}
              />
              <Row
                label="Método"
                value={p.payment_method}
                color={letterColors[i % letterColors.length]}
              />
              <Row
                label="Transacción"
                value={p.transaction_id}
                color={letterColors[i % letterColors.length]}
              />
              <Row
                label="Fecha"
                value={p.date_add}
                color={letterColors[i % letterColors.length]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
