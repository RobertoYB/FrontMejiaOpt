import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  list_price: number;
  default_code: string | null;
}

interface Stock {
  id: number;
  qty_available: number;
}

interface ProductWithStock {
  id: number;
  name: string;
  list_price: number;
  default_code: string | null;
  qty_available: number;
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

export default function Products() {
  const [products, setProducts] = useState<ProductWithStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productsResponse = await axios.get(
          "http://localhost:8000/api/odoo/products/"
        );

        await new Promise(resolve => setTimeout(resolve, 1000));

        const stockResponse = await axios.get(
          "http://localhost:8000/api/odoo/stock/"
        );

        const productsData: Product[] = productsResponse.data;
        const stockData: Stock[] = stockResponse.data;

        const mergedProducts: ProductWithStock[] = productsData.map(
          (product) => {
            const stock = stockData.find(
              (s) => s.id === product.id
            );

            return {
              ...product,
              qty_available: stock?.qty_available ?? 0,
            };
          }
        );

        setProducts(mergedProducts);
      } catch (err: any) {
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
  }, []);

  const isDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const cardColors = isDark
    ? ["#1f2937", "#111827", "#064e3b", "#1e3a5f"]
    : ["#ffffff", "#f3f4f6", "#e1f5ee", "#e6f1fb"];

  const letterColors = isDark
    ? ["#f9fafb", "#f9fafb", "#ecfdf5", "#eff6ff"]
    : ["#111827", "#111827", "#065f46", "#1e3a5f"];

  if (loading) return <p>Cargando productos...</p>;

  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <h1>Productos Odoo</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 16,
        }}
      >
        {products.map((product, i) => (
          <div
            key={product.id}
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
              {product.name}
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
                value={product.id}
                color={letterColors[i % letterColors.length]}
              />

              <Row
                label="SKU"
                value={product.default_code ?? "Sin SKU"}
                color={letterColors[i % letterColors.length]}
              />

              <Row
                label="Precio"
                value={`$${product.list_price.toFixed(2)}`}
                color={letterColors[i % letterColors.length]}
              />

              <Row
                label="Stock"
                value={product.qty_available}
                color={letterColors[i % letterColors.length]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}