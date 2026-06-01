import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  id_customer: number;
  date_add: string;
  total_paid: string;
  reference: string;
}

//Referencia (por si acaso): https://www.digitalocean.com/community/tutorials/react-axios-react

export default function Orders() {
  const [order, setOrder] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "http://localhost:8000/api/prestashop/orders/",
        );
        setOrder(res.data.data.orders);
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

  async function selectOrder(reference: string) {
    const res = await axios.get(
      `http://localhost:8000/api/prestashop/orders/ref/${reference}`,
    );
    setSelectedOrder(res.data.data.orders);
  }

  if (loading) return <p>Loading orders…</p>;
  if (error) return <p role="alert">{error}</p>;

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const cardColors = isDark
    ? ["#1f2937", "#111827", "#064e3b", "#1e3a5f"]
    : ["#ffffff", "#f3f4f6", "#e1f5ee", "#e6f1fb"];

  const letterColors = isDark
    ? ["#f9fafb", "#f9fafb", "#ecfdf5", "#eff6ff"]
    : ["#111827", "#111827", "#065f46", "#1e3a5f"];

  return (
    <div>
      <h1>Órdenes Prestashop</h1>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {order.map((o, i) => {
            const bg = cardColors[i % cardColors.length];
            const color = letterColors[i % letterColors.length];
            const isSelected = selectedOrder[0]?.reference === o.reference;

            return (
              <div
                key={o.id}
                onClick={() => selectOrder(o.reference)}
                style={{
                  border: isSelected
                    ? "2px solid #3b82f6"
                    : "0.5px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  background: bg,
                  color: color,
                  cursor: "pointer",
                }}
              >
                <p
                  style={{
                    fontWeight: 500,
                    fontSize: 15,
                    marginBottom: 8,
                    color,
                  }}
                >
                  {o.reference}
                </p>
                <p
                  style={{ fontSize: 13, color, opacity: 0.7, marginBottom: 4 }}
                >
                  ID: {o.id}
                </p>
                <p style={{ fontSize: 14, fontWeight: 500, color }}>
                  ${parseFloat(o.total_paid).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {selectedOrder.length > 0 && (
          <div
            style={{
              flex: 1,
              border: "0.5px solid #e5e7eb",
              borderRadius: 12,
              padding: "1.25rem",
              background: isDark ? "#1f2937" : "#ffffff",
              color: isDark ? "#f9fafb" : "#111827",
              position: "sticky",
              top: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <p style={{ fontWeight: 500, fontSize: 16, margin: 0 }}>
                Detalle — {selectedOrder[0].reference}
              </p>
              <button
                onClick={() => setSelectedOrder([])}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 18,
                  color: isDark ? "#f9fafb" : "#111827",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                flex: selectedOrder.length > 0 ? 1 : undefined,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {[
                { label: "ID orden", value: selectedOrder[0].id },
                { label: "ID cliente", value: selectedOrder[0].id_customer },
                {
                  label: "Total pagado",
                  value: `$${parseFloat(selectedOrder[0].total_paid).toFixed(2)}`,
                },
                { label: "Fecha", value: selectedOrder[0].date_add },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: isDark ? "#111827" : "#f3f4f6",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
