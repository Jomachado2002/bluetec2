// frontend/src/pages/FinancialReports.js
import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload, FaFilter, FaUndo, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import { toast } from 'react-toastify';
import displayPYGCurrency from '../helpers/displayCurrency';
import SummaryApi from '../common';
import productCategory from '../helpers/productCategory';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const FinancialReports = () => {
  const [activeTab, setActiveTab] = useState('margins');
  const [isLoading, setIsLoading] = useState(false);
  const [marginReport, setMarginReport] = useState({
    products: [],
    summary: null
  });
  const [profitabilityReport, setProfitabilityReport] = useState({
    overall: null,
    byCategory: [],
    bySubcategory: [],
    byBrand: []
  });

  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    brandName: '',
    minMargin: '',
    maxMargin: '',
    sortBy: 'profitMargin',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  // Cargar categorías y subcategorías disponibles
  useEffect(() => {
    setAvailableCategories(productCategory);
  }, []);

  // Actualizar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (filters.category) {
      const category = availableCategories.find(c => c.value === filters.category);
      if (category && category.subcategories) {
        setAvailableSubcategories(category.subcategories);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [filters.category, availableCategories]);

  // Cargar reportes
  useEffect(() => {
    if (activeTab === 'margins') {
      fetchMarginReport();
    } else if (activeTab === 'profitability') {
      fetchProfitabilityReport();
    }
  }, [activeTab]);

  const fetchMarginReport = async () => {
    try {
      setIsLoading(true);
      
      // Construir query params
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.subcategory) queryParams.append('subcategory', filters.subcategory);
      if (filters.brandName) queryParams.append('brandName', filters.brandName);
      if (filters.minMargin) queryParams.append('minMargin', filters.minMargin);
      if (filters.maxMargin) queryParams.append('maxMargin', filters.maxMargin);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
      
      const url = `${SummaryApi.baseURL}/api/finanzas/reportes/margenes?${queryParams.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        setMarginReport({
          products: result.data.products || [],
          summary: result.data.summary || null
        });
      } else {
        toast.error(result.message || "Error al cargar el reporte de márgenes");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfitabilityReport = async () => {
    try {
      setIsLoading(true);
      
      const url = `${SummaryApi.baseURL}/api/finanzas/reportes/rentabilidad`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        setProfitabilityReport({
          overall: result.data.overall || null,
          byCategory: result.data.byCategory || [],
          bySubcategory: result.data.bySubcategory || [],
          byBrand: result.data.byBrand || []
        });
      } else {
        toast.error(result.message || "Error al cargar el reporte de rentabilidad");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchMarginReport();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      subcategory: '',
      brandName: '',
      minMargin: '',
      maxMargin: '',
      sortBy: 'profitMargin',
      sortOrder: 'desc'
    });
  };

  // Generar PDF del reporte de márgenes
  const generateMarginReportPDF = () => {
    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Añadir título
      doc.setFontSize(18);
      doc.text('Reporte de Márgenes de Ganancia', 14, 22);
      
      // Añadir fecha
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Resumen general
      if (marginReport.summary) {
        doc.setFontSize(14);
        doc.text('Resumen General', 14, 40);
        
        doc.setFontSize(10);
        doc.text(`Total de productos: ${marginReport.summary.totalProducts}`, 14, 48);
        doc.text(`Ingresos totales: ${displayPYGCurrency(marginReport.summary.totalRevenue)}`, 14, 54);
        doc.text(`Costos totales: ${displayPYGCurrency(marginReport.summary.totalCost)}`, 14, 60);
        doc.text(`Utilidad total: ${displayPYGCurrency(marginReport.summary.totalProfit)}`, 14, 66);
        doc.text(`Margen promedio: ${parseFloat(marginReport.summary.averageMargin).toFixed(2)}%`, 14, 72);
        
        if (marginReport.summary.highestMargin.product) {
          doc.text(`Producto con mayor margen: ${marginReport.summary.highestMargin.product.productName} (${marginReport.summary.highestMargin.value.toFixed(2)}%)`, 14, 78);
        }
        
        if (marginReport.summary.lowestMargin.product) {
          doc.text(`Producto con menor margen: ${marginReport.summary.lowestMargin.product.productName} (${marginReport.summary.lowestMargin.value.toFixed(2)}%)`, 14, 84);
        }
      }
      
      // Tabla de productos
      if (marginReport.products.length > 0) {
        doc.setFontSize(14);
        doc.text('Detalle de Productos', 14, 94);
        
        // Datos para tabla
        const tableData = marginReport.products.map(product => [
          product.productName,
          product.brandName,
          displayPYGCurrency(product.sellingPrice),
          displayPYGCurrency(product.purchasePrice),
          `${parseFloat(product.profitMargin).toFixed(2)}%`,
          displayPYGCurrency(product.profitAmount)
        ]);
        
        // Crear tabla
        doc.autoTable({
          startY: 100,
          head: [['Producto', 'Marca', 'P. Venta', 'P. Compra', 'Margen', 'Utilidad']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [0, 32, 96] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      }
      
      // Guardar PDF
      doc.save('reporte-margenes.pdf');
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  // Generar PDF del reporte de rentabilidad
  const generateProfitabilityReportPDF = () => {
    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Añadir título
      doc.setFontSize(18);
      doc.text('Reporte de Rentabilidad por Categoría', 14, 22);
      
      // Añadir fecha
      doc.setFontSize(10);
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Resumen general
      if (profitabilityReport.overall) {
        doc.setFontSize(14);
        doc.text('Resumen General', 14, 40);
        
        doc.setFontSize(10);
        doc.text(`Total de productos: ${profitabilityReport.overall.totalProducts}`, 14, 48);
        doc.text(`Ingresos totales: ${displayPYGCurrency(profitabilityReport.overall.totalRevenue)}`, 14, 54);
        doc.text(`Costos totales: ${displayPYGCurrency(profitabilityReport.overall.totalCost)}`, 14, 60);
        doc.text(`Utilidad total: ${displayPYGCurrency(profitabilityReport.overall.totalProfit)}`, 14, 66);
        doc.text(`Margen promedio: ${parseFloat(profitabilityReport.overall.avgMargin).toFixed(2)}%`, 14, 72);
      }
      
      // Tabla de categorías
      if (profitabilityReport.byCategory.length > 0) {
        doc.setFontSize(14);
        doc.text('Rentabilidad por Categoría', 14, 84);
        
        // Datos para tabla
        const tableData = profitabilityReport.byCategory.map(cat => [
          cat.category,
          cat.totalProducts,
          displayPYGCurrency(cat.totalRevenue),
          displayPYGCurrency(cat.totalProfit),
          `${parseFloat(cat.avgMargin).toFixed(2)}%`,
          `${parseFloat(cat.profitPercentage).toFixed(2)}%`
        ]);
        
        // Crear tabla
        doc.autoTable({
          startY: 90,
          head: [['Categoría', 'Productos', 'Ingresos', 'Utilidad', 'Margen Prom.', '% Rentabilidad']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [0, 32, 96] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      }
      
      // Tabla de marcas (las 10 mejores)
      if (profitabilityReport.byBrand.length > 0) {
        const top10Brands = [...profitabilityReport.byBrand]
          .sort((a, b) => b.avgMargin - a.avgMargin)
          .slice(0, 10);
          
        // Obtener la posición Y después de la tabla anterior
        const finalY = doc.lastAutoTable.finalY + 15;
        
        doc.setFontSize(14);
        doc.text('Top 10 Marcas por Rentabilidad', 14, finalY);
        
        // Datos para tabla
        const tableData = top10Brands.map(brand => [
          brand.brand,
          brand.totalProducts,
          displayPYGCurrency(brand.totalRevenue),
          displayPYGCurrency(brand.totalProfit),
          `${parseFloat(brand.avgMargin).toFixed(2)}%`
        ]);
        
        // Crear tabla
        doc.autoTable({
          startY: finalY + 6,
          head: [['Marca', 'Productos', 'Ingresos', 'Utilidad', 'Margen Prom.']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [0, 32, 96] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      }
      
      // Guardar PDF
      doc.save('reporte-rentabilidad.pdf');
      
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Reportes Financieros</h1>
      
      {/* Tabs de navegación */}
      <div className="mb-6 flex border-b">
        <button
          className={`py-2 px-4 font-medium flex items-center ${
            activeTab === 'margins'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('margins')}
        >
          <FaChartLine className="mr-2" /> Márgenes de Ganancia
        </button>
        <button
          className={`py-2 px-4 font-medium flex items-center ${
            activeTab === 'profitability'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-blue-500'
          }`}
          onClick={() => setActiveTab('profitability')}
        >
          <FaChartBar className="mr-2" /> Rentabilidad por Categoría
        </button>
      </div>
      
      {/* Contenido del tab activo */}
      {activeTab === 'margins' && (
        <div>
          {/* Barra de acciones */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Análisis de Márgenes de Ganancia</h2>
            
            <div className="flex flex-wrap gap-2">
              <button
                className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg flex items-center hover:bg-blue-100"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" /> {showFilters ? 'Ocultar filtros' : 'Filtrar'}
              </button>
              
              <button
                className="bg-green-50 text-green-600 px-3 py-2 rounded-lg flex items-center hover:bg-green-100"
                onClick={generateMarginReportPDF}
              >
                <FaDownload className="mr-2" /> Exportar PDF
              </button>
            </div>
          </div>
          
          {/* Filtros */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* Filtro por categoría */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Todas las categorías</option>
                    {availableCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                
                {/* Filtro por subcategoría */}
                {filters.category && (
                  <div>
                    <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Subcategoría
                    </label>
                    <select
                      id="subcategory"
                      name="subcategory"
                      value={filters.subcategory}
                      onChange={handleFilterChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Todas las subcategorías</option>
                      {availableSubcategories.map(subcat => (
                        <option key={subcat.value} value={subcat.value}>{subcat.label}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {/* Filtro por margen mínimo */}
                <div>
                  <label htmlFor="minMargin" className="block text-sm font-medium text-gray-700 mb-1">
                    Margen mínimo (%)
                  </label>
                  <input
                    type="number"
                    id="minMargin"
                    name="minMargin"
                    value={filters.minMargin}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Ej: 10"
                    min="0"
                    max="100"
                  />
                </div>
                
                {/* Filtro por margen máximo */}
                <div>
                  <label htmlFor="maxMargin" className="block text-sm font-medium text-gray-700 mb-1">
                    Margen máximo (%)
                  </label>
                  <input
                    type="number"
                    id="maxMargin"
                    name="maxMargin"
                    value={filters.maxMargin}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Ej: 50"
                    min="0"
                    max="100"
                  />
                </div>
                
                {/* Ordenar por */}
                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Ordenar por
                  </label>
                  <select
                    id="sortBy"
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="profitMargin">Margen de ganancia</option>
                    <option value="profitAmount">Utilidad</option>
                    <option value="sellingPrice">Precio de venta</option>
                    <option value="purchasePrice">Precio de compra</option>
                  </select>
                </div>
                
                {/* Dirección de ordenamiento */}
                <div>
                  <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <select
                    id="sortOrder"
                    name="sortOrder"
                    value={filters.sortOrder}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="desc">Mayor a menor</option>
                    <option value="asc">Menor a mayor</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center"
                >
                  <FaUndo className="mr-2" /> Restablecer
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          )}
          
          {/* Resumen del reporte de márgenes */}
          {marginReport.summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Total de productos</p>
                <p className="text-2xl font-bold">{marginReport.summary.totalProducts}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Utilidad total</p>
                <p className="text-2xl font-bold">{displayPYGCurrency(marginReport.summary.totalProfit)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Margen promedio</p>
                <p className="text-2xl font-bold">{parseFloat(marginReport.summary.averageMargin).toFixed(2)}%</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">Mayor margen</p>
                <p className="text-2xl font-bold">{marginReport.summary.highestMargin.value.toFixed(2)}%</p>
                {marginReport.summary.highestMargin.product && (
                  <p className="text-xs text-gray-500 truncate">{marginReport.summary.highestMargin.product.productName}</p>
                )}
              </div>
            </div>
          )}
          
          {/* Tabla de productos */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P. Venta</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P. Compra</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margen</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utilidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : marginReport.products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      No se encontraron productos.
                    </td>
                  </tr>
                ) : (
                  marginReport.products.map((product, index) => (
                    <tr key={product._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm text-gray-800">{product.productName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.brandName}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(product.sellingPrice)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(product.purchasePrice)}</td>
                      <td className={`px-4 py-3 text-sm font-medium text-right ${
                        product.profitMargin < 0 ? 'text-red-600' : 
                        product.profitMargin < 10 ? 'text-yellow-600' : 
                        product.profitMargin < 20 ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {parseFloat(product.profitMargin).toFixed(2)}%
                      </td>
                      <td className={`px-4 py-3 text-sm font-medium text-right ${
                        product.profitAmount < 0 ? 'text-red-600' : 'text-gray-800'
                      }`}>
                        {displayPYGCurrency(product.profitAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'profitability' && (
        <div>
          {/* Barra de acciones */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Análisis de Rentabilidad por Categoría</h2>
            
            <button
              className="bg-green-50 text-green-600 px-3 py-2 rounded-lg flex items-center hover:bg-green-100"
              onClick={generateProfitabilityReportPDF}
            >
              <FaDownload className="mr-2" /> Exportar PDF
            </button>
          </div>
          
          {/* Resumen general */}
          {profitabilityReport.overall && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Resumen General</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total de productos</p>
                  <p className="text-2xl font-bold">{profitabilityReport.overall.totalProducts}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Ingresos totales</p>
                  <p className="text-2xl font-bold">{displayPYGCurrency(profitabilityReport.overall.totalRevenue)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Costos totales</p>
                  <p className="text-2xl font-bold">{displayPYGCurrency(profitabilityReport.overall.totalCost)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Utilidad total</p>
                  <p className="text-2xl font-bold">{displayPYGCurrency(profitabilityReport.overall.totalProfit)}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">Margen promedio</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${Math.min(Math.max(profitabilityReport.overall.avgMargin, 0), 100)}%` }}
                  ></div>
                </div>
                <p className="text-right mt-1 text-sm font-medium">{profitabilityReport.overall.avgMargin.toFixed(2)}%</p>
              </div>
            </div>
          )}
          
          {/* Rentabilidad por categoría */}
          {profitabilityReport.byCategory.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-lg font-semibold mb-4">Rentabilidad por Categoría</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Costos</th>
<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utilidad</th>
<th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margen</th>
</tr>
</thead>
<tbody className="divide-y divide-gray-200">
{isLoading ? (
  <tr>
    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
      Cargando...
    </td>
  </tr>
) : profitabilityReport.byCategory.length === 0 ? (
  <tr>
    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
      No se encontraron categorías.
    </td>
  </tr>
) : (
  profitabilityReport.byCategory.map((category, index) => (
    <tr key={category.category || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-4 py-3 text-sm text-gray-800">{category.category}</td>
      <td className="px-4 py-3 text-sm text-gray-600 text-right">{category.totalProducts}</td>
      <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(category.totalRevenue)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(category.totalCost)}</td>
      <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(category.totalProfit)}</td>
      <td className="px-4 py-3 text-sm font-medium text-right text-blue-600">
        {parseFloat(category.avgMargin).toFixed(2)}%
      </td>
    </tr>
  ))
)}
</tbody>
</table>
</div>
</div>
)}

{/* Rentabilidad por marca */}
{profitabilityReport.byBrand.length > 0 && (
<div className="bg-white p-6 rounded-lg shadow">
  <h3 className="text-lg font-semibold mb-4">Top 10 Marcas por Rentabilidad</h3>
  
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Utilidad</th>
          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Margen</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {isLoading ? (
          <tr>
            <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
              Cargando...
            </td>
          </tr>
        ) : (
          [...profitabilityReport.byBrand]
            .sort((a, b) => b.avgMargin - a.avgMargin)
            .slice(0, 10)
            .map((brand, index) => (
              <tr key={brand.brand || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-800">{brand.brand}</td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">{brand.totalProducts}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(brand.totalRevenue)}</td>
                <td className="px-4 py-3 text-sm text-gray-800 text-right">{displayPYGCurrency(brand.totalProfit)}</td>
                <td className="px-4 py-3 text-sm font-medium text-right text-blue-600">
                  {parseFloat(brand.avgMargin).toFixed(2)}%
                </td>
              </tr>
            ))
        )}
      </tbody>
    </table>
  </div>
</div>
)}
</div>
)}
</div>
);
};

export default FinancialReports;