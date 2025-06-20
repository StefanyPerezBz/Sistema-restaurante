import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {Modal} from "flowbite-react";
import axios from 'axios';
import toast from 'react-hot-toast';


export default function SearchCustomerModal({ isOpen, onToggle, searchModalResponse }) {

    const [formErrors, setFormErrors] = useState([]);
    const [responseErrors, setResponseErrors] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        setFormErrors([])
        setResponseErrors("")

        const { mobile } = e.target.elements;
        const trimmedMobile = mobile.value.trim();

        const errors = [];

        //validations
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(trimmedMobile)) {
            errors.push('El número de móvil debe tener 10 dígitos');
        }
        
        // Display errors
        if (errors.length > 0) {
            setFormErrors(errors);
            return;
        }

        try {

            const response = await axios.get(`http://localhost:8080/api/customers/mobile/${trimmedMobile}`);
        
            if (response.status == 200) {
                searchModalResponse(response.data);
                onToggle();
                toast.success('Cliente encontrado!');
            } else {
                console.error('Estado de respuesta inesperado:', response);
                toast.error(
                    "Hubo un error. \n Póngase en contacto con el soporte del sistema.",
                    {
                        duration: 6000,
                    }
                );
            }
        } catch (error) {

                console.error('Error:', error.response.data);
                setResponseErrors(error.response.data);

        }

    };

  return (
    <div>
      <Modal show={isOpen} size="md" onClose={onToggle} popup>
        <Modal.Header/>
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Buscar Cliente</h3>
            <div className='my-3'>
                            {responseErrors && (
                                    <div
                                        className="flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3"
                                        role="alert"
                                    >
                                    <p>{responseErrors}.</p>
                                    </div>
                            )}
                    </div>
            <div>
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
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className='my-3'>
                            {formErrors.length > 0 && (
                                <div className="text-red-500">
                                    {formErrors.map((error, index) => (
                                        <p key={index}>{error}.</p>
                                    ))}
                                </div>
                            )}
                    </div>

                    <button
                        type="submit"
                        className="w-full my-2 text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <i className="ri-find-replace-fill"></i> Buscar
                    </button>
                    <button
                        onClick={onToggle}
                        type="button"
                        className=" w-full my-2 text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <i className="ri-close-large-fill"></i> Cerrar
                    </button>
                </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

SearchCustomerModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    searchModalResponse: PropTypes.func.isRequired 
};