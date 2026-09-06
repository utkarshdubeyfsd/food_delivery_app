import { Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrdersProvider } from "./context/OrdersContext";
import { RestaurantListPage } from "./pages/RestaurantListPage";
import { RestaurantDetailPage } from "./pages/RestaurantDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { OrderStatusPage } from "./pages/OrderStatusPage";
import { OrdersListPage } from "./pages/OrdersListPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { AccountPage } from "./pages/AccountPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrdersProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<RestaurantListPage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/orders" element={<OrdersListPage />} />
              <Route path="/orders/:orderId" element={<OrderStatusPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Routes>
        </OrdersProvider>
      </CartProvider>
    </AuthProvider>
  );
}
