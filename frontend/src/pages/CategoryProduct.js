// src/pages/CategoryProduct.js - Actualizado para usar el drawer lateral

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoGridOutline, IoMenuOutline } from 'react-icons/io5';
import { BiX } from 'react-icons/bi';
import { FilterProvider, useFilters } from '../context/FilterContext'; // Ajustada la ruta a context sin 's'
import VerticalCard from '../components/VerticalCard';
import DesktopFilters from '../components/filters/DesktopFilters';
import SideDrawerFilters from '../components/filters/SideDrawerFilters'; // Nuevo componente de drawer
import ActiveFiltersBar from '../components/filters/ActiveFiltersBar';

// Componente interno que utiliza el contexto de filtros
const CategoryProductContent = () => {
  const { 
    data, 
    loading, 
    gridView, 
    setGridView,
    hasActiveFilters,
    clearAllFilters
  } = useFilters();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Configurar metadatos de SEO
  useEffect(() => {
    // Cambiar el título del documento para SEO
    const seoTitle = getSeoTitle();
    document.title = `${seoTitle} | JM Computer`;
    
    // Actualizar meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `Compra online ${seoTitle.toLowerCase()} con garantía oficial. Envío a todo Paraguay. Precios competitivos y atención personalizada.`);
    }
  }, [location.search]);
  
  // Función auxiliar para el título SEO
  const getSeoTitle = () => {
    const urlSearch = new URLSearchParams(location.search);
    const selectedCategory = urlSearch.get("category") || "";
    const selectedSubcategory = urlSearch.get("subcategory") || "";
    
    // Títulos específicos para ciertas subcategorías
    if (selectedSubcategory === "notebooks") 
      return "Las mejores notebooks para estudiantes y profesionales en Paraguay";
    if (selectedSubcategory === "placasMadre") 
      return "Placas madre de alto rendimiento para gaming y diseño";
    if (selectedSubcategory === "procesador") 
      return "Procesadores de última generación al mejor precio en Paraguay";
    if (selectedSubcategory === "graficas") 
      return "Tarjetas gráficas para gaming y diseño profesional en Paraguay";
    if (selectedSubcategory === "monitores") 
      return "Monitores de alta resolución para productividad y gaming";
    if (selectedSubcategory === "almacenamiento") 
      return "Discos duros y SSDs con la mejor relación precio-rendimiento";
      
    // Título genérico basado en la categoría si no hay título específico
    if (selectedCategory) {
      // Buscar la categoría en el array de productCategory
      // (Nota: Asumimos que productCategory está importado en FilterContext)
      return `Productos de ${selectedCategory} al mejor precio en Paraguay`;
    }
      
    if (selectedSubcategory) {
      return `${selectedSubcategory} con envío gratis y garantía oficial`;
    }
      
    return 'Equipos de tecnología al mejor precio en Paraguay';
  };
  
  return (
    <div className="container mx-auto px-4" style={{ paddingTop: '70px' }}>
      {/* MODIFICACIÓN: Usado paddingTop fijo en lugar de pt-clase para más control */}
      
      {/* Header de la página y controles - REPOSICIONADO más arriba */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 lg:mb-0">
          {getSeoTitle()}
        </h1>
        
        <div className="flex flex-wrap items-center space-x-2">
          {/* Contador de resultados para móvil */}
          <span className="lg:hidden text-sm text-gray-600 mr-auto">
            {data.length} {data.length === 1 ? 'producto' : 'productos'}
          </span>
      
          {/* Botones de vista cuadrícula/lista (solo desktop) */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              className={`p-2 rounded ${gridView ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setGridView(true)}
              aria-label="Vista de cuadrícula"
            >
              <IoGridOutline size={20} />
            </button>
            <button 
              className={`p-2 rounded ${!gridView ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              onClick={() => setGridView(false)}
              aria-label="Vista de lista"
            >
              <IoMenuOutline size={20} />
            </button>
          </div>
          
          {/* Contador para desktop */}
          <div className="hidden lg:block text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
            {data.length} {data.length === 1 ? 'producto' : 'productos'}
          </div>
        </div>
      </div>

      {/* Mostrar filtros activos */}
      {hasActiveFilters() && <ActiveFiltersBar />}

      {/* Contenido principal grid */}
      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Sidebar filtros (solo desktop) */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            {/* MODIFICACIÓN: Cambiado top-24 a top-20 para acercarlo más al header */}
            <DesktopFilters />
          </div>
        </div>

        {/* Lista de productos - Incluye el drawer de filtros en móvil */}
        <div className="flex-grow relative mb-20">
          {/* Drawer lateral para filtros en móvil */}
          <SideDrawerFilters />
          
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mb-3"></div>
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            </div>
          ) : data.length > 0 ? (
            <div className="transition-opacity duration-300" style={{ opacity: loading ? 0.5 : 1 }}>
              <VerticalCard data={data} loading={loading} gridView={gridView} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-100">
              <div className="mb-4 text-gray-400">
                <BiX size={48} className="mx-auto" />
              </div>
              <p className="text-lg text-gray-600 mb-4">No se encontraron productos con los filtros seleccionados</p>
              <button 
                onClick={clearAllFilters}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente principal que envuelve todo con el proveedor de contexto
const CategoryProduct = () => {
  return (
    <FilterProvider>
      <CategoryProductContent />
    </FilterProvider>
  );
};

export default CategoryProduct;