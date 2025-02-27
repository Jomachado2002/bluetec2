/**
 * Función para hacer scroll al inicio de la página que funciona en todos los navegadores,
 * incluyendo versiones antiguas de iOS y Android.
 * 
 * Esta implementación proporciona un fallback para navegadores que no soportan
 * el comportamiento 'smooth' y también garantiza la compatibilidad con
 * navegadores móviles que pueden tener problemas con window.scrollTo.
 */
const scrollTop = () => {
    // Verificar si el navegador soporta el comportamiento 'smooth'
    if ('scrollBehavior' in document.documentElement.style) {
      // Método moderno con comportamiento suave
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback para navegadores que no soportan scrollBehavior
      // Implementación de scroll suave manual para mayor compatibilidad
      const scrollStep = -window.scrollY / 15;
      const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
          window.scrollBy(0, scrollStep);
        } else {
          clearInterval(scrollInterval);
        }
      }, 15);
    }
  
    // Manejo adicional para iOS (Safari móvil) que puede ignorar window.scrollTo
    // en algunos casos específicos como dentro de iframes o con ciertos estilos CSS
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      document.body.scrollTop = 0; // Para Safari en iOS
      document.documentElement.scrollTop = 0; // Alternativa
    }
  };
  
  export default scrollTop;