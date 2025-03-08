// src/components/OptimizedImage.jsx
import React, { useEffect, useRef, useState } from 'react';

// Componente de imagen con carga optimizada y soporte para múltiples servicios
const OptimizedImage = React.memo(({ src, alt, index, className, width = 150, height = 150 }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const placeholderUrl = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect width="100%25" height="100%25" fill="%23f3f4f6"/%3E%3C/svg%3E';

  // Función para determinar el servicio y optimizar la URL
  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return placeholderUrl;
    
    try {
      // Analizar la URL para determinar el servicio
      if (originalUrl.includes('cloudinary.com')) {
        // Optimización para Cloudinary
        const urlParts = originalUrl.split('/upload/');
        if (urlParts.length !== 2) return originalUrl;

        // Determinar transformaciones según el dispositivo
        const isMobile = window.innerWidth < 768;
        
        // Configurar transformaciones de Cloudinary
        const transformations = isMobile 
          ? 'q_auto:eco,f_auto,w_300,c_limit,fl_lossy,fl_progressive/' 
          : 'q_auto,f_auto,w_500,c_limit,fl_progressive/';
        
        return `${urlParts[0]}/upload/${transformations}${urlParts[1]}`;
      } 
      else if (originalUrl.includes('firebasestorage.googleapis.com')) {
        // Para Firebase Storage
        // Firebase no permite transformaciones directas en la URL como Cloudinary
        return originalUrl;
      }
      else {
        // Para otras fuentes de imágenes
        return originalUrl;
      }
    } catch (error) {
      console.error("Error optimizando URL de imagen:", error);
      return originalUrl;
    }
  };

  // Configurar intersection observer para carga lazy
  useEffect(() => {
    if (observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && imgRef.current) {
          // Obtener URL optimizada
          const optimizedUrl = getOptimizedImageUrl(src);
          
          // Asignar a src solo cuando el elemento esté visible
          imgRef.current.src = optimizedUrl;
          
          // Desconectar observer después de cargar
          observerRef.current.disconnect();
        }
      },
      { 
        rootMargin: '200px 0px', // Precarga cuando la imagen está a 200px de entrar en viewport
        threshold: 0.01 // Comienza a cargar cuando al menos 1% de la imagen es visible
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  // Limpiar observer en desmontaje
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Imagen placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
          </svg>
        </div>
      )}

      {/* Imagen real con atributos de optimización */}
      <img 
        ref={imgRef}
        src={index < 2 ? getOptimizedImageUrl(src) : placeholderUrl} // Carga inmediata solo para las primeras 2 imágenes
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        width={width}
        height={height}
        loading={index < 2 ? "eager" : "lazy"}
        decoding="async" // Permite decodificación asíncrona
        fetchpriority={index < 2 ? "high" : "low"} // Priorización de carga
      />

      {/* Imagen de error */}
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
    </div>
  );
});

export default OptimizedImage;