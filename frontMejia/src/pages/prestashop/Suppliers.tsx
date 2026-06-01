import { useEffect, useState } from "react";
import axios from "axios";

interface Supplier {
  id: number;
  name: string;
  active: number;
  city: string;
  phone: string;
  email: string;
}

//Referencia (por si acaso): https://www.digitalocean.com/community/tutorials/react-axios-react

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          "http://localhost:8000/api/prestashop/suppliers/",
        );
        setSuppliers(res.data.data.suppliers);
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

  async function selectSupplier(id: number) {
    const res = await axios.get(
      `http://localhost:8000/api/prestashop/suppliers/${id}`,
    );
    setSelectedSupplier(res.data.data.suppliers[0]);
  }

  if (loading) return <p>Cargando proveedores…</p>;
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
      <h1>Proveedores Prestashop</h1>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {suppliers.map((s, i) => {
            const bg = cardColors[i % cardColors.length];
            const color = letterColors[i % letterColors.length];
            const isSelected = selectedSupplier?.id === s.id;

            return (
              <div
                key={s.id}
                onClick={() => selectSupplier(s.id)}
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
                  {s.name}
                </p>
                <p
                  style={{ fontSize: 13, color, opacity: 0.7, marginBottom: 4 }}
                >
                  {s.phone || "Sin teléfono"}
                </p>
                <p style={{ fontSize: 12, color, opacity: 0.6 }}>
                  {s.city || "Sin ciudad"}
                </p>
              </div>
            );
          })}
        </div>

        {selectedSupplier && (
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
                Detalle — {selectedSupplier.name}
              </p>
              <button
                onClick={() => setSelectedSupplier(null)}
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
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              {[
                { label: "ID Proveedor", value: selectedSupplier.id },
                { label: "Nombre", value: selectedSupplier.name },
                {
                  label: "Email",
                  value: selectedSupplier.email || "Sin email",
                },
                {
                  label: "Teléfono",
                  value: selectedSupplier.phone || "Sin teléfono",
                },
                {
                  label: "Ciudad",
                  value: selectedSupplier.city || "No especificada",
                },
                {
                  label: "Estado",
                  value: selectedSupplier.active === 1 ? "Activo" : "Inactivo",
                },
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
