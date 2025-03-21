// frontend/src/pages/BudgetsList.js
import React from 'react';
import { Link } from 'react-router-dom';

const BudgetsList = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Presupuestos</h1>
      
      <div className="mb-4">
        <Link 
          to="/panel-admin/presupuestos/nuevo" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
        >
          Crear Nuevo Presupuesto
        </Link>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
        <p className="text-yellow-800">
          Esta funcionalidad está actualmente en desarrollo. Pronto podrás gestionar tus presupuestos desde aquí.
        </p>
      </div>
    </div>
  );
};

export default BudgetsList;