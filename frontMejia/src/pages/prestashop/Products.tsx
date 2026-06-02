import { useState } from "react";
import {
  getPrestashopProducts,
  getPrestashopProductBySku,
} from "../../services/prestashopService";

type Product = {
  id?: number | string;
  id_product?: number | string;
  id_category_default?: number | string;
  quantity?: number | string;
  name?: unknown;
  reference?: string;
  price?: string | number;
  wholesale_price?: string | number;
  active?: boolean | string | number;
  date_add?: string;
  date_upd?: string;
  [key: string]: unknown;
};

type PrestashopResponse = {
  status?: string;
  data?: {
    products?: Product[];
  };
  errors?: unknown[];
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sku, setSku] = useState("");

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSku, setLoadingSku] = useState(false);

  const [productsError, setProductsError] = useState("");
  const [skuError, setSkuError] = useState("");

  const getTextValue = (value: unknown): string => {
    if (value === null || value === undefined) return "";

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        const text = getTextValue(item);
        if (text.trim() !== "") return text;
      }

      return "";
    }

    if (typeof value === "object") {
      const objectValue = value as Record<string, unknown>;

      return (
        getTextValue(objectValue.value) ||
        getTextValue(objectValue.text) ||
        getTextValue(objectValue._) ||
        ""
      );
    }

    return "";
  };

  const formatPrice = (price: unknown) => {
    const value = Number(price);

    if (Number.isNaN(value)) {
      return getTextValue(price) || "Sin precio";
    }

    return `$${value.toFixed(2)}`;
  };

  const getProductId = (product: Product) => {
    return product.id || product.id_product || "Sin ID";
  };

  const getProductName = (product: Product) => {
    return getTextValue(product.name) || "Sin nombre";
  };

  const getProductSku = (product: Product) => {
    return product.reference || "Sin SKU";
  };

  const getProductPrice = (product: Product) => {
    return formatPrice(product.price);
  };

  const getProductStock = (product: Product) => {
    return product.quantity ?? "Sin stock";
  };

  const getProductStatus = (product: Product) => {
    if (
      product.active === true ||
      product.active === "1" ||
      product.active === 1
    ) {
      return "Activo";
    }

    return "Inactivo";
  };

  const extractProductsFromResponse = (
    response: PrestashopResponse,
  ): Product[] => {
    return response.data?.products || [];
  };

  const handleGetProducts = async () => {
    setLoadingProducts(true);
    setProductsError("");
    setProducts([]);

    try {
      const data = await getPrestashopProducts();
      console.log("Respuesta productos Prestashop:", data);

      const productsData = extractProductsFromResponse(data);

      if (productsData.length === 0) {
        setProductsError(
          "La API respondió, pero no se encontraron productos para mostrar",
        );
      }

      setProducts(productsData);
    } catch (error) {
      console.error("Error al obtener productos:", error);
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
      console.log("Respuesta producto por SKU:", data);

      const productsData = extractProductsFromResponse(data);

      if (productsData.length > 0) {
        setSelectedProduct(productsData[0]);
      } else {
        setSkuError(
          "La API respondió, pero no se encontró información del producto",
        );
      }
    } catch (error) {
      console.error("Error al buscar producto por SKU:", error);
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
                <div className="alert alert-warning">{productsError}</div>
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
                        <th>Stock</th>
                        <th>Estado</th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product, index) => (
                        <tr key={`${getProductId(product)}-${index}`}>
                          <td>{getProductId(product)}</td>
                          <td>{getProductName(product)}</td>
                          <td>{getProductSku(product)}</td>
                          <td>{getProductPrice(product)}</td>
                          <td>{getProductStock(product)}</td>
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
                  placeholder="Ejemplo: CRU-0020"
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

              {skuError && (
                <div className="alert alert-warning">{skuError}</div>
              )}

              {selectedProduct && (
                <div className="card border-success">
                  <div className="card-header fw-bold">Producto encontrado</div>

                  <div className="card-body">
                    <h5 className="card-title">
                      {getProductName(selectedProduct)}
                    </h5>

                    <p>
                      <strong>ID:</strong> {getProductId(selectedProduct)}
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
                      <strong>Stock:</strong> {getProductStock(selectedProduct)}
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
