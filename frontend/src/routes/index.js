import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Home from "../pages/Home"
import Login from "../pages/Login"
import ForgotPassword from "../pages/ForgotPassword"
import SignUp from "../pages/SignUp"
import AdminPanel from "../pages/AdminPanel"
import AllUsers from "../pages/AllUsers"
import AllProducts from "../pages/AllProducts"
import CategoryProduct from "../pages/CategoryProduct"
import ProductDetails from "../pages/ProductDetails"
import Cart from '../pages/Cart'
import SearchProduct from "../pages/SearchProduct"
import MobileCategoriesPage from "../pages/MobileCategoriesPage";
import ResetPassword from "../pages/ResetPassword"; // Asegúrate de que ResetPassword esté importado

// Archivo: routes/index.js del frontend

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "iniciar-sesion", // Antes: login
                element: <Login />
            },
            {
                path: "recuperar-contrasena", // Antes: forgot-password
                element: <ForgotPassword />
            },
            {
                path: "restablecer-contrasena/:token", // Antes: reset-password/:token
                element: <ResetPassword />
            },
            {
                path: "registro", // Antes: sign-up
                element: <SignUp />
            },
            {
                path: "/",
                element: <App />,
                children: [
                  { path: "", element: <Home /> },
                  { path: "categorias-movil", element: <MobileCategoriesPage /> }, // Antes: mobile-categories
                  { path: "categoria-producto", element: <CategoryProduct /> }, // Antes: product-category
                ]
              },
            {
                path: "producto/:id", // Antes: product/:id
                element: <ProductDetails />
            },
            {
                path: "carrito", // Antes: cart
                element: <Cart />
            },
            {
                path: "buscar", // Antes: search
                element: <SearchProduct />
            },
            {
                path: "panel-admin", // Antes: admin-panel
                element: <AdminPanel />,
                children: [
                    {
                        path: "todos-usuarios", // Antes: all-users
                        element: <AllUsers />
                    },
                    {
                        path: "todos-productos", // Antes: all-products
                        element: <AllProducts />
                    }
                ]
            }
        ]
    }
]);

export default router;
