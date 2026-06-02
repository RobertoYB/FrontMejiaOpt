import { useState } from "react";
import {
  getPrestashopProducts,
  getPrestashopProductBySku,
} from "../../services/prestashopService";

type Product = {
  id?: number | string;
  name?: string | { value?: string }[];
  nombre?: string;
  title?: string;
  reference?: string;
  sku?: string;
  clave?: string;
  clave_sku?: string;
  product_sku?: string;
  price?: string | number;
  precio?: string | number;
  regular_price?: string | number;
  product_price?: string | number;
  description?: string | { value?: string }[];
  description_short?: string | { value?: string }[];
  descripcion?: string;
  active?: boolean | string | number;
  status?: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sku, setSku] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSku, setLoadingSku] = useState(false);

  const [productsError, setProductsError] = useState("");
  const [skuError, setSkuError] = useState("");

  const getProductName = (product: Product) => {
    if (typeof product.name === "string") {
      return product.name;
    }

    if (Array.isArray(product.name)) {
      return product.name[0]?.value || "Sin nombre";
    }

    return product.nombre || product.title || "Sin nombre";
  };

  const getProductSku = (product: Product) => {
    return (
      product.reference ||
      product.sku ||
      product.clave ||
      product.clave_sku ||
      product.product_sku ||
      "Sin SKU"
    );
  };

  const getProductPrice = (product: Product) => {
    return (
      product.price ||
      product.precio ||
      product.regular_price ||
      product.product_price ||
      "Sin precio"
    );
  };

  const getProductDescription = (product: Product) => {
    if (typeof product.description === "string") {
      return product.description;
    }

    if (Array.isArray(product.description)) {
      return product.description[0]?.value || "Sin descripción";
    }

    if (typeof product.description_short === "string") {
      return product.description_short;
    }

    if (Array.isArray(product.description_short)) {
      return product.description_short[0]?.value || "Sin descripción";
    }

    return product.descripcion || "Sin descripción";
  };

  const getProductStatus = (product: Product) => {
    if (
      product.active === true ||
      product.active === "1" ||
      product.active === 1 ||
      product.status === "active"
    ) {
      return "Activo";
    }

    return "Inactivo";
  };

  const normalizeProductsResponse = (data: any): Product[] => {
    const productsData =
      data?.products || data?.productos || data?.data || data?.result || data;

    if (Array.isArray(productsData)) {
      return productsData;
    }

    if (productsData?.product) {
      return [productsData.product];
    }

    if (productsData?.producto) {
      return [productsData.producto];
    }

    return [];
  };

  const normalizeSingleProductResponse = (data: any): Product | null => {
    const productData =
      data?.product || data?.producto || data?.data || data?.result || data;

    if (Array.isArray(productData)) {
      return productData.length > 0 ? productData[0] : null;
    }

    if (productData && typeof productData === "object") {
      return productData;
    }

    return null;
  };

  const handleGetProducts = async () => {
    setLoadingProducts(true);
    setProductsError("");
    setProducts([]);

    try {
      const data = await getPrestashopProducts();
      const productsData = normalizeProductsResponse(data);
      setProducts(productsData);
    } catch (error) {
      console.error(error);
      setProductsError("No se pudieron obtener los productos de Prestashop");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearchBySku = async () => {
    if (sku.trim() === "") {
      setSkuError("Primero escribe una clave SKU o referencia");
      return;
    }

    setLoadingSku(true);
    setSkuError("");
    setSelectedProduct(null);

    try {
      const data = await getPrestashopProductBySku(sku);
      const productData = normalizeSingleProductResponse(data);

      if (productData) {
        setSelectedProduct(productData);
      } else {
        setSkuError("No se encontró información del producto");
      }
    } catch (error) {
      console.error(error);
      setSkuError("No se encontró el producto o hubo un error con la API");
    } finally {
      setLoadingSku(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="fw-bold">Productos Prestashop</h1>
        <p className="text-muted">
          Pantalla para consultar productos de Prestashop y buscar un producto
          específico por clave SKU o referencia.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              Obtener productos Prestashop
            </div>

            <div className="card-body">
              <p>
                Este apartado consume el endpoint que obtiene la lista de
                productos registrados en Prestashop.
              </p>

              <button
                className="btn btn-primary mb-3"
                onClick={handleGetProducts}
                disabled={loadingProducts}
              >
                {loadingProducts ? "Cargando..." : "Obtener productos"}
              </button>

              {productsError && (
                <div className="alert alert-danger">{productsError}</div>
              )}

              {products.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped align-middle">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>SKU / Referencia</th>
                        <th>Precio</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id || index}>
                          <td>{product.id || "Sin ID"}</td>
                          <td>{getProductName(product)}</td>
                          <td>{getProductSku(product)}</td>
                          <td>{getProductPrice(product)}</td>
                          <td>{getProductStatus(product)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                !loadingProducts && (
                  <p className="text-muted mb-0">
                    Todavía no hay productos cargados.
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              Obtener producto por clave SKU
            </div>

            <div className="card-body">
              <p>
                Este apartado permite buscar un producto específico de
                Prestashop usando su SKU o referencia.
              </p>

              <div className="mb-3">
                <label className="form-label">SKU / Referencia</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ejemplo: CRU-0010"
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                />
              </div>

              <button
                className="btn btn-success mb-3"
                onClick={handleSearchBySku}
                disabled={loadingSku}
              >
                {loadingSku ? "Buscando..." : "Buscar producto"}
              </button>

              {skuError && <div className="alert alert-danger">{skuError}</div>}

              {selectedProduct && (
                <div className="card border-success">
                  <div className="card-header fw-bold">Producto encontrado</div>

                  <div className="card-body">
                    <h5 className="card-title">
                      {getProductName(selectedProduct)}
                    </h5>

                    <p>
                      <strong>ID:</strong> {selectedProduct.id || "Sin ID"}
                    </p>

                    <p>
                      <strong>SKU / Referencia:</strong>{" "}
                      {getProductSku(selectedProduct)}
                    </p>

                    <p>
                      <strong>Precio:</strong>{" "}
                      {getProductPrice(selectedProduct)}
                    </p>

                    <p>
                      <strong>Descripción:</strong>{" "}
                      {getProductDescription(selectedProduct)}
                    </p>

                    <p>
                      <strong>Estado:</strong>{" "}
                      {getProductStatus(selectedProduct)}
                    </p>
                  </div>
                </div>
              )}

              {!selectedProduct && !loadingSku && (
                <p className="text-muted mb-0">
                  Aquí aparecerá el producto buscado por SKU.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
