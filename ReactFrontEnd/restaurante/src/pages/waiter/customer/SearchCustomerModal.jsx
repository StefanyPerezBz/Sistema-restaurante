import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from "flowbite-react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaSearch, FaTimes } from 'react-icons/fa';

export default function SearchCustomerModal({ isOpen, onToggle, searchModalResponse }) {
    const [mobile, setMobile] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        mobile: false
    });

    const handleChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 9);
        setMobile(value);
        
        // Validación en tiempo real
        if (value.length > 0 && value.length !== 9) {
            setFieldErrors({ mobile: true });
        } else {
            setFieldErrors({ mobile: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validación final
        if (mobile.length !== 9) {
            Swal.fire({
                icon: 'error',
                title: 'Error de validación',
                text: 'El número de móvil debe tener exactamente 9 dígitos',
                confirmButtonColor: '#d33',
                background: '#fff',
                customClass: {
                    title: 'text-red-600 font-bold',
                    content: 'text-red-500'
                }
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/customers/mobile/${mobile}`, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                searchModalResponse(response.data);
                onToggle();
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente encontrado',
                    text: 'Los datos del cliente se han cargado correctamente',
                    confirmButtonColor: '#3085d6',
                    timer: 1500
                });
            } else {
                handleUnexpectedResponse();
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUnexpectedResponse = () => {
        Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: 'Contacte al soporte técnico',
            confirmButtonColor: '#d33',
            background: '#fff',
            customClass: {
                title: 'text-red-600 font-bold',
                content: 'text-red-500'
            }
        });
    };

    const handleApiError = (error) => {
        let errorMessage = 'Error al buscar el cliente';
        
        if (error.response) {
            const { status } = error.response;
            
            if (status === 404) {
                errorMessage = 'No se encontró ningún cliente con este número';
            } else if (status === 400) {
                errorMessage = 'Número de móvil inválido';
            } else if (status === 500) {
                errorMessage = 'Error interno del servidor';
            } else {
                errorMessage = `Error del servidor (${status})`;
            }
        } else if (error.request) {
            errorMessage = error.code === 'ECONNABORTED' 
                ? 'Tiempo de espera agotado. El servidor no respondió' 
                : 'No se pudo conectar con el servidor';
        }

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#d33',
            background: '#fff',
            customClass: {
                title: 'text-red-600 font-bold',
                content: 'text-red-500'
            }
        });
    };

    return (
        <Modal show={isOpen} size="md" onClose={onToggle} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Buscar cliente por móvil</h3>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 mb-6">
                            <div>
                                <label
                                    htmlFor="mobile"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Número de teléfono móvil
                                </label>
                                <input
                                    type="text"
                                    id="mobile"
                                    value={mobile}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder="Ej: 612345678"
                                    disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {mobile.length}/9 dígitos
                                </div>
                                {fieldErrors.mobile && (
                                    <p className="mt-1 text-sm text-red-600">Debe tener 9 dígitos</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full my-2 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Buscando...
                                </span>
                            ) : (
                                <>
                                    <FaSearch className="inline mr-2" /> Buscar cliente
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={onToggle}
                            type="button"
                            className="w-full my-2 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            disabled={isSubmitting}
                        >
                            <FaTimes className="inline mr-2" /> Cancelar
                        </button>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}

SearchCustomerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    searchModalResponse: PropTypes.func.isRequired 
};