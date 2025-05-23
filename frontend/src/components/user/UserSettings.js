// frontend/src/components/user/UserSettings.js
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FaBell, 
  FaEye, 
  FaShieldAlt, 
  FaDownload, 
  FaTrash,
  FaCheck,
  FaTimes,
  FaCog,
  FaPalette,
  FaLanguage,
  FaEnvelope,
  FaMobile
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserSettings = () => {
  const { userData, setUserData } = useOutletContext();
  const [settings, setSettings] = useState({
    notifications: {
      email: {
        orders: true,
        promotions: true,
        newProducts: false,
        priceAlerts: true
      },
      push: {
        orders: true,
        promotions: false,
        newProducts: false,
        priceAlerts: false
      }
    },
    privacy: {
      showProfile: false,
      showPurchaseHistory: false,
      allowDataCollection: true,
      allowTargetedAds: false
    },
    preferences: {
      theme: 'light', // light, dark, auto
      language: 'es',
      currency: 'PYG',
      defaultView: 'grid' // grid, list
    }
  });

  const [activeSection, setActiveSection] = useState('notifications');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Cargar configuraciones guardadas
    const savedSettings = userData.settings || {};
    setSettings(prev => ({
      ...prev,
      ...savedSettings
    }));
  }, [userData]);

  const handleSettingChange = (section, subsection, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [setting]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleDirectSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    const updatedUserData = {
      ...userData,
      settings: settings
    };
    
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setHasChanges(false);
    toast.success('Configuración guardada correctamente');
  };

  const resetSettings = () => {
    if (window.confirm('¿Estás seguro de que quieres restablecer todas las configuraciones?')) {
      const defaultSettings = {
        notifications: {
          email: {
            orders: true,
            promotions: true,
            newProducts: false,
            priceAlerts: true
          },
          push: {
            orders: true,
            promotions: false,
            newProducts: false,
            priceAlerts: false
          }
        },
        privacy: {
          showProfile: false,
          showPurchaseHistory: false,
          allowDataCollection: true,
          allowTargetedAds: false
        },
        preferences: {
          theme: 'light',
          language: 'es',
          currency: 'PYG',
          defaultView: 'grid'
        }
      };
      
      setSettings(defaultSettings);
      setHasChanges(true);
      toast.info('Configuración restablecida. Haz clic en "Guardar cambios" para aplicar.');
    }
  };

  const downloadUserData = () => {
    const dataToDownload = {
      profile: userData.profile || {},
      orders: userData.orders || [],
      wishlist: userData.wishlist || [],
      addresses: userData.addresses || [],
      settings: userData.settings || {},
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(dataToDownload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `mi-datos-bluetec-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Descarga de datos iniciada');
  };

  const clearAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODOS tus datos? Esta acción no se puede deshacer.')) {
      if (window.confirm('ÚLTIMA ADVERTENCIA: Esto eliminará tu historial de pedidos, direcciones, lista de deseos y configuraciones. ¿Continuar?')) {
        const clearedUserData = {
          orders: [],
          wishlist: [],
          addresses: [],
          settings: {},
          profile: {}
        };
        
        setUserData(clearedUserData);
        localStorage.setItem('userData', JSON.stringify(clearedUserData));
        toast.success('Todos los datos han sido eliminados');
      }
    }
  };

  const sections = [
    { id: 'notifications', label: 'Notificaciones', icon: <FaBell /> },
    { id: 'privacy', label: 'Privacidad', icon: <FaShieldAlt /> },
    { id: 'preferences', label: 'Preferencias', icon: <FaCog /> },
    { id: 'data', label: 'Mis Datos', icon: <FaDownload /> }
  ];

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="font-medium text-gray-800">{label}</p>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002060]"></div>
      </label>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en BlueTec</p>
        </div>
        
        {hasChanges && (
          <div className="flex gap-2">
            <button
              onClick={saveSettings}
              className="flex items-center px-4 py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
            >
              <FaCheck className="mr-2" />
              Guardar cambios
            </button>
            <button
              onClick={() => {
                setSettings(userData.settings || {});
                setHasChanges(false);
              }}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar de secciones */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="font-semibold text-gray-800 mb-4">Secciones</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors text-left ${
                      activeSection === section.id
                        ? 'bg-[#002060] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{section.icon}</span>
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-md p-6">
            
            {/* Sección de Notificaciones */}
            {activeSection === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <FaBell className="mr-2 text-[#002060]" />
                  Notificaciones
                </h3>

                <div className="space-y-6">
                  {/* Notificaciones por Email */}
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center mb-4">
                      <FaEnvelope className="text-blue-500 mr-2" />
                      <h4 className="font-medium text-gray-800">Notificaciones por Email</h4>
                    </div>
                    
                    <div className="space-y-1">
                      <ToggleSwitch
                        checked={settings.notifications.email.orders}
                        onChange={(value) => handleSettingChange('notifications', 'email', 'orders', value)}
                        label="Estado de pedidos"
                        description="Recibir actualizaciones sobre el estado de tus pedidos"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.email.promotions}
                        onChange={(value) => handleSettingChange('notifications', 'email', 'promotions', value)}
                        label="Ofertas y promociones"
                        description="Recibir información sobre descuentos y ofertas especiales"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.email.newProducts}
                        onChange={(value) => handleSettingChange('notifications', 'email', 'newProducts', value)}
                        label="Nuevos productos"
                        description="Notificaciones sobre nuevos productos en tu categoría favorita"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.email.priceAlerts}
                        onChange={(value) => handleSettingChange('notifications', 'email', 'priceAlerts', value)}
                        label="Alertas de precio"
                        description="Cuando baje el precio de productos en tu lista de deseos"
                      />
                    </div>
                  </div>

                  {/* Notificaciones Push */}
                  <div>
                    <div className="flex items-center mb-4">
                      <FaMobile className="text-green-500 mr-2" />
                      <h4 className="font-medium text-gray-800">Notificaciones Push</h4>
                    </div>
                    
                    <div className="space-y-1">
                      <ToggleSwitch
                        checked={settings.notifications.push.orders}
                        onChange={(value) => handleSettingChange('notifications', 'push', 'orders', value)}
                        label="Estado de pedidos"
                        description="Notificaciones instantáneas sobre tus pedidos"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.push.promotions}
                        onChange={(value) => handleSettingChange('notifications', 'push', 'promotions', value)}
                        label="Ofertas y promociones"
                        description="Alertas sobre ofertas por tiempo limitado"
                      />
                      <ToggleSwitch
                        checked={settings.notifications.push.priceAlerts}
                        onChange={(value) => handleSettingChange('notifications', 'push', 'priceAlerts', value)}
                        label="Alertas de precio"
                        description="Notificaciones instantáneas de cambios de precio"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Privacidad */}
            {activeSection === 'privacy' && (
              <div>
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <FaShieldAlt className="mr-2 text-[#002060]" />
                  Privacidad y Seguridad
                </h3>

                <div className="space-y-6">
                  <ToggleSwitch
                    checked={settings.privacy.showProfile}
                    onChange={(value) => handleDirectSettingChange('privacy', 'showProfile', value)}
                    label="Perfil público"
                    description="Permitir que otros usuarios vean tu perfil (deshabilitado por seguridad)"
                  />
                  <ToggleSwitch
                    checked={settings.privacy.showPurchaseHistory}
                    onChange={(value) => handleDirectSettingChange('privacy', 'showPurchaseHistory', value)}
                    label="Historial de compras visible"
                    description="Mostrar tu historial de compras en tu perfil público"
                  />
                  <ToggleSwitch
                    checked={settings.privacy.allowDataCollection}
                    onChange={(value) => handleDirectSettingChange('privacy', 'allowDataCollection', value)}
                    label="Recopilación de datos"
                    description="Permitir recopilar datos para mejorar la experiencia de usuario"
                  />
                  <ToggleSwitch
                    checked={settings.privacy.allowTargetedAds}
                    onChange={(value) => handleDirectSettingChange('privacy', 'allowTargetedAds', value)}
                    label="Publicidad personalizada"
                    description="Mostrar anuncios basados en tus intereses y compras"
                  />
                </div>
              </div>
            )}

            {/* Sección de Preferencias */}
            {activeSection === 'preferences' && (
              <div>
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <FaCog className="mr-2 text-[#002060]" />
                  Preferencias
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaPalette className="inline mr-2" />
                      Tema de la interfaz
                    </label>
                    <select
                      value={settings.preferences.theme}
                      onChange={(e) => handleDirectSettingChange('preferences', 'theme', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="auto">Automático (según sistema)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaLanguage className="inline mr-2" />
                      Idioma
                    </label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handleDirectSettingChange('preferences', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                    >
                      <option value="es">Español</option>
                      <option value="en">Inglés</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vista predeterminada de productos
                    </label>
                    <select
                      value={settings.preferences.defaultView}
                      onChange={(e) => handleDirectSettingChange('preferences', 'defaultView', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                    >
                      <option value="grid">Cuadrícula</option>
                      <option value="list">Lista</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Sección de Datos */}
            {activeSection === 'data' && (
              <div>
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <FaDownload className="mr-2 text-[#002060]" />
                  Gestión de Datos
                </h3>

                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Descargar mis datos</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Descarga una copia de todos tus datos almacenados en BlueTec, 
                      incluyendo perfil, pedidos, lista de deseos y configuraciones.
                    </p>
                    <button
                      onClick={downloadUserData}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaDownload className="mr-2" />
                      Descargar datos
                    </button>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Restablecer configuración</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Restaura todas las configuraciones a sus valores predeterminados.
                    </p>
                    <button
                      onClick={resetSettings}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FaCog className="mr-2" />
                      Restablecer configuración
                    </button>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Zona de peligro</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Elimina permanentemente todos tus datos almacenados. 
                      Esta acción no se puede deshacer.
                    </p>
                    <button
                      onClick={clearAllData}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTrash className="mr-2" />
                      Eliminar todos mis datos
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;