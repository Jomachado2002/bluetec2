import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, useScroll, useTransform } from 'framer-motion';


const Nosotros = () => {
  // Animaciones para el scroll
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
  // Animaciones para elementos
  const fadeIn = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Animación para tarjetas de valores
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Nosotros | Conoce Tu Tienda | Paraguay</title>
        <meta
          name="description"
          content="Somos una tienda e-commerce de insumos informáticos en Paraguay. Descubre nuestra misión, visión y los servicios que ofrecemos."
        />
      </Helmet>
      
      {/* Hero Section con Parallax */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900 to-green-700 z-0"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-500 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        {/* Patrón de fondo */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg"
          >
            Conoce Tu Tienda
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-green-100 max-w-3xl mx-auto mb-8"
          >
            Tu aliado tecnológico en Paraguay, ofreciendo los mejores productos informáticos con la mejor calidad y garantía.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button 
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: 'smooth'
                });
              }}
              className="px-8 py-4 bg-white text-green-700 hover:bg-green-50 rounded-lg font-bold text-lg transition duration-300 shadow-lg shine-button"
            >
              Descubre Nuestra Historia
            </button>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-8 h-14 border-2 border-white rounded-full flex justify-center">
            <motion.div 
              animate={{ 
                y: [0, 10, 0], 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5 
              }}
              className="w-2 h-2 bg-white rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Nuestra Historia */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
              Nuestra Historia
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600">
              Nacimos con la misión de ofrecer soluciones tecnológicas de calidad a todos los paraguayos, brindando una experiencia de compra excepcional, sin necesidad de salir de casa.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeIn}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="bg-green-50 p-8 h-full">
                <div className="h-1 w-20 bg-green-500 rounded-full mb-6"></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">De Idea a Realidad</h3>
                <p className="text-gray-600 mb-4">
                  Tu Tienda comenzó como un sueño de llevar la mejor tecnología a cada rincón de Paraguay. Identificamos la necesidad de ofrecer productos informáticos de calidad con asesoramiento experto y precios competitivos.
                </p>
                <p className="text-gray-600">
                  Hoy en día, nos hemos convertido en una referencia en el mercado paraguayo, destacándonos por nuestra atención personalizada y envíos rápidos a todo el país.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="relative"
            >
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-pattern-dot opacity-10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-6xl text-green-600 font-bold mb-4">2023</div>
                    <p className="text-xl text-gray-700">Año de fundación</p>
                  </div>
                </div>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Misión, Visión y Valores */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="py-20 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
              Misión, Visión y Valores
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Misión */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="h-2 bg-green-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Misión</h3>
                <p className="text-gray-600">
                  Proporcionar soluciones tecnológicas de alta calidad a precios accesibles, ofreciendo un servicio de asesoramiento personalizado y una experiencia de compra excepcional, con envíos rápidos a todo Paraguay.
                </p>
              </div>
            </motion.div>
            
            {/* Visión */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="h-2 bg-blue-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Visión</h3>
                <p className="text-gray-600">
                  Ser la empresa líder en e-commerce de productos informáticos en Paraguay, reconocida por la calidad de nuestros productos, la excelencia en el servicio al cliente y la innovación constante en nuestra plataforma.
                </p>
              </div>
            </motion.div>
            
            {/* Valores */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="h-2 bg-purple-500"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Valores</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Integridad y transparencia
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Compromiso con la calidad
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Excelencia en el servicio
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Innovación constante
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span> Responsabilidad social
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Nuestros Servicios */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
              Nuestros Servicios
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una experiencia de compra completa con servicios que nos diferencian en el mercado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Servicio 1 */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ventas Online</h3>
                <p className="text-gray-600">
                  Compra desde la comodidad de tu hogar. Nuestra plataforma está diseñada para ofrecerte una experiencia de compra fácil y segura.
                </p>
              </div>
            </motion.div>
            
            {/* Servicio 2 */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Envíos Rápidos</h3>
                <p className="text-gray-600">
                  Entregamos en todo Paraguay entre 24 a 48 horas hábiles después de procesado el pago. Seguimiento en tiempo real.
                </p>
              </div>
            </motion.div>
            
            {/* Servicio 3 */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Soporte Técnico</h3>
                <p className="text-gray-600">
                  Asesoramiento pre y post venta. Nuestro equipo te ayudará a elegir los productos ideales y resolver cualquier duda técnica.
                </p>
              </div>
            </motion.div>
            
            {/* Servicio 4 */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Garantía</h3>
                <p className="text-gray-600">
                  Todos nuestros productos cuentan con garantía oficial. Respaldamos cada venta para que compres con total confianza.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Ubicación */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="py-20 bg-gray-50"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 relative inline-block">
                Nuestra Ubicación
                <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              </h2>
              <p className="text-lg text-gray-600">
                Aunque somos principalmente una tienda online, también contamos con un local físico donde puedes retirar tus productos.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Información de Contacto</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">Dirección</h4>
                        <p className="text-gray-600">Av. Eusebio Ayala 1234, Asunción, Paraguay</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">Teléfono</h4>
                        <p className="text-gray-600">+595 972 971353</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">Email</h4>
                        <p className="text-gray-600">info@tutienda.com.py</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-800">WhatsApp</h4>
                        <p className="text-gray-600">+595 972 971353</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Horario de Atención</h3>
                    <div className="space-y-2 text-gray-600">
                      <p>Lunes a Viernes: 8:00 - 18:00</p>
                      <p>Sábados: 8:00 - 13:00</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-96 bg-gray-200 relative">
                  {/* Aquí iría un mapa real, pero por ahora mostramos un placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-600">Mapa de Ubicación</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* CTA Final */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="py-16 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 relative">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
              <div className="relative z-10 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">¡Compra ahora y recibe tu pedido en tiempo récord!</h2>
                <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
                  Nuestro compromiso es brindarte la mejor experiencia de compra online con envíos rápidos a todo Paraguay.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/" className="inline-block px-8 py-4 bg-white text-green-700 hover:bg-green-50 rounded-lg font-bold text-lg transition duration-300 shadow-lg shine-button">
                    Explorar Productos
                  </a>
                  <a href="/categoria-producto?category=informatica" className="inline-block px-8 py-4 bg-green-700 text-white hover:bg-green-800 rounded-lg font-bold text-lg transition duration-300 shadow-lg border border-green-500 shine-button">
                    Ver Categorías
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default Nosotros;