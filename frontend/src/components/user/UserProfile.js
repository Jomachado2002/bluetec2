// frontend/src/components/user/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { 
  FaUser, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import SummaryApi from '../../common';

const UserProfile = () => {
  const user = useSelector(state => state?.user?.user);
  const { userData, setUserData } = useOutletContext();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    birthDate: '',
    gender: '',
    profilePic: user?.profilePic || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileStats, setProfileStats] = useState({
    accountCreated: '',
    lastLogin: '',
    totalOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    // Cargar datos adicionales del perfil desde localStorage
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setFormData(prev => ({
      ...prev,
      ...savedProfile,
      name: user?.name || savedProfile.name || '',
      email: user?.email || savedProfile.email || ''
    }));

    // Calcular estadísticas
    const orders = userData.orders || [];
    const totalSpent = orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);
    
    setProfileStats({
      accountCreated: user?.createdAt || 'No disponible',
      lastLogin: new Date().toLocaleDateString('es-ES'),
      totalOrders: orders.length,
      totalSpent
    });
  }, [user, userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    try {
      // Guardar en localStorage
      localStorage.setItem('userProfile', JSON.stringify(formData));
      
      // Actualizar context si es necesario
      const updatedUserData = {
        ...userData,
        profile: formData
      };
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setFormData(prev => ({
      ...prev,
      ...savedProfile,
      name: user?.name || savedProfile.name || '',
      email: user?.email || savedProfile.email || ''
    }));
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas nuevas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      // Aquí harías la petición al backend para cambiar la contraseña
      // Por ahora simulamos el proceso
      toast.success('Contraseña actualizada correctamente');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    }
  };

  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          profilePic: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
          >
            <FaEdit className="mr-2" />
            Editar perfil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSaveProfile}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FaSave className="mr-2" />
              Guardar
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaTimes className="mr-2" />
              Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Información principal del perfil */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Foto de perfil y datos básicos */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
            
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              {/* Foto de perfil */}
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {formData.profilePic ? (
                    <img 
                      src={formData.profilePic} 
                      alt="Perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUser className="text-3xl text-gray-400" />
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-[#002060] text-white rounded-full p-2 cursor-pointer hover:bg-[#003399] transition-colors">
                    <FaCamera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Información básica */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {formData.name || 'Usuario'}
                </h3>
                <p className="text-gray-600 mb-2">{formData.email}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    Miembro desde: {new Date(profileStats.accountCreated).toLocaleDateString('es-ES') || 'No disponible'}
                  </span>
                  <span>
                    Último acceso: {profileStats.lastLogin}
                  </span>
                </div>
              </div>
            </div>

            {/* Formulario de datos personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060] ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={true} // Email normalmente no se puede cambiar
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                  placeholder="tu@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Contacta a soporte para cambiar tu email
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060] ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                  placeholder="+595 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060] ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060] ${
                    !isEditing ? 'bg-gray-100 text-gray-600' : 'bg-white'
                  }`}
                >
                  <option value="">Seleccionar género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero_no_decir">Prefiero no decir</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seguridad de la cuenta */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Seguridad de la Cuenta</h2>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-[#002060] hover:text-[#003399] text-sm font-medium"
              >
                {showPasswordForm ? 'Cancelar' : 'Cambiar contraseña'}
              </button>
            </div>

            {showPasswordForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                      placeholder="Tu contraseña actual"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                      placeholder="Nueva contraseña (mín. 8 caracteres)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleChangePassword}
                  className="w-full py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
                >
                  Actualizar contraseña
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <p>Tu contraseña se mantiene segura y encriptada.</p>
                <p className="mt-2">
                  <span className="text-green-600">✓</span> Última actualización: Hace 2 meses
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estadísticas y configuración adicional */}
        <div className="space-y-6">
          
          {/* Estadísticas de la cuenta */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas de tu Cuenta</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">Total de pedidos</p>
                  <p className="text-2xl font-bold text-[#002060]">{profileStats.totalOrders}</p>
                </div>
                <div className="text-3xl">📦</div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-600">Total gastado</p>
                  <p className="text-lg font-bold text-green-600">
                    {new Intl.NumberFormat('es-PY', { 
                      style: 'currency', 
                      currency: 'PYG',
                      minimumFractionDigits: 0 
                    }).format(profileStats.totalSpent)}
                  </p>
                </div>
                <div className="text-3xl">💰</div>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-gray-600">Favoritos guardados</p>
                  <p className="text-2xl font-bold text-red-500">{userData.wishlist?.length || 0}</p>
                </div>
                <div className="text-3xl">❤️</div>
              </div>
            </div>
          </div>

          {/* Preferencias de notificación */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Preferencias de Notificación</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Ofertas y promociones</p>
                  <p className="text-sm text-gray-600">Recibir emails sobre descuentos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002060]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estado de pedidos</p>
                  <p className="text-sm text-gray-600">Actualizaciones de envío</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002060]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nuevos productos</p>
                  <p className="text-sm text-gray-600">Novedades en tu categoría favorita</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#002060]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Acciones de cuenta */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4">Zona de Peligro</h3>
            
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-sm">
                Descargar mis datos
              </button>
              
              <button className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                Eliminar mi cuenta
              </button>
            </div>
            
            <p className="text-xs text-gray-600 mt-3">
              La eliminación de la cuenta es permanente y no se puede deshacer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;