import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete, MdShoppingCart } from "react-icons/md";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from '../helpers/logo.jpg';
import { toast } from 'react-toastify';
import { localCartHelper } from '../helpers/addToCart';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context);

    // Función simplificada para cargar datos directamente desde localStorage
    const fetchData = () => {
        try {
            setLoading(true);
            
            // Obtener items directamente del localStorage
            const cartItems = localCartHelper.getCart();
            console.log("Datos de carrito cargados:", cartItems);
            
            // Ya no es necesario hacer peticiones adicionales
            setData(cartItems);
            
        } catch (error) {
            console.error('Error al cargar productos del carrito:', error);
            toast.error('Error al cargar el carrito');
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchData();
    }, []);

    // Función para verificar que un producto tiene datos válidos
    const isValidProduct = (product) => {
        return product && product.productId && 
               typeof product.productId === 'object' &&
               product.productId.productImage &&
               Array.isArray(product.productId.productImage) &&
               product.productId.productImage.length > 0;
    };

    // Aumentar cantidad de producto
    const increaseQty = (id, qty) => {
        try {
            if (localCartHelper.updateQuantity(id, qty + 1)) {
                fetchData();
                toast.success('Cantidad actualizada');
            }
        } catch (error) {
            console.error('Error al aumentar cantidad:', error);
            toast.error('Error al actualizar cantidad');
        }
    };

    // Disminuir cantidad de producto
    const decreaseQty = (id, qty) => {
        if (qty < 2) return;
        
        try {
            if (localCartHelper.updateQuantity(id, qty - 1)) {
                fetchData();
                toast.success('Cantidad actualizada');
            }
        } catch (error) {
            console.error('Error al disminuir cantidad:', error);
            toast.error('Error al actualizar cantidad');
        }
    };

    // Eliminar producto del carrito
    const deleteCartProduct = (id) => {
        try {
            localCartHelper.removeItem(id);
            fetchData();
            
            // Actualizar contador global del carrito
            if (context.fetchUserAddToCart) {
                context.fetchUserAddToCart();
            }
            
            toast.success('Producto eliminado del carrito');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            toast.error('Error al eliminar producto');
        }
    };

    // Limpiar todo el carrito
    const clearCart = () => {
        try {
            localCartHelper.clearCart();
            fetchData();
            
            // Actualizar contador global del carrito
            if (context.fetchUserAddToCart) {
                context.fetchUserAddToCart();
            }
            
            toast.success('Carrito limpiado correctamente');
        } catch (error) {
            console.error('Error al limpiar el carrito:', error);
            toast.error('Error al limpiar el carrito');
        }
    };

    // Calcular cantidad total de productos
    const totalQty = data.reduce((previousValue, currentValue) => 
        previousValue + currentValue.quantity, 0);
    
    // Calcular precio total - adaptado para el nuevo formato con validación
    const totalPrice = data.reduce((prev, curr) => {
        if (curr?.productId?.sellingPrice) {
            return prev + (curr.quantity * curr.productId.sellingPrice);
        }
        return prev;
    }, 0);

    // Generar PDF de presupuesto (sin cambios)
    const generatePDF = () => {
        const clientName = prompt("Por favor, ingrese el nombre del cliente:");
        if (!clientName) {
            alert("El nombre del cliente es obligatorio.");
            return;
        }
    
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
    
        const imgWidth = 25;
        const imgHeight = 12;
        doc.addImage(logo, 'JPEG', 10, 10, imgWidth, imgHeight);
    
        doc.setFontSize(18);
        doc.text("Presupuesto de Compra", pageWidth / 2, 20, { align: "center" });
    
        const currentDate = new Date().toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    
        doc.setFontSize(12);
        doc.text(`Cliente: ${clientName}`, 10, 35);
        doc.text(`Fecha: ${currentDate}`, 10, 45);
    
        const tableColumn = ["N", "Producto", "Cantidad", "Precio Unitario", "Subtotal"];
        const tableRows = [];
        let totalPrice = 0;
        
        // Filtrar productos válidos para el PDF
        const validProducts = data.filter(isValidProduct);
        
        validProducts.forEach((product, index) => {
            const subtotal = product.quantity * product.productId.sellingPrice;
            totalPrice += subtotal;
            tableRows.push([
                (index + 1).toString(),
                product.productId.productName,
                product.quantity.toString(),
                displayINRCurrency(product.productId.sellingPrice),
                displayINRCurrency(subtotal),
            ]);
        });
    
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            theme: 'grid',
            tableWidth: pageWidth - 20,
            styles: {
                fontSize: 8,
                cellPadding: 3,
                overflow: 'linebreak',
                textColor: [0, 0, 0],
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 10 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 25, halign: 'right' },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 30, halign: 'right' }
            },
            didDrawPage: (data) => {
                const yPosition = data.cursor.y;
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    data.cursor.y = 50;
                }
    
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);
                }
            }
        });
    
        const totalInUSD = totalPrice / 7850;
        const totalTableColumns = ["Moneda", "Total"];
        const totalTableRows = [
            ["Guaraníes (GS)", displayINRCurrency(totalPrice)],
            ["Dólares (USD)", `$${totalInUSD.toFixed(2)}`]
        ];
    
        doc.autoTable({
            head: [totalTableColumns],
            body: totalTableRows,
            startY: doc.lastAutoTable.finalY + 10,
            theme: 'grid',
            styles: { 
                fontSize: 8, 
                cellPadding: 3, 
                overflow: 'linebreak', 
                textColor: [0, 0, 0], 
                halign: 'center' 
            },
            columnStyles: {
                0: { cellWidth: 50, halign: 'left' },
                1: { cellWidth: 50, halign: 'right' }
            }
        });
    
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(8);
        doc.text("Forma de Pago: Contado", 10, finalY);
        doc.text("Validez de la oferta: 5 días", 10, finalY + 10);
        doc.text("Entrega: 48 horas", 10, finalY + 20);
        doc.text("En caso de aceptar esta oferta puede firmarlo y enviar al correo electrónico o al número +595 972 971353", 10, finalY + 30);
        doc.text("JMComputer", 10, finalY + 40);
    
        doc.save("presupuesto_compra.pdf");
    };

    const validProducts = data.filter(isValidProduct);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Botones para debug */}
                <div className="flex gap-2 mb-4">
                    <button onClick={() => console.log("Carrito actual:", localCartHelper.getCart())} 
                            className="px-3 py-1 bg-gray-200 rounded text-sm">
                        Debug: Ver carrito en consola
                    </button>
                    <button onClick={clearCart} 
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
                        Limpiar carrito
                    </button>
                </div>
                
                {/* Encabezado del carrito */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <MdShoppingCart className="text-green-600" />
                        Mi Carrito
                    </h1>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                        {totalQty} {totalQty === 1 ? 'producto' : 'productos'}
                    </span>
                </div>

                {/* Carrito vacío */}
                {validProducts.length === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <MdShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
                        <p className="text-xl text-gray-600 mb-4">No hay productos en tu carrito</p>
                        <Link 
                            to="/"
                            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Continuar Comprando
                        </Link>
                    </div>
                )}

                {/* Contenido del carrito */}
                {validProducts.length > 0 && (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Lista de productos */}
                        <div className="flex-grow">
                            {loading ? (
                                <div className="bg-white rounded-xl shadow-sm p-6">
                                    <div className="animate-pulse space-y-6">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="bg-gray-200 w-24 h-24 rounded-lg"></div>
                                                <div className="flex-1 space-y-3">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {validProducts.map((product) => (
                                        <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                                            <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                                                {/* Imagen */}
                                                <div className="w-full sm:w-36 h-36 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center p-2">
                                                    <img 
                                                        src={product.productId.productImage[0]} 
                                                        alt={product.productId.productName} 
                                                        className="w-full h-full object-contain" 
                                                    />
                                                </div>

                                                {/* Información */}
                                                <div className="flex-1">
                                                    <Link to={`/producto/${product.productId._id}`} className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">
                                                        {product.productId.productName}
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mt-1">{product.productId.category}</p>
                                                    
                                                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                                                        <span className="text-lg font-medium text-green-600">
                                                            {displayINRCurrency(product.productId.sellingPrice)}
                                                        </span>
                                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                                            <button 
                                                                onClick={() => decreaseQty(product._id, product.quantity)} 
                                                                className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="px-4 py-1 text-gray-800 font-medium">
                                                                {product.quantity}
                                                            </span>
                                                            <button 
                                                                onClick={() => increaseQty(product._id, product.quantity)}
                                                                className="px-3 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <button 
                                                            onClick={() => deleteCartProduct(product._id)}
                                                            className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-colors"
                                                        >
                                                            <MdDelete />
                                                            <span>Eliminar</span>
                                                        </button>
                                                    </div>
                    
                                                    <div className="mt-2 text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {displayINRCurrency(product.productId.sellingPrice * product.quantity)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                
                        {/* Resumen */}
                        <div className="w-full lg:w-96">
                            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                                    Resumen del Carrito
                                </h2>
                
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Cantidad Total</span>
                                        <span className="font-medium text-gray-900">{totalQty}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium text-gray-900">{displayINRCurrency(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-lg font-medium text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-green-600">{displayINRCurrency(totalPrice)}</span>
                                    </div>
                                </div>
                
                                <button
                                    onClick={generatePDF}
                                    className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                                >
                                    <span>Descargar Presupuesto</span>
                                </button>
                
                                <Link
                                    to="/"
                                    className="mt-4 w-full block text-center py-3 text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Continuar comprando
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;