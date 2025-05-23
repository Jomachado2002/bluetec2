// frontend/src/components/user/UserAddresses.js
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaHome,
  FaBriefcase,
  FaStar,
  FaCheck,
  FaTimes
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserAddresses = () => {
  const { userData, setUserData } = useOutletContext();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    type: 'home', // home, work, other
    name: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    zipCode: '',
    reference: '',
    isDefault: false
  });

  // Departamentos de Paraguay
  const departments = [
    'Central', 'Asunción', 'Concepción', 'San Pedro', 'Cordillera', 
    'Guairá', 'Caaguazú', 'Caazapá', 'Itapúa', 'Misiones', 
    'Paraguarí', 'Alto Paraná', 'Ñeembucú', 'Amambay', 'Canindeyú', 
    'Presidente Hayes', 'Alto Paraguay', 'Boquerón'
  ];

  useEffect(() => {
    const userAddresses = userData.addresses || [];
    setAddresses(userAddresses);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.department) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    let updatedAddresses = [...addresses];
    
    if (editingAddress) {
      // Editar dirección existente
      const index = addresses.findIndex(addr => addr.id === editingAddress.id);
      updatedAddresses[index] = {
        ...formData,
        id: editingAddress.id,
        updatedAt: new Date().toISOString()
      };
      toast.success('Dirección actualizada correctamente');
    } else {
      // Agregar nueva dirección
      const newAddress = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedAddresses.push(newAddress);
      toast.success('Dirección agregada correctamente');
    }

    // Si se marca como predeterminada, desmarcar las demás
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === (editingAddress?.id || updatedAddresses[updatedAddresses.length - 1].id)
      }));
    }

    // Actualizar estado y localStorage
    const updatedUserData = {
      ...userData,
      addresses: updatedAddresses
    };
    
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    // Resetear formulario
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      label: '',
      type: 'home',
      name: '',
      phone: '',
      address: '',
      city: '',
      department: '',
      zipCode: '',
      reference: '',
      isDefault: false
    });
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (addressId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      const updatedUserData = {
        ...userData,
        addresses: updatedAddresses
      };
      
      setUserData(updatedUserData);
      localStorage.setItem('userData', JSON.stringify(updatedUserData));
      toast.success('Dirección eliminada correctamente');
    }
  };

  const setAsDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    
    const updatedUserData = {
      ...userData,
      addresses: updatedAddresses
    };
    
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    toast.success('Dirección predeterminada actualizada');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'home':
        return <FaHome className="text-blue-500" />;
      case 'work':
        return <FaBriefcase className="text-green-500" />;
      default:
        return <FaMapMarkerAlt className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'home':
        return 'Casa';
      case 'work':
        return 'Trabajo';
      default:
        return 'Otro';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Direcciones</h1>
          <p className="text-gray-600">Gestiona tus direcciones de envío</p>
        </div>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
          >
            <FaPlus className="mr-2" />
            Agregar dirección
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etiqueta de la dirección
              </label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                placeholder="Ej: Casa principal, Oficina..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de dirección
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
              >
                <option value="home">Casa</option>
                <option value="work">Trabajo</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                placeholder="Nombre de quien recibe"
                required
              />
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                placeholder="+595 XXX XXX XXX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección completa *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                placeholder="Calle, número, barrio..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                placeholder="Ciudad"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                required
              >
                <option value="">Seleccionar departamento</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código postal
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                placeholder="Código postal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencias adicionales
              </label>
              <textarea
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060] h-20 resize-none"
                placeholder="Punto de referencia, indicaciones adicionales..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-[#002060] focus:ring-[#002060] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Establecer como dirección predeterminada
                </span>
              </label>
            </div>

            <div className="md:col-span-2 flex gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
              >
                <FaCheck className="mr-2" />
                {editingAddress ? 'Actualizar' : 'Guardar'} dirección
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="mr-2" />
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de direcciones */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <FaMapMarkerAlt className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No tienes direcciones guardadas</h3>
          <p className="text-gray-500 mb-6">Agrega una dirección para facilitar tus compras futuras</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 bg-[#002060] text-white rounded-lg hover:bg-[#003399] transition-colors"
            >
              <FaPlus className="mr-2" />
              Agregar primera dirección
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all hover:shadow-md ${
                address.isDefault 
                  ? 'border-[#002060] bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              {/* Header de la tarjeta */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(address.type)}
                  <h3 className="font-semibold text-gray-800">
                    {address.label || getTypeLabel(address.type)}
                  </h3>
                  {address.isDefault && (
                    <span className="flex items-center text-xs bg-[#002060] text-white px-2 py-1 rounded-full">
                      <FaStar className="mr-1" />
                      Predeterminada
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Editar"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Información de la dirección */}
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium">{address.name}</p>
                {address.phone && (
                  <p className="text-gray-600">{address.phone}</p>
                )}
                <p>{address.address}</p>
                <p>{address.city}, {address.department}</p>
                {address.zipCode && (
                  <p>CP: {address.zipCode}</p>
                )}
                {address.reference && (
                  <p className="text-gray-600 italic">
                    <span className="font-medium">Referencia:</span> {address.reference}
                  </p>
                )}
              </div>

              {/* Acciones */}
              {!address.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setAsDefault(address.id)}
                    className="text-sm text-[#002060] hover:text-[#003399] font-medium"
                  >
                    Establecer como predeterminada
                  </button>
                </div>
              )}

              {/* Información adicional */}
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                {address.createdAt && (
                  <p>Creada: {new Date(address.createdAt).toLocaleDateString('es-ES')}</p>
                )}
                {address.updatedAt && (
                  <p>Actualizada: {new Date(address.updatedAt).toLocaleDateString('es-ES')}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Información sobre entregas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">Horarios de entrega:</h4>
            <ul className="space-y-1">
              <li>• Lunes a Viernes: 8:00 - 17:00</li>
              <li>• Sábados: 8:00 - 12:00</li>
              <li>• Domingos: No hay entregas</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Información importante:</h4>
            <ul className="space-y-1">
              <li>• Se requiere que alguien esté presente para recibir</li>
              <li>• Verificaremos la dirección antes de la entrega</li>
              <li>• Tiempo de entrega: 24-48 horas hábiles</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAddresses;