// src/components/filters/ActiveFiltersBar.js
import React from 'react';
import { BiX } from 'react-icons/bi';
import { useFilters } from '../../context/FilterContext';
import productCategory from '../../helpers/productCategory';

const ActiveFiltersBar = () => {
  const { 
    filterCategoryList, 
    filterSubcategoryList, 
    filterBrands, 
    specFilters, 
    priceRange, 
    handleSelectCategory, 
    handleSelectSubcategory, 
    setFilterBrands, 
    handleSpecFilterChange,
    setPriceRange,
    clearAllFilters,
    hasActiveFilters
  } = useFilters();
  
  if (!hasActiveFilters()) return null;
  
  // Función para obtener la etiqueta de la especificación
  const getSpecificationLabel = (specKey) => {
    const labels = {
      // Notebooks
      processor: "Procesador",
      memory: "Memoria RAM",
      storage: "Almacenamiento",
      disk: "Disco",
      graphicsCard: "Tarjeta Gráfica",
      // Añadir más mappings según necesidades...
    };
    
    return labels[specKey] || specKey;
  };
  
  // Componente para chip de filtro
  const FilterChip = ({ label, onRemove }) => (
    <div className="inline-flex items-center bg-green-100 rounded-full px-3 py-1 text-sm text-green-800 mr-2 mb-2 border border-green-200 shadow-sm">
      <span className="mr-1 font-medium">{label}</span>
      <button 
        onClick={onRemove} 
        className="text-green-700 hover:text-green-900 hover:bg-green-200 rounded-full p-0.5"
        aria-label={`Eliminar filtro ${label}`}
      >
        <BiX className="text-lg" />
      </button>
    </div>
  );
  
  return (
    <div className="mb-4 bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-800">Filtros activos</h3>
        <button 
          onClick={clearAllFilters}
          className="text-xs text-green-600 hover:text-green-800 hover:underline font-medium"
        >
          Limpiar todos
        </button>
      </div>
      
      <div className="flex flex-wrap">
        {/* Chips de categorías */}
        {filterCategoryList.map(cat => {
          const category = productCategory.find(c => c.value === cat);
          return (
            <FilterChip 
              key={`cat-${cat}`} 
              label={`Categoría: ${category?.label || cat}`} 
              onRemove={() => handleSelectCategory(cat)} 
            />
          );
        })}
        
        {/* Chips de subcategorías */}
        {filterSubcategoryList.map(sub => {
          let subcategoryLabel = sub;
          productCategory.forEach(cat => {
            const foundSub = cat.subcategories?.find(s => s.value === sub);
            if (foundSub) subcategoryLabel = foundSub.label;
          });
          return (
            <FilterChip 
              key={`sub-${sub}`} 
              label={`Subcategoría: ${subcategoryLabel}`} 
              onRemove={() => handleSelectSubcategory(sub)} 
            />
          );
        })}
        
        {/* Chips de marcas */}
        {filterBrands.map(brand => (
          <FilterChip 
            key={`brand-${brand}`} 
            label={`Marca: ${brand}`} 
            onRemove={() => setFilterBrands(prev => prev.filter(b => b !== brand))} 
          />
        ))}
        
        {/* Chips de especificaciones */}
        {Object.entries(specFilters).map(([specKey, values]) => 
          values.map(value => (
            <FilterChip 
              key={`spec-${specKey}-${value}`} 
              label={`${getSpecificationLabel(specKey)}: ${value}`} 
              onRemove={() => handleSpecFilterChange(specKey, value)} 
            />
          ))
        )}
        
        {/* Chip de rango de precio */}
        {(priceRange.min || priceRange.max) && (
          <FilterChip 
            label={`Precio: ${priceRange.min ? `Gs. ${Number(priceRange.min).toLocaleString()}` : 'Gs. 0'} - ${priceRange.max ? `Gs. ${Number(priceRange.max).toLocaleString()}` : 'Sin límite'}`} 
            onRemove={() => setPriceRange({ min: '', max: '' })} 
          />
        )}
      </div>
    </div>
  );
};

export default ActiveFiltersBar;