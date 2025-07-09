
import React from 'react';
import { Link } from 'react-router-dom';

export default function UnauthorizedChef() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Acceso Restringido</h1>
                <p className="text-gray-700 mb-6">
                    No tienes permisos para acceder al área de chef.
                </p>
                <div className="flex flex-col space-y-3">
                    <Link 
                        to="/" 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Ir a la página principal
                    </Link>
                    <Link 
                        to="/sign-in" 
                        className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition-colors"
                    >
                        Iniciar sesión con otra cuenta
                    </Link>
                </div>
            </div>
        </div>
    );
}