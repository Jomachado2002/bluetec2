import SummaryApi from "../common";
import { toast } from 'react-toastify';

const addToCart = async(e, id) => {
    e?.stopPropagation();
    e?.preventDefault();

    try {
        // Mostrar toast inmediatamente para mejor experiencia de usuario
        toast.info("Agregando al carrito...");

        const response = await fetch(SummaryApi.addToCartProduct.url, {
            method: SummaryApi.addToCartProduct.method,
            credentials: 'include',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ productId: id })
        });

        const responseData = await response.json();

        if (responseData.success) {
            toast.success(responseData.message);
            
            // Forzar recarga del contador del carrito
            setTimeout(() => {
                // Si existe en el contexto global o window
                if (window.fetchUserAddToCart) {
                    window.fetchUserAddToCart();
                }
            }, 500);

            return responseData;
        }

        if (responseData.error) {
            toast.error(responseData.message);
        }

        return responseData;
    } catch (err) {
        console.error("Error al agregar al carrito:", err);
        toast.error("Error de conexión. Intenta de nuevo.");
        return { error: true, success: false };
    }
};

export default addToCart;