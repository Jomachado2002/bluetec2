// frontend/src/components/user/UserSupport.js
import React, { useState } from 'react';
import { 
  FaWhatsapp, 
  FaPhone, 
  FaEnvelope, 
  FaQuestionCircle,
  FaSearch,
  FaChevronDown,
  FaChevronRight,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaHeadset
} from 'react-icons/fa';

const UserSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // FAQ categorizado
  const faqCategories = [
    { id: 'all', label: 'Todas las categorías' },
    { id: 'orders', label: 'Pedidos y Envíos' },
    { id: 'payments', label: 'Pagos y Facturación' },
    { id: 'products', label: 'Productos' },
    { id: 'account', label: 'Mi Cuenta' },
    { id: 'warranty', label: 'Garantías' }
  ];

  const faqData = [
    {
      id: 1,
      category: 'orders',
      question: '¿Cuánto tiempo tarda en llegar mi pedido?',
      answer: 'Los pedidos dentro de Asunción y Gran Asunción llegan en 24-48 horas hábiles. Para el interior del país, el tiempo de entrega es de 3-5 días hábiles, dependiendo de la ubicación.'
    },
    {
      id: 2,
      category: 'orders',
      question: '¿Cómo puedo rastrear mi pedido?',
      answer: 'Puedes rastrear tu pedido desde tu panel de usuario en la sección "Mis Pedidos". También recibirás notificaciones por WhatsApp y email con el estado de tu envío.'
    },
    {
      id: 3,
      category: 'payments',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos con tarjetas de crédito y débito a través de Bancard, transferencias bancarias, y pago contra entrega (según disponibilidad en tu zona).'
    },
    {
      id: 4,
      category: 'payments',
      question: '¿Es seguro pagar con tarjeta online?',
      answer: 'Sí, utilizamos Bancard, el procesador de pagos más seguro de Paraguay. Tu información financiera está protegida con encriptación de última generación.'
    },
    {
      id: 5,
      category: 'products',
      question: '¿Los productos tienen garantía?',
      answer: 'Todos nuestros productos cuentan con garantía oficial del fabricante. La duración varía según el producto, desde 6 meses hasta 3 años.'
    },
    {
      id: 6,
      category: 'products',
      question: '¿Puedo devolver un producto?',
      answer: 'Sí, tienes 7 días para devolver productos defectuosos o que no cumplan con la descripción. Los productos deben estar en su empaque original.'
    },
    {
      id: 7,
      category: 'account',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a tu perfil en "Mi Cuenta", luego a la sección "Seguridad de la Cuenta" donde podrás cambiar tu contraseña actual por una nueva.'
    },
    {
      id: 8,
      category: 'account',
      question: '¿Puedo cambiar mi email registrado?',
      answer: 'Por seguridad, los cambios de email deben realizarse contactando directamente a nuestro equipo de soporte a través de WhatsApp o teléfono.'
    },
    {
      id: 9,
      category: 'warranty',
      question: '¿Cómo hago válida la garantía?',
      answer: 'Contáctanos con tu número de pedido y descripción del problema. Te guiaremos en el proceso de garantía que puede incluir reparación, reemplazo o reembolso.'
    },
    {
      id: 10,
      category: 'orders',
      question: '¿Cobran por el envío?',
      answer: 'El envío es gratuito para compras superiores a Gs. 1.000.000 dentro de Asunción. Para montos menores y envíos al interior, consultá los costos en el checkout.'
    }
  ];

  // Filtrar FAQs
  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  const contactMethods = [
    {
      type: 'whatsapp',
      title: 'WhatsApp',
      subtitle: '+595 984 133733',
      description: 'Respuesta inmediata durante horario comercial',
      icon: <FaWhatsapp className="text-2xl text-green-500" />,
      action: () => window.open('https://wa.me/595984133733?text=Hola,%20necesito%20ayuda%20con%20mi%20cuenta%20en%20BlueTec', '_blank'),
      available: true,
      responseTime: 'Inmediato'
    },
    {
      type: 'phone',
      title: 'Teléfono',
      subtitle: '+595 984 133733',
      description: 'Atención personalizada por teléfono',
      icon: <FaPhone className="text-2xl text-blue-500" />,
      action: () => window.open('tel:+595984133733'),
      available: true,
      responseTime: 'Inmediato'
    },
    {
      type: 'email',
      title: 'Email',
      subtitle: 'ventas@bluetec.com.py',
      description: 'Para consultas detalladas y documentación',
      icon: <FaEnvelope className="text-2xl text-purple-500" />,
      action: () => window.open('mailto:ventas@bluetec.com.py?subject=Consulta desde Mi Cuenta'),
      available: true,
      responseTime: '24 horas'
    }
  ];

  const businessHours = [
    { day: 'Lunes - Viernes', hours: '8:00 - 17:00' },
    { day: 'Sábado', hours: '8:30 - 11:00' },
    { day: 'Domingo', hours: 'Cerrado' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <FaHeadset className="mr-3 text-[#002060]" />
          Centro de Soporte
        </h1>
        <p className="text-gray-600">¿En qué podemos ayudarte hoy?</p>
      </div>

      {/* Métodos de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contactMethods.map((method) => (
          <div
            key={method.type}
            onClick={method.action}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-[#002060]"
          >
            <div className="flex items-center mb-4">
              {method.icon}
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.subtitle}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{method.description}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded-full ${
                method.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {method.available ? 'Disponible' : 'No disponible'}
              </span>
              <span className="text-xs text-gray-500">
                <FaClock className="inline mr-1" />
                {method.responseTime}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Horarios de atención */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          <FaClock className="mr-2" />
          Horarios de Atención
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {businessHours.map((schedule, index) => (
            <div key={index} className="text-center">
              <p className="font-medium text-blue-800">{schedule.day}</p>
              <p className="text-blue-700">{schedule.hours}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <p className="text-sm text-blue-800 flex items-center">
            <FaInfoCircle className="mr-2 flex-shrink-0" />
            <span>Para emergencias fuera del horario, envía un WhatsApp y te responderemos lo antes posible.</span>
          </p>
        </div>
      </div>

      {/* Preguntas Frecuentes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <FaQuestionCircle className="mr-2 text-[#002060]" />
          Preguntas Frecuentes
        </h3>

        {/* Búsqueda y filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
          >
            {faqCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de FAQs */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-8">
            <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No se encontraron preguntas que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-4 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  {openFaq === faq.id ? (
                    <FaChevronDown className="text-gray-500 flex-shrink-0 ml-2" />
                  ) : (
                    <FaChevronRight className="text-gray-500 flex-shrink-0 ml-2" />
                  )}
                </button>
                
                {openFaq === faq.id && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ubicación */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            Nuestra Ubicación
          </h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Dirección:</span> Asunción, Paraguay</p>
            <p><span className="font-medium">Zona:</span> Microcentro</p>
            <p className="text-xs text-gray-500 mt-3">
              * Contáctanos para coordinar visitas a nuestras instalaciones
            </p>
          </div>
        </div>

        {/* Recursos útiles */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <FaInfoCircle className="mr-2 text-blue-500" />
            Recursos Útiles
          </h4>
          <div className="space-y-3">
            <a
              href="#"
              className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => window.open('https://wa.me/595984133733?text=Necesito%20ayuda%20con%20la%20instalación%20de%20un%20producto', '_blank')}
            >
              • Guía de instalación de productos
            </a>
            <a
              href="#"
              className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => window.open('https://wa.me/595984133733?text=Quiero%20información%20sobre%20garantías', '_blank')}
            >
              • Políticas de garantía
            </a>
            <a
              href="#"
              className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => window.open('https://wa.me/595984133733?text=Necesito%20soporte%20técnico', '_blank')}
            >
              • Soporte técnico especializado
            </a>
            <a
              href="#"
              className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
              onClick={() => window.open('https://wa.me/595984133733?text=Quiero%20información%20sobre%20formas%20de%20pago', '_blank')}
            >
              • Formas de pago disponibles
            </a>
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-8 bg-[#002060] rounded-xl p-6 text-white text-center">
        <h3 className="text-lg font-semibold mb-2">¿No encontraste lo que buscabas?</h3>
        <p className="text-blue-100 mb-4">
          Nuestro equipo de soporte está listo para ayudarte con cualquier consulta
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.open('https://wa.me/595984133733?text=Hola,%20necesito%20ayuda%20personalizada', '_blank')}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaWhatsapp className="mr-2" />
            Contactar por WhatsApp
          </button>
          <button
            onClick={() => window.open('tel:+595984133733')}
            className="flex items-center justify-center px-6 py-3 bg-white text-[#002060] rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaPhone className="mr-2" />
            Llamar ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSupport;