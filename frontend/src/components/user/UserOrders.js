// frontend/src/components/user/UserOrders.js
import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { 
  FaShoppingBag, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaExclamationTriangle,
  FaWhatsapp,
  FaDownload,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaEye
} from 'react-icons/fa';
import displayPYGCurrency from '../../helpers/displayCurrency';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from 'react-toastify';

const UserOrders = () => {
  const { orderId } = useParams();
  const { userData, setUserData } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const userOrders = userData.orders || [];
    setOrders(userOrders);
    setFilteredOrders(userOrders);

    // Si hay un orderId en la URL, mostrar ese pedido específico
    if (orderId) {
      const order = userOrders.find(o => o.id === orderId);
      setSelectedOrder(order);
    }
  }, [userData, orderId]);

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...orders];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some(product => 
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'last7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'last30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case 'last3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          filterDate = null;
      }
      
      if (filterDate) {
        filtered = filtered.filter(order => new Date(order.date) >= filterDate);
      }
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  // Función para obtener información del estado
  const getOrderStatusInfo = (status) => {
    const statusMap = {
      'pending_payment': { 
        label: 'Esperando pago', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <FaClock className="w-4 h-4" />,
        bgColor: 'bg-yellow-50'
      },
      'paid': { 
        label: 'Pagado - Preparando envío', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <FaShoppingBag className="w-4 h-4" />,
        bgColor: 'bg-blue-50'
      },
      'shipped': { 
        label: 'Enviado', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: <FaTruck className="w-4 h-4" />,
        bgColor: 'bg-purple-50'
      },
      'delivered': { 
        label: 'Entregado', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <FaCheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-50'
      },
      'cancelled': { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <FaExclamationTriangle className="w-4 h-4" />,
        bgColor: 'bg-red-50'
      }
    };
    
    return statusMap[status] || statusMap['paid'];
  };

  // Función para recomprar productos de un pedido
  const reorderProducts = (order) => {
    // Aquí agregarías los productos al carrito actual
    // Por ahora, simulamos la funcionalidad
    toast.success(`Productos del pedido ${order.id} agregados al carrito`);
  };

  // Función para contactar soporte
  const contactSupport = (order) => {
    const statusInfo = getOrderStatusInfo(order.status);
    const message = `Hola BlueTec, necesito información sobre mi pedido ${order.id}. Estado actual: ${statusInfo.label}. Fecha del pedido: ${new Date(order.date).toLocaleDateString('es-ES')}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/595984133733?text=${encodedMessage}`, '_blank');
  };

  // Función para generar PDF del pedido
  const generateOrderPDF = (order) => {
    const doc = new jsPDF();
    const statusInfo = getOrderStatusInfo(order.status);
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 32, 96);
    doc.text('BlueTec - Comprobante de Pedido', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Pedido: ${order.id}`, 20, 35);
    doc.text(`Fecha: ${new Date(order.date).toLocaleDateString('es-ES')}`, 20, 45);
    doc.text(`Estado: ${statusInfo.label}`, 20, 55);
    
    // Tabla de productos
    const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Subtotal"];
    const tableRows = [];
    
    order.products.forEach((product) => {
      tableRows.push([
        product.productName,
        product.quantity.toString(),
        displayPYGCurrency(product.unitPrice),
        displayPYGCurrency(product.subtotal)
      ]);
    });
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'grid',
      headStyles: { fillColor: [0, 32, 96] }
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text(`Total: ${displayPYGCurrency(order.totals.total)}`, 20, finalY);
    
    doc.save(`pedido-${order.id}.pdf`);
    toast.success("Comprobante descargado exitosamente");
  };

  // Si estamos viendo un pedido específico
  if (selectedOrder) {
    const statusInfo = getOrderStatusInfo(selectedOrder.status);
    
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-gray-600 hover:text-[#002060] mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Volver a mis pedidos
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Pedido #{selectedOrder.id}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del pedido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estado del pedido */}
            <div className={`${statusInfo.bgColor} border ${statusInfo.color.split(' ')[2]} rounded-xl p-6`}>
              <div className="flex items-center mb-4">
                {statusInfo.icon}
                <h2 className="ml-2 text-lg font-semibold">Estado del Pedido</h2>
              </div>
              <p className={`text-lg font-medium ${statusInfo.color.split(' ')[1]}`}>
                {statusInfo.label}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Pedido realizado el {new Date(selectedOrder.date).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Productos del pedido */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Productos</h3>
              <div className="space-y-4">
                {selectedOrder.products.map((product, index) => (
                  <div key={index} className="flex items-center p-4 border border-gray-100 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mr-4 overflow-hidden">
                      <img 
                        src={product.image || '/api/placeholder/64/64'} 
                        alt={product.productName}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{product.productName}</h4>
                      <p className="text-sm text-gray-600">Cantidad: {product.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Precio unitario: {displayPYGCurrency(product.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#002060]">
                        {displayPYGCurrency(product.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen y acciones */}
          <div className="space-y-6">
            {/* Resumen del pedido */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{displayPYGCurrency(selectedOrder.totals.subtotal)}</span>
                </div>
                {selectedOrder.totals.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío:</span>
                    <span>{displayPYGCurrency(selectedOrder.totals.shipping)}</span>
                  </div>
                )}
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-[#002060]">
                      {displayPYGCurrency(selectedOrder.totals.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
              <button
                onClick={() => generateOrderPDF(selectedOrder)}
                className="w-full flex items-center justify-center py-3 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
              >
                <FaDownload className="mr-2" />
                Descargar Comprobante
              </button>
              
              <button
                onClick={() => reorderProducts(selectedOrder)}
                className="w-full flex items-center justify-center py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaShoppingCart className="mr-2" />
                Recomprar productos
              </button>
              
              <button
                onClick={() => contactSupport(selectedOrder)}
                className="w-full flex items-center justify-center py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <FaWhatsapp className="mr-2" />
                Contactar Soporte
              </button>
            </div>

            {/* Información de envío */}
            {selectedOrder.shipping && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">Información de Envío</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Dirección:</span> {selectedOrder.shipping.address}</p>
                  <p><span className="font-medium">Método:</span> {selectedOrder.shipping.method}</p>
                  {selectedOrder.shipping.trackingNumber && (
                    <p><span className="font-medium">Nº de seguimiento:</span> {selectedOrder.shipping.trackingNumber}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Vista principal de lista de pedidos
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Mis Pedidos</h1>
        <div className="text-sm text-gray-600">
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nº pedido o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
          >
            <option value="all">Todos los estados</option>
            <option value="pending_payment">Esperando pago</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="delivered">Entregado</option>
            <option value="cancelled">Cancelado</option>
          </select>

          {/* Filtro por fecha */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
          >
            <option value="all">Todas las fechas</option>
            <option value="last7days">Últimos 7 días</option>
            <option value="last30days">Últimos 30 días</option>
            <option value="last3months">Últimos 3 meses</option>
          </select>

          {/* Limpiar filtros */}
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setDateFilter('all');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Lista de pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {orders.length === 0 ? 'No has realizado ningún pedido' : 'No se encontraron pedidos'}
          </h3>
          <p className="text-gray-500 mb-6">
            {orders.length === 0 
              ? 'Comienza a explorar nuestros productos y realiza tu primera compra'
              : 'Intenta ajustar los filtros para encontrar lo que buscas'
            }
          </p>
          <Link 
            to="/"
            className="inline-block bg-[#002060] text-white px-6 py-3 rounded-lg hover:bg-[#003399] transition-colors"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 mr-4">
                        Pedido #{order.id}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Fecha:</span>
                        <br />
                        {new Date(order.date).toLocaleDateString('es-ES')}
                      </div>
                      <div>
                        <span className="font-medium">Productos:</span>
                        <br />
                        {order.products?.length} artículo{order.products?.length !== 1 ? 's' : ''}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>
                        <br />
                        <span className="text-lg font-semibold text-[#002060]">
                          {displayPYGCurrency(order.totals?.total || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center px-4 py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors text-sm"
                    >
                      <FaEye className="mr-1" />
                      Ver detalles
                    </button>
                    
                    <button
                      onClick={() => generateOrderPDF(order)}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <FaDownload className="mr-1" />
                      PDF
                    </button>
                    
                    {(order.status === 'paid' || order.status === 'shipped') && (
                      <button
                        onClick={() => contactSupport(order)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <FaWhatsapp className="mr-1" />
                        Soporte
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;