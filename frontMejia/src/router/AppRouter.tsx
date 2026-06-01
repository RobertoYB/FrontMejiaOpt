import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";

import OdooProducts from "../pages/odoo/Products";
import OdooOrders from "../pages/odoo/Orders";
import OdooCategories from "../pages/odoo/Categories";

import PrestashopProducts from "../pages/prestashop/Products";
import PrestashopOrders from "../pages/prestashop/Orders";
import PrestashopCustomers from "../pages/prestashop/Customers";
import PrestashopPayments from "../pages/prestashop/Payments";
import PrestashopSuppliers from "../pages/prestashop/Suppliers";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />

          <Route path="/odoo/products" element={<OdooProducts />} />
          <Route path="/odoo/categories" element={<OdooCategories />} />
          <Route path="/odoo/orders" element={<OdooOrders />} />

          <Route
            path="/prestashop/products"
            element={<PrestashopProducts />}
          />

          <Route
            path="/prestashop/orders"
            element={<PrestashopOrders />}
          />

          <Route
            path="/prestashop/customers"
            element={<PrestashopCustomers />}
          />

          <Route
            path="/prestashop/payments"
            element={<PrestashopPayments />}
          />

          <Route
            path="/prestashop/suppliers"
            element={<PrestashopSuppliers />}
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}