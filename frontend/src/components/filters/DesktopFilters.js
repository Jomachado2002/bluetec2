// src/components/filters/DesktopFilters.js
import React, { useMemo, useState } from 'react';
import { BiSort } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { useFilters } from '../../context/FilterContext';
import FilterAccordion from './FilterAccordion';
import FilterCheckbox from './FilterCheckbox';
import PriceFilterAccordion from './PriceFilterAccordion';
import SpecificationFilter from './SpecificationFilter';
import productCategory from '../../helpers/productCategory';

const DesktopFilters = () => {
  const { 
    filterCategoryList, 
    filterSubcategoryList, 
    filterBrands, 
    setFilterBrands,
    sortBy, 
    setSortBy, 
    handleSelectCategory, 
    handleSelectSubcategory,
    availableFilters,
    data,
    clearAllFilters,
    hasActiveFilters
  } = useFilters();
  
  const [searchBrand, setSearchBrand] = useState('');
  
  // Filtrar marcas por término de búsqueda
  const filteredBrands = useMemo(() => {
    return availableFilters.brands.filter(brand => 
      brand.toLowerCase().includes(searchBrand.toLowerCase())
    );
  }, [availableFilters.brands, searchBrand]);
  
  // Obtener etiqueta para especificación
  const getSpecificationLabel = (specKey) => {
    const labels = {
      processor: "Procesador",
      memory: "Memoria RAM",
      storage: "Almacenamiento",
      disk: "Disco",
      graphicsCard: "Tarjeta Gráfica",
      notebookScreen: "Pantalla",
      motherboardSocket: "Socket",
      processorSocket: "Socket",
      ramType: "Tipo de RAM",
      diskType: "Tipo de Disco",
      // Añadir más mappings según necesidades...
    };
    
    return labels[specKey] || specKey;
  };
  
  return (
    <div className="space-y-1">
      <div className="bg-gray-50 p-4 mb-4 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Filtros</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {data.length} {data.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </p>
          {hasActiveFilters() && (
            <button 
              onClick={clearAllFilters}
              className="text-xs text-green-600 hover:text-green-800 hover:underline font-medium"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>
      
      {/* Precio */}
      <PriceFilterAccordion />
      
      {/* Ordenar por */}
      <FilterAccordion
        id="sort"
        title="Ordenar por"
        icon={<BiSort />}
        count={sortBy ? 1 : 0}
      >
        <div className="px-1">
          <label className="flex items-center py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <input
              type="radio"
              name="sortBy"
              value="asc"
              checked={sortBy === 'asc'}
              onChange={() => setSortBy('asc')}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Precio: Menor a mayor</span>
          </label>
          <label className="flex items-center py-1.5 px-2 rounded hover:bg-gray-100 cursor-pointer transition-colors">
            <input
              type="radio"
              name="sortBy"
              value="dsc"
              checked={sortBy === 'dsc'}
              onChange={() => setSortBy('dsc')}
              className="text-green-600 focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Precio: Mayor a menor</span>
          </label>
        </div>
      </FilterAccordion>

      {/* Categorías */}
      <FilterAccordion
        id="categories"
        title="Categorías"
        count={filterCategoryList.length}
      >
        <div className="px-1 max-h-60 overflow-y-auto">
          {productCategory.map((category) => (
            <div key={category.value} className="mb-2">
              <FilterCheckbox
                label={category.label}
                checked={filterCategoryList.includes(category.value)}
                onChange={() => handleSelectCategory(category.value)}
                bold={true}
              />
              
              {filterCategoryList.includes(category.value) && category.subcategories && (
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-green-200 pl-2">
                  {category.subcategories.map((subcat) => (
                    <FilterCheckbox
                      key={subcat.value}
                      label={subcat.label}
                      checked={filterSubcategoryList.includes(subcat.value)}
                      onChange={() => handleSelectSubcategory(subcat.value)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </FilterAccordion>

      {/* Marcas */}
      {availableFilters.brands && availableFilters.brands.length > 0 && (
        <FilterAccordion
          id="brands"
          title="Marcas"
          count={filterBrands.length}
        >
          <div className="px-1">
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Buscar marca..."
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchBrand}
                onChange={(e) => setSearchBrand(e.target.value)}
              />
              <FiSearch className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded bg-white">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <FilterCheckbox
                    key={brand}
                    label={brand}
                    checked={filterBrands.includes(brand)}
                    onChange={() => {
                      const newBrands = filterBrands.includes(brand)
                        ? filterBrands.filter(b => b !== brand)
                        : [...filterBrands, brand];
                      setFilterBrands(newBrands);
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 py-3 text-center">No se encontraron marcas</p>
              )}
            </div>
          </div>
        </FilterAccordion>
      )}
      
      {/* Especificaciones */}
      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2 border-b pb-2">Especificaciones</h3>
        {Object.keys(availableFilters.specifications).map(specKey => (
          <SpecificationFilter
            key={specKey}
            title={getSpecificationLabel(specKey)}
            specKey={specKey}
            options={availableFilters.specifications[specKey] || []}
          />
        ))}
        {Object.keys(availableFilters.specifications).length === 0 && (
          <p className="text-sm text-gray-500 py-2 text-center italic">
            Selecciona una categoría para ver las especificaciones disponibles
          </p>
        )}
      </div>
    </div>
  );
};

export default DesktopFilters;