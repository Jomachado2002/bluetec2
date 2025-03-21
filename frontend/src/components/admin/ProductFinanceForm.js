// frontend/src/components/admin/ProductFinanceForm.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { IoIosClose } from "react-icons/io";
import { FaCalculator } from "react-icons/fa";
import displayPYGCurrency from '../../helpers/displayCurrency';
import SummaryApi from '../../common';

const ProductFinanceForm = ({ product, onClose, onUpdate }) => {
  const [data, setData] = useState({
    productId: product?._id || '',
    purchasePrice: product?.purchasePrice || '',
    loanInterest: product?.loanInterest || 0,
    deliveryCost: product?.deliveryCost || 0,
    sellingPrice: product?.sellingPrice || ''
  });

  const [summary, setSummary] = useState({
    totalCosts: 0,
    profitAmount: 0,
    profitMargin: 0
  });

  const [isLoading, setIsLoading] = useState(false);

  // Calcular resumen financiero cuando cambian los datos
  useEffect(() => {
    if (data.purchasePrice && data.sellingPrice) {
      const purchase = Number(data.purchasePrice) || 0;
      const interest = Number(data.loanInterest) || 0;
      const delivery = Number(data.deliveryCost) || 0;
      const selling = Number(data.sellingPrice) || 0;

      // Calcular costos totales
      const interestAmount = purchase * (interest / 100);
      const totalCosts = purchase + interestAmount + delivery;
      
      // Calcular utilidad y margen
      const profitAmount = selling - totalCosts;
      const profitMargin = selling > 0 ? (profitAmount / selling) * 100 : 0;

      setSummary({
        totalCosts,
        profitAmount,
        profitMargin
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!data.purchasePrice || !data.sellingPrice) {
      toast.error("Los precios de compra y venta son obligatorios");
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`${SummaryApi.baseURL}/api/finanzas/producto/finanzas`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Información financiera actualizada correctamente");
        if (onUpdate) onUpdate(result.data.product);
        onClose();
      } else {
        toast.error(result.message || "Error al actualizar la información financiera");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Encabezado */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="font-bold text-xl text-gray-800 flex items-center">
            <FaCalculator className="mr-2 text-blue-600" />
            Gestión Financiera del Producto
          </h2>
          <button 
            className="text-3xl text-gray-600 hover:text-black transition-colors" 
            onClick={onClose}
          >
            <IoIosClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3 text-gray-700">
              {product?.productName}
            </h3>
            <p className="text-sm text-gray-500">
              Categoría: {product?.category} / {product?.subcategory}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              Marca: {product?.brandName}
            </p>
          </div>

          {/* Formulario de precios */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Compra (Costo)
              </label>
              <input
                type="number"
                id="purchasePrice"
                name="purchasePrice"
                value={data.purchasePrice}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Precio de compra"
                required
              />
            </div>

            <div>
              <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Precio de Venta
              </label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                value={data.sellingPrice}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Precio de venta"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="loanInterest" className="block text-sm font-medium text-gray-700 mb-1">
                Interés sobre Préstamo (%)
              </label>
              <input
                type="number"
                id="loanInterest"
                name="loanInterest"
                value={data.loanInterest}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Porcentaje de interés"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <label htmlFor="deliveryCost" className="block text-sm font-medium text-gray-700 mb-1">
                Costo de Envío
              </label>
              <input
                type="number"
                id="deliveryCost"
                name="deliveryCost"
                value={data.deliveryCost}
                onChange={handleChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Costo de envío"
                min="0"
              />
            </div>
          </div>

          {/* Resumen de rentabilidad */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-semibold text-blue-700 mb-2">Resumen Financiero</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Costo total:</p>
                <p className="font-semibold text-gray-800">{displayPYGCurrency(summary.totalCosts)}</p>
              </div>
              
              <div>
                <p className="text-gray-600">Utilidad:</p>
                <p className={`font-semibold ${summary.profitAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {displayPYGCurrency(summary.profitAmount)}
                </p>
              </div>
              
              <div className="col-span-2">
                <p className="text-gray-600">Margen de ganancia:</p>
                <p className={`font-semibold text-lg ${summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.profitMargin.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 mr-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                "Guardar Información"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFinanceForm;