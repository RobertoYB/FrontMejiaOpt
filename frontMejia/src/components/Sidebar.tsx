import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside
      className="bg-dark text-white d-flex flex-column p-3"
      style={{
        width: "280px",
        minHeight: "100vh",
      }}
    >
      <h3 className="fw-bold mb-4">
        API Mejía
      </h3>

      <small className="text-secondary mb-2">
        GENERAL
      </small>

      <Link className="nav-link text-white mb-2" to="/">
        Dashboard
      </Link>

      <small className="text-secondary mt-4 mb-2">
        ODOO
      </small>

      <Link className="nav-link text-white mb-2" to="/odoo/products">
        Productos
      </Link>

      <Link className="nav-link text-white mb-2" to="/odoo/orders">
        Órdenes
      </Link>

      <small className="text-secondary mt-4 mb-2">
        PRESTASHOP
      </small>

      <Link className="nav-link text-white mb-2" to="/prestashop/products">
        Productos
      </Link>

      <Link className="nav-link text-white mb-2" to="/prestashop/orders">
        Órdenes
      </Link>

      <Link className="nav-link text-white mb-2" to="/prestashop/customers">
        Clientes
      </Link>

      <Link className="nav-link text-white mb-2" to="/prestashop/payments">
        Pagos
      </Link>

      <Link className="nav-link text-white mb-2" to="/prestashop/suppliers">
        Proveedores
      </Link>
    </aside>
  );
}