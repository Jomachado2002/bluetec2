import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white">
      <footer>
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Información de ubicación */}
            <div className="text-center md:text-left">
              <h3 className="font-bold text-xl mb-4">Nos encontramos en:</h3>
              <p>Teodoro S.Mongelos</p>
              <p>C/Radio Operadores del Chaco</p>
              <p>Paraguay, Asunción</p>
              <div className="mt-4">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.979233243452!2d-57.60073192483278!3d-25.3049017776418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da94e740c5d0f%3A0x95b19c952580090a!2sClub%20River%20Plate!5e0!3m2!1ses-419!2spy!4v1728340866479!5m2!1ses-419!2spy"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-lg"
                ></iframe>
              </div>
            </div>

            {/* Información de contacto */}
            <div className="text-center">
              <h3 className="font-bold text-xl mb-4">Contacto</h3>
              <p className="mb-2">
                <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
                WhatsApp: +595 (984) 912683
              </p>
              <p className="mb-2">+595 972 971353</p>
              <p className="mb-2">Email: info@jmcomputer.com.py</p>
            </div>

            {/* Horario de atención */}
            <div className="text-center md:text-right">
              <h3 className="font-bold text-xl mb-4">Horario de Atención</h3>
              <p>Lunes a Viernes</p>
              <p>08:00 a 17:00 hrs</p>
              <p>Sábado:</p>
              <p>08:30 a 11:00 hrs</p>
            </div>
          </div>

          {/* Iconos de redes sociales */}
          <div className="flex justify-center space-x-6 mt-8">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors duration-200">
              <FontAwesomeIcon icon={faWhatsapp} size="2x" />
            </a>
          </div>

          {/* Derechos de autor */}
          <p className="text-center mt-8 text-gray-400">
            ©2024 JMcomputer Informática. Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Footer;