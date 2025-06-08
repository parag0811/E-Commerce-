import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RegisterUserPage from "./pages/Register.jsx";
import { action as RegisterUser } from "./components/auth/Register.jsx";
import LoginUserPage from "./pages/Login.jsx";
import { action as LoginUserAction } from "./components/auth/Login.jsx";
import RootLayout from "./pages/Root.jsx";
import HomePage from "./pages/Home.jsx";
// Products Page
import ProductsPage from "./pages/Products.jsx";
import { loader as productLoader } from "./pages/Products.jsx";

import ProductsFormPage from "./pages/Add-Product.jsx";
import { action as createProductAction } from "./components/product/ProductForm.jsx";
import { loader as loadAdminEditProduct } from "./components/product/ProductForm.jsx";

import AdminProductsPage from "./pages/Admin/AdminProducts.jsx";
import { loader as adminProductLoader } from "./pages/Admin/AdminProducts.jsx";

import ErrorPage from "./pages/Error.jsx";
import { loader as singleProductLoader } from "./pages/SingleProduct.jsx";
import SingleProductPage from "./pages/SingleProduct.jsx";

import { loader as CartLoader } from "./pages/Cart.jsx";
import CartPage from "./pages/Cart.jsx";

import CheckoutPage from "./pages/Checkout.jsx";
import { loader as checkoutLoader } from "./pages/Checkout.jsx";

import AdminProductDetails from "./pages/Admin/AdminProductDetails.jsx";
import { loader as AdminProductDetailLoader } from "./pages/Admin/AdminProductDetails.jsx";
import ProductsFormPageForEdit from "./pages/Admin/AdminEditProduct.jsx";

import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import ProfilePage from "./pages/Profile.jsx";
import OrdersPage from "./pages/Order.jsx";

const router = createBrowserRouter([
  {
    path: "/auth/register",
    element: <RegisterUserPage />,
    errorElement: <ErrorPage />,
    action: RegisterUser,
  },
  {
    path: "/auth/login",
    element: <LoginUserPage />,
    errorElement: <ErrorPage />,
    action: LoginUserAction,
  },
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/all-products",
    element: <ProductsPage />,
    loader: productLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/all-products/:productId",
    element: <SingleProductPage />,
    loader: singleProductLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
    loader: CartLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
    loader: checkoutLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "products",
        element: <AdminProductsPage />,
        loader: adminProductLoader,
      },
      {
        path: "products/:productId",
        element: <AdminProductDetails />,
        loader: AdminProductDetailLoader,
      },
      {
        path: "create-products",
        element: <ProductsFormPage />,
        action: createProductAction,
      },
      {
        path: "editProducts/:productId",
        element: <ProductsFormPageForEdit />,
        loader: loadAdminEditProduct,
        action: createProductAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
