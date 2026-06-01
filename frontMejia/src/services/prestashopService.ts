import axios from "axios";

const API_URL = "http://localhost:8000";

export async function getPrestashopProducts() {
  const response = await axios.get(`${API_URL}/prestashop/products`);
  return response.data;
}

export async function getPrestashopProductBySku(sku: string) {
  const response = await axios.get(`${API_URL}/prestashop/products/sku/${sku}`);
  return response.data;
}
