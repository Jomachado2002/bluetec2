import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CpuIcon, 
  MemoryStickIcon, 
  HardDriveIcon, 
  BatteryIcon, 
  ArrowRightIcon,
  GlobeIcon,
  MonitorIcon,
  MouseIcon
} from 'lucide-react';

// Función para hacer scroll al inicio de la página
const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const NotebookBanner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Datos para las diferentes pestañas
  const tabsData = [
    {
      id: 'notebooks',
      title: 'Notebooks',
      category: 'informatica',
      subcategory: 'notebooks',
      icon: <CpuIcon className="w-5 h-5" />,
      specs: [
        { icon: <CpuIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Procesador', desc: 'Intel Core i5/i7 o AMD Ryzen 5/7' },
        { icon: <MemoryStickIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Memoria RAM', desc: 'Mínimo 8GB, recomendado 16GB' },
        { icon: <HardDriveIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Almacenamiento', desc: 'SSD 256GB o superior' },
        { icon: <BatteryIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Batería', desc: 'Mínimo 4 horas de autonomía' }
      ]
    },
    {
      id: 'perifericos',
      title: 'Periféricos',
      category: 'perifericos',
      subcategory: '',
      icon: <MouseIcon className="w-5 h-5" />,
      specs: [
        { icon: <MonitorIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Monitores', desc: 'Alta resolución para mayor productividad' },
        { icon: <MouseIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Mouse', desc: 'Precisión para gaming y trabajo' },
        { icon: <GlobeIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Conectividad', desc: 'Amplia selección de adaptadores' },
        { icon: <HardDriveIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Almacenamiento', desc: 'Discos externos de alta velocidad' }
      ]
    },
    {
      id: 'memorias_ram',
      title: 'Memorias',
      category: 'informatica',
      subcategory: 'memorias_ram',
      icon: <MemoryStickIcon className="w-5 h-5" />,
      specs: [
        { icon: <MemoryStickIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Capacidad', desc: 'Desde 8GB hasta 64GB' },
        { icon: <CpuIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Frecuencia', desc: 'DDR4 y DDR5 de alta velocidad' },
        { icon: <HardDriveIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Latencia', desc: 'Baja latencia para mejor rendimiento' },
        { icon: <GlobeIcon className="w-6 h-6 mt-1 text-green-300" />, title: 'Compatibilidad', desc: 'Para desktop y laptop' }
      ]
    }
  ];

  const handleNavigate = (category, subcategory) => {
    scrollTop();
    navigate(`/categoria-producto?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}`);
  };

  const activeTabData = tabsData[activeTab];

  return (
    <div className="relative h-full rounded-xl overflow-hidden">
      {/* Fondo con pattern y gradiente */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-600"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Encabezado con pestañas */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {tabsData.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                  ${activeTab === index 
                    ? 'bg-white text-green-700 shadow-lg' 
                    : 'bg-green-700/30 text-white hover:bg-green-700/50'}`}
              >
                {tab.icon}
                {tab.title}
              </button>
            ))}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-1">Guía de Compra</h3>
          <div className="w-16 h-1 bg-green-400 rounded mb-2"></div>
          <p className="text-green-100 text-sm">
            Encuentra el {activeTabData.title.toLowerCase()} perfecto para ti
          </p>
        </div>
        
        {/* Lista de características con animación */}
        <div className="space-y-3 mt-4">
          {activeTabData.specs.map((spec, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 transform transition-all duration-300 hover:translate-x-1"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {spec.icon}
              <div>
                <p className="font-semibold text-white">{spec.title}</p>
                <p className="text-sm text-green-100">{spec.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Botón con efectos */}
        <button
          className="mt-6 bg-white text-green-700 px-6 py-3 rounded-lg font-medium 
                    hover:bg-green-50 active:scale-95 transition-all duration-300
                    shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full"
          onClick={() => handleNavigate(activeTabData.category, activeTabData.subcategory)}
        >
          Ver catálogo completo
          <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      
      {/* Decoración angular en la esquina */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-green-500 opacity-70 transform rotate-45 translate-x-8 -translate-y-8"></div>
      
      {/* Círculos decorativos */}
      <div className="absolute bottom-4 right-4 w-20 h-20 border-4 border-green-500/30 rounded-full"></div>
      <div className="absolute top-1/2 right-8 w-6 h-6 bg-green-400/40 rounded-full"></div>
      
      {/* Estilos CSS para el patrón de fondo */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default NotebookBanner;