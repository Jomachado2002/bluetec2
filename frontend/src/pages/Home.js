import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import BannerProduct from '../components/BannerProduct';
import HorizontalCardProduct from '../components/HorizontalCardProduct';
import VerticalCardProduct from '../components/VerticalCardProduct';
import BrandCarousel from '../components/BrandCarousel';
import NotebookBanner from '../components/NotebookBanner';
import '../styles/global.css';

// Animaciones predefinidas
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Home = () => {
  // Lazy load imágenes y componentes
  useEffect(() => {
    // Prefetch imágenes críticas
    const prefetchImages = () => {
      const imageUrls = [
        // Agrega URLs de imágenes críticas aquí
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };
    
    prefetchImages();
  }, []);

  return (
    <>
      <Helmet>
        <title>Lo Mejor en Informática en Paraguay | Tu Tienda</title>
        <meta
          name="description"
          content="Descubre los mejores productos de informática, notebooks, placas madre, computadoras ensambladas, monitores y más en Tu Tienda. ¡Ofertas exclusivas en Paraguay!"
        />
        <meta
          name="keywords"
          content="informática, notebooks, placas madre, computadoras, monitores, Paraguay, tecnología, ofertas"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-inter text-gray-800">
        {/* Hero Banner con animación */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="relative bg-white shadow-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="container mx-auto py-4 sm:py-6 px-4">
            <BannerProduct />
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-green-400 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute bottom-0 left-1/4 -mb-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
        </motion.div>

        {/* Contenido principal con animaciones */}
        <div className="space-y-16 py-16">
          {/* Sección: Notebooks */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
            className="container mx-auto px-4"
          >
            <div className="flex flex-col lg:flex-row items-stretch gap-8">
              {/* Imagen destacada */}
              <motion.div 
                variants={fadeIn}
                className="w-full lg:w-1/3"
              >
                <div className="h-full relative overflow-hidden rounded-2xl shadow-2xl group">
                  <NotebookBanner />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                    <div className="text-white">
                      <h3 className="text-xl sm:text-2xl font-bold">Notebooks Premium</h3>
                      <p className="text-sm mt-2 opacity-90">Potencia y rendimiento en cualquier lugar</p>
                      <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium transition duration-300 shine-button">
                        Explorar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Carousel de notebooks */}
              <motion.div 
                variants={fadeIn}
                className="w-full lg:w-2/3"
              >
                <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                  <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4 flex items-center">
                    <span className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Notebooks de Alto Rendimiento
                  </h2>
                  <div className="h-1 w-32 bg-green-600 mb-6 rounded-full"></div>
                  
                  <HorizontalCardProduct
                    category="informatica"
                    subcategory="notebooks"
                    heading=""
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Sección: Placas Madre - Cambiada a fondo blanco con VerticalCardProduct */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="container mx-auto px-4"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Placas Madre</h2>
                    <p className="mt-2 text-gray-600 max-w-lg">La base perfecta para tu próximo sistema de alto rendimiento</p>
                    <div className="h-1 w-24 bg-blue-600 mt-2 rounded-full"></div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition duration-300 shadow-md shine-button">
                    Ver toda la colección
                  </button>
                </div>
                
                <div className="mt-6">
                  <VerticalCardProduct
                    category="informatica"
                    subcategory="placas_madre"
                    heading=""
                  />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Grid de 2x2 para Computadoras, Monitores, Memorias RAM y Discos Duros */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="container mx-auto px-4"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Computadoras Ensambladas */}
              <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                    </span>
                    Computadoras Ensambladas
                  </h2>
                  <div className="h-1 w-24 bg-green-500 mt-2 mb-4 rounded-full"></div>
                </div>
                <div className="p-4">
                  <VerticalCardProduct
                    category="informatica"
                    subcategory="computadoras_ensambladas"
                    heading=""
                  />
                </div>
              </motion.div>
              
              {/* Monitores */}
              <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    Monitores
                  </h2>
                  <div className="h-1 w-20 bg-yellow-400 mt-2 mb-4 rounded-full"></div>
                </div>
                <div className="p-4">
                  <VerticalCardProduct
                    category="perifericos"
                    subcategory="monitores"
                    heading=""
                  />
                </div>
              </motion.div>
              
              {/* Memorias RAM */}
              <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    Memorias RAM
                  </h2>
                  <div className="h-1 w-20 bg-purple-300 mt-2 mb-4 rounded-full"></div>
                </div>
                <div className="p-4">
                  <VerticalCardProduct
                    category="informatica"
                    subcategory="memorias_ram"
                    heading=""
                  />
                </div>
              </motion.div>
              
              {/* Discos Duros */}
              <motion.div variants={fadeIn} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center">
                    <span className="mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </span>
                    Discos Duros
                  </h2>
                  <div className="h-1 w-20 bg-yellow-300 mt-2 mb-4 rounded-full"></div>
                </div>
                <div className="p-4">
                  <VerticalCardProduct
                    category="informatica"
                    subcategory="discos_duros"
                    heading=""
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Sección: Productos Destacados */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideUp}
            className="container mx-auto px-4"
          >
            <div className="text-center mb-10">
              <h2 className="inline-block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
                Productos Destacados
              </h2>
              <div className="h-1 w-40 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-3 rounded-full"></div>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Descubre nuestra selección de productos más populares y exclusivos</p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
              <VerticalCardProduct
                category="informatica"
                subcategory="destacados"
                heading=""
              />
            </div>
          </motion.section>

          {/* Sección: Marcas Destacadas */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="container mx-auto px-4"
          >
            <div className="bg-white rounded-2xl shadow-lg py-10 px-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                  Marcas Destacadas
                </h2>
                <div className="h-1 w-32 bg-gray-800 mx-auto mt-3 rounded-full"></div>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Trabajamos con las mejores marcas para ofrecerte la mejor calidad y garantía</p>
              </div>
              
              <div className="relative py-4">
                {/* Efectos decorativos */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-xl"></div>
                
                <BrandCarousel />
              </div>
            </div>
          </motion.section>
          
          {/* Banner CTA */}
          <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="container mx-auto px-4"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-green-800 to-green-600 rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              
              <div className="relative z-10 px-6 py-12 sm:px-12 text-center sm:text-left">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div className="mb-6 sm:mb-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">¿Necesitas ayuda para elegir?</h2>
                    <p className="text-green-100">Nuestros expertos están listos para asesorarte y encontrar la solución perfecta para ti.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-3 bg-white text-green-700 hover:bg-gray-100 rounded-lg font-medium transition duration-300 shadow-md shine-button">
                      Contactar Asesor
                    </button>
                    <button className="px-6 py-3 bg-green-700 text-white hover:bg-green-800 rounded-lg font-medium transition duration-300 shadow-md border border-green-500 shine-button">
                      Ver Tiendas
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-yellow-300 rounded-full opacity-20 blur-xl"></div>
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Home;
