// frontend/src/pages/BudgetDetails.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BudgetDetails = () => {
  const { budgetId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <Link to="/panel-admin/presupuestos" className="text-blue-600 hover:underline mb-4 inline-block">
        &lt; Volver a la lista de presupuestos
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">Detalles del Presupuesto</h1>
      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
        <p className="text-yellow-800">
          Detalles del presupuesto ID: {budgetId}<br/>
          Esta funcionalidad está actualmente en desarrollo.
        </p>
      </div>
      
      <div className="mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mr-2">
          Descargar PDF
        </button>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Enviar por Email
        </button>
      </div>
    </div>
  );
};

export default BudgetDetails;