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

  if (loading) return <p>Loading payments…</p>;
  if (error) return <p role="alert">{error}</p>;
  return (
    <div>
      <h1>Pagos Prestashop</h1>
      <ul>
        {payment.map((payment) => (
          <li key={payment.id}>{payment.amount}</li>
        ))}
      </ul>
    </div>
  );
}
