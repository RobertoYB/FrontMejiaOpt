import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  reference: string;
  date_order: string;
  amount_total: number;
  state: string;
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
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
      }}
    >
      <span style={{ color }}>{label}</span>
      <span style={{ fontWeight: 500, color }}>{value}</span>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:8000/api/odoo/orders/", {
          signal: controller.signal,
        });
        setOrders(response.data);
      } catch (err: any) {
        if (axios.isCancel?.(err) || err.name === "CanceledError") return;
        
        if (err.response) {
          setError(
            `Server error: ${err.response.status} ${err.response.statusText}`
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

    return () => {
      controller.abort();
    };
  }, []);

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const cardColors = isDark
    ? ["#1f2937", "#111827", "#064e3b", "#1e3a5f"]
    : ["#ffffff", "#f3f4f6", "#e1f5ee", "#e6f1fb"];

  const letterColors = isDark
    ? ["#f9fafb", "#f9fafb", "#ecfdf5", "#eff6ff"]
    : ["#111827", "#111827", "#065f46", "#1e3a5f"];

  if (loading) return <p>Cargando órdenes...</p>;

  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <h1>Órdenes Odoo</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {orders.map((order, i) => (
          <div
            key={order.id}
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
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 12,
                color: letterColors[i % letterColors.length],
              }}
            >
              {order.reference}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Row
                label="ID"
                value={order.id}
                color={letterColors[i % letterColors.length]}
              />

              <Row
                label="Fecha"
                value={order.date_order}
                color={letterColors[i % letterColors.length]}
              />

              <Row
                label="Total"
                value={`$${parseFloat(order.amount_total.toString()).toFixed(2)}`}
                color={letterColors[i % letterColors.length]}
              />

              <Row
                label="Estado"
                value={order.state}
                color={letterColors[i % letterColors.length]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
