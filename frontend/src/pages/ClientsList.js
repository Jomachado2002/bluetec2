import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.getAllClients.url, {
        method: SummaryApi.getAllClients.method,
        credentials: 'include'
      });
      const result = await response.json();

      if (result.success) {
        setClients(result.data);
      } else {
        toast.error(result.message || "Error al cargar los clientes");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Clientes</h1>
      
      <div className="mb-4">
        <Link 
          to="/panel-admin/clientes/nuevo" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
        >
          Crear Nuevo Cliente
        </Link>
      </div>

      {isLoading ? (
        <p>Cargando clientes...</p>
      ) : clients.length === 0 ? (
        <p>No se encontraron clientes.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {Array.isArray(clients) && clients.map(client => (
    <tr key={client._id}>
        <td className="px-4 py-3 text-sm text-gray-800">{client.name}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{client.email}</td>
        <td className="px-4 py-3 text-sm text-gray-600">{client.phone}</td>
        <td className="px-4 py-3 text-sm">
            <Link 
                to={`/panel-admin/clientes/${client._id}`} 
                className="text-blue-600 hover:underline"
            >
                Ver Detalles
            </Link>
        </td>
    </tr>
))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsList;