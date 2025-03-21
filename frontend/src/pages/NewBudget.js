import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const NewBudget = () => {
  const [formData, setFormData] = useState({
    clientId: '',
    products: [],
    totalAmount: 0,
    status: 'Pendiente'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(SummaryApi.createBudget.url, {
        method: SummaryApi.createBudget.method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Presupuesto creado correctamente");
        navigate("/panel-admin/presupuestos");
      } else {
        toast.error(result.message || "Error al crear el presupuesto");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Link to="/panel-admin/presupuestos" className="text-blue-600 hover:underline mb-4 inline-block">
        &lt; Volver a la lista de presupuestos
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Presupuesto</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Campos del formulario */}
        <div className="mb-4">
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <input
            type="text"
            id="clientId"
            name="clientId"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Creando..." : "Crear Presupuesto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBudget;