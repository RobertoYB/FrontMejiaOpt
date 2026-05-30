export default function Dashboard() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="fw-bold">
          Bienvenido
        </h1>

        <p className="text-secondary">
          Panel central de integración ERP y Ecommerce.
        </p>
      </div>

      <div className="row g-4">

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3>Odoo</h3>

              <p className="text-secondary">
                Gestión ERP y sincronización empresarial.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h3>Prestashop</h3>

              <p className="text-secondary">
                Gestión de ecommerce y catálogo.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="row mt-4 g-4">

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Productos</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Órdenes</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5>Clientes</h5>
              <h2>0</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}