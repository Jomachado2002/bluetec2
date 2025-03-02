import React, { useState, useEffect } from 'react';
import { FaCoins } from 'react-icons/fa';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

// Componente PriceSlider
const PriceSlider = ({ minPrice = 0, maxPrice = 20000000, currentPriceRange, onApply }) => {
  const [localRange, setLocalRange] = useState({
    min: currentPriceRange.min || minPrice,
    max: currentPriceRange.max || maxPrice
  });

  // Actualizar localRange cuando cambia currentPriceRange desde el componente padre
  useEffect(() => {
    setLocalRange({
      min: currentPriceRange.min || minPrice,
      max: currentPriceRange.max || maxPrice
    });
  }, [currentPriceRange, minPrice, maxPrice]);

  // Formatear precio como Gs. 1.000.000
  const formatPrice = (price) => {
    return `Gs. ${Number(price).toLocaleString('es-PY')}`;
  };

  // Manejar cambios en los sliders
  const handleSliderChange = (e, type) => {
    const value = parseInt(e.target.value);
    setLocalRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Garantizar que min no sobrepase max y viceversa
  useEffect(() => {
    if (parseInt(localRange.min) > parseInt(localRange.max)) {
      setLocalRange(prev => ({
        ...prev,
        min: parseInt(localRange.max)
      }));
    }
  }, [localRange.min, localRange.max]);

  return (
    <div className="p-3 space-y-4 bg-white rounded-lg">
      {/* Muestra del rango actual */}
      <div className="flex justify-between items-center">
        <div className="text-green-700 font-semibold">
          {formatPrice(localRange.min)}
        </div>
        <div className="text-gray-400">-</div>
        <div className="text-green-700 font-semibold">
          {formatPrice(localRange.max)}
        </div>
      </div>

      {/* Slider doble */}
      <div className="relative pt-5 pb-2">
        {/* Barra de fondo */}
        <div className="absolute left-0 right-0 h-2 bg-gray-200 rounded-full top-[1.7rem]"></div>
        
        {/* Barra coloreada entre los dos sliders */}
        <div 
          className="absolute h-2 bg-green-500 rounded-full top-[1.7rem]"
          style={{ 
            left: `${((localRange.min - minPrice) / (maxPrice - minPrice)) * 100}%`, 
            right: `${100 - ((localRange.max - minPrice) / (maxPrice - minPrice)) * 100}%` 
          }}
        ></div>
        
        {/* Slider mínimo */}
        <input 
          type="range" 
          min={minPrice} 
          max={maxPrice} 
          value={localRange.min}
          onChange={(e) => handleSliderChange(e, 'min')}
          className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 top-6"
          style={{
            '--range-thumb-bg': '#10B981',
            '--range-thumb-border': '2px solid white',
            '--range-thumb-shadow': '0 0 0 2px rgba(16, 185, 129, 0.2)',
            '--range-track-height': '0px',
            height: '20px'
          }}
        />
        
        {/* Slider máximo */}
        <input 
          type="range" 
          min={minPrice} 
          max={maxPrice} 
          value={localRange.max}
          onChange={(e) => handleSliderChange(e, 'max')}
          className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 top-6"
          style={{
            '--range-thumb-bg': '#10B981',
            '--range-thumb-border': '2px solid white',
            '--range-thumb-shadow': '0 0 0 2px rgba(16, 185, 129, 0.2)',
            '--range-track-height': '0px',
            height: '20px'
          }}
        />
      </div>

      {/* Botón de aplicar */}
      <button
        onClick={() => onApply(localRange)}
        className="w-full py-2 mt-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
      >
        <span>Aplicar filtro</span>
      </button>
    </div>
  );
};

// Componente acordeón para el filtro de precio
const PriceFilterAccordion = ({ currentPriceRange, onApplyPriceFilter }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasActiveFilter = currentPriceRange.min || currentPriceRange.max;

  return (
    <div className="border-b border-gray-200 py-2">
      <button 
        className="w-full flex items-center justify-between py-3 px-2 text-left focus:outline-none hover:bg-gray-50 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <span className="mr-2 text-gray-500"><FaCoins /></span>
          <span className="font-semibold text-gray-800">Rango de Precio</span>
          {hasActiveFilter && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
              Activo
            </span>
          )}
        </div>
        <span className="text-gray-500">
          {isOpen ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
        </span>
      </button>
      
      {isOpen && (
        <div className="py-2 pl-2 pr-1 bg-gray-50 rounded-md mt-1 mb-2">
          <PriceSlider 
            minPrice={0} 
            maxPrice={50000000} 
            currentPriceRange={currentPriceRange}
            onApply={onApplyPriceFilter}
          />
        </div>
      )}
    </div>
  );
};

export default PriceFilterAccordion;