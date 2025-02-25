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
                path: "login",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "reset-password/:token", // Ruta para restablecimiento de contraseña
                element: <ResetPassword />
            },
            {
                path: "sign-up",
                element: <SignUp />
            },
            {
                path: "/",
                element: <App />,
                children: [
                  { path: "", element: <Home /> },
                  { path: "mobile-categories", element: <MobileCategoriesPage /> },  // Nueva ruta
                  { path: "product-category", element: <CategoryProduct /> },
                ]
              },
            {
                path: "product/:id",
                element: <ProductDetails />
            },
            {
                path: "cart",
                element: <Cart />
            },
            {
                path: "search",
                element: <SearchProduct />
            },
            {
                path: "admin-panel",
                element: <AdminPanel />,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers />
                    },
                    {
                        path: "all-products",
                        element: <AllProducts />
                    }
                ]
            }
            
        ]
    }
]);

export default router;
