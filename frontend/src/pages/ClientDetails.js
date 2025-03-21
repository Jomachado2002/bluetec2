// frontend/src/pages/ClientDetails.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ClientDetails = () => {
  const { clientId } = useParams();
  
  return (
    <div className="container mx-auto p-4">
      <Link to="/panel-admin/clientes" className="text-blue-600 hover:underline mb-4 inline-block">
        &lt; Volver a la lista de clientes
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">Detalles del Cliente</h1>
      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
        <p className="text-yellow-800">
          Detalles del cliente ID: {clientId}<br/>
          Esta funcionalidad está actualmente en desarrollo.
        </p>
      </div>
    </div>
  );
};

export default ClientDetails;