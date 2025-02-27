import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CpuIcon, MemoryStickIcon, HardDriveIcon, BatteryIcon } from 'lucide-react';

const NotebookBanner = () => {
  const navigate = useNavigate();

  const handleNavigateToNotebooks = () => {
    navigate('/categoria-producto?category=informatica&subcategory=notebooks');
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-600 rounded-xl p-6 text-white h-full flex flex-col justify-between shadow-lg">
      {/* Encabezado */}
      <div>
        <h3 className="text-2xl font-bold mb-2">Guía de Compra</h3>
        <p className="text-green-100 text-sm mb-6">Encuentra la notebook perfecta para ti</p>
      </div>

      {/* Lista de características */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CpuIcon className="w-6 h-6 mt-1 text-green-300" />
          <div>
            <p className="font-semibold">Procesador</p>
            <p className="text-sm text-green-100">Intel Core i5/i7 o AMD Ryzen 5/7</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MemoryStickIcon className="w-6 h-6 mt-1 text-green-300" />
          <div>
            <p className="font-semibold">Memoria RAM</p>
            <p className="text-sm text-green-100">Mínimo 8GB, recomendado 16GB</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <HardDriveIcon className="w-6 h-6 mt-1 text-green-300" />
          <div>
            <p className="font-semibold">Almacenamiento</p>
            <p className="text-sm text-green-100">SSD 256GB o superior</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BatteryIcon className="w-6 h-6 mt-1 text-green-300" />
          <div>
            <p className="font-semibold">Batería</p>
            <p className="text-sm text-green-100">Mínimo 4 horas de autonomía</p>
          </div>
        </div>
      </div>

      {/* Botón de acción */}
      <button 
        className="mt-6 bg-white text-green-700 px-6 py-2 rounded-full font-medium hover:bg-green-50 transition-colors w-full text-center"
        onClick={handleNavigateToNotebooks}
      >
        Ver catálogo completo
      </button>
    </div>
  );
};

export default NotebookBanner;