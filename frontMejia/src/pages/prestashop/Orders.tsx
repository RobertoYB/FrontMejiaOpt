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
  const [selectedOrder, setSelectedOrder] = useState([]);
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

  return (
    <div>
      <h1>Ordenes Prestashop</h1>
      <ul>
        {order.map((order) => (
          <li key={order.id}>{order.reference}</li>
        ))}
      </ul>
    </div>
  );
}
