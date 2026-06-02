import axios from "axios";

const API_URL = "http://localhost:8000";

export async function getPrestashopProducts() {
  const response = await axios.get(`${API_URL}/api/prestashop/products/`);
  return response.data;
}

export async function getPrestashopProductBySku(sku: string) {
  const cleanSku = encodeURIComponent(sku.trim());

  const response = await axios.get(
    `${API_URL}/api/prestashop/products/${cleanSku}`,
  );

  return response.data;
}
