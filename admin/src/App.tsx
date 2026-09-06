import { Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { MenuProvider } from "./context/MenuContext";
import { OrdersProvider } from "./context/OrdersContext";
import { ProtectedAdminRoute } from "./layout/ProtectedAdminRoute";
import { AdminLayout } from "./layout/AdminLayout";
import { LoginPage } from "./pages/LoginPage";
import { DashboardOverviewPage } from "./pages/DashboardOverviewPage";
import { OrdersManagementPage } from "./pages/OrdersManagementPage";
import { MenuManagementPage } from "./pages/MenuManagementPage";
import { StoreSettingsPage } from "./pages/StoreSettingsPage";

export default function App() {
  return (
    <AdminAuthProvider>
      <MenuProvider>
        <OrdersProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<DashboardOverviewPage />} />
                <Route path="/orders" element={<OrdersManagementPage />} />
                <Route path="/menu" element={<MenuManagementPage />} />
                <Route path="/settings" element={<StoreSettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </OrdersProvider>
      </MenuProvider>
    </AdminAuthProvider>
  );
}
