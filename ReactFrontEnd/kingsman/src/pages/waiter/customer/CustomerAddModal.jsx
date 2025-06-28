// import React, { useState } from 'react';
// import {  useSelector } from 'react-redux'
// import PropTypes from 'prop-types';
// import {Modal} from "flowbite-react";
// import axios from 'axios';
// import toast from 'react-hot-toast';


// export default function CustomerAddModal({ isOpen, onToggle, customerAddModalResponse }) {

//     const { currentUser } = useSelector((state) => state.user);
//     const [formErrors, setFormErrors] = useState([]);
//     const [responseErrors, setResponseErrors] = useState('');


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setFormErrors([])
//         setResponseErrors("")

//         const { name, mobile, email } = e.target.elements;

//         const formData = {
//             cusName: name.value.trim(),
//             cusMobile: mobile.value.trim(),
//             cusEmail: email.value.trim(),
//             employeeId: currentUser.id
//         };
        

//         const errors = [];

//         //validations
//         const mobileRegex = /^\d{9}$/;
//         if (!mobileRegex.test(formData.cusMobile)) {
//             errors.push('El número de móvil debe tener 9 dígitos');
//         } else if (!formData.cusMobile) {
//             errors.push('El número de móvil es obligatorio');
//         }
    
//         if (!formData.cusName) {
//             errors.push('El nombre es obligatorio');
//         } else if (formData.cusName.length < 3) {
//             errors.push('El nombre debe tener al menos 50 caracteres');
//         } else if (formData.cusName.length > 50) {
//             errors.push('El nombre no puede tener más de 50 caracteres');   
//         }
    
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (formData.cusEmail && !emailRegex.test(formData.cusEmail)) {
//             errors.push('Formato de correo electrónico no válido');
//         }
        
//         // Display errors
//         if (errors.length > 0) {
//             setFormErrors(errors);
//             return;
//         }


//         try {
            
//             const response = await axios.post('http://localhost:8080/api/customers', formData);
    
//             if (response.status === 201) {
//                 // Successful
//                 customerAddModalResponse(response.data);
//                 onToggle();
//                 toast.success('Nuevo cliente creado.')
//             } else {
//                 // Unexpected response
//                 console.error('Estado de respuesta inesperado:', response.status);
//                 toast.error(
//                     "Hay un error. \n Contacte con el soporte del sistema.",
//                     {
//                       duration: 6000,
//                     }
//                   )
//             }
//         } catch (error) {

//             if (error.response && error.response.status === 409) {
//                 setResponseErrors('Ya existe un cliente con este número de móvil')
//                 console.error(error.message);
//             } else {
//                 console.error('Error:', error.response.data);
//                 setResponseErrors(error.response.data);
//             }
//         }

//     };

//   return (
//     <div>
//       <Modal show={isOpen} size="md" onClose={onToggle} popup>
//         <Modal.Header/>
//         <Modal.Body>
//           <div className="space-y-6">
//             <h3 className="text-xl font-medium text-gray-900 dark:text-white">Crear nuevo cliente</h3>
//             <div className='my-3'>
//                             {responseErrors && (
//                                     <div
//                                         className="flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3"
//                                         role="alert"
//                                     >
//                                     <p>{responseErrors}.</p>
//                                     </div>
//                             )}
//                     </div>
//             <div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="grid gap-6 mb-6">
//                         <div>
//                             <label
//                                 htmlFor="name"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             >
//                                 Nombre
//                             </label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor="mobile"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             >
//                                 Número de teléfono móvil
//                             </label>
//                             <input
//                                 type="text"
//                                 id="mobile"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <label
//                                 htmlFor="email"
//                                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                             > 
//                                 Correo electrónico
//                             </label>
//                             <input
//                                 type='email'
//                                 id="email"
//                                 className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                             />
//                         </div>
//                     </div>

//                     <div className='my-3'>
//                             {formErrors.length > 0 && (
//                                 <div className="text-red-500">
//                                     {formErrors.map((error, index) => (
//                                         <p key={index}>{error}.</p>
//                                     ))}
//                                 </div>
//                             )}
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full my-2 text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//                     >
//                         <i className="ri-add-large-fill"></i> Crear
//                     </button>
//                     <button
//                         onClick={onToggle}
//                         type="button"
//                         className=" w-full my-2 text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//                     >
//                         <i className="ri-close-large-fill"></i> Cerrar
//                     </button>
//                 </form>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   )
// }

// CustomerAddModal.propTypes = {
//     isOpen: PropTypes.bool.isRequired,
//     onToggle: PropTypes.func.isRequired,
//     customerAddModalResponse: PropTypes.func.isRequired 
// };

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal } from "flowbite-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function CustomerAddModal({ isOpen, onToggle, customerAddModalResponse }) {
    const { currentUser } = useSelector((state) => state.user);
    const [formErrors, setFormErrors] = useState([]);
    const [responseErrors, setResponseErrors] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        name: false,
        mobile: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        cusName: '',
        cusMobile: '',
        cusEmail: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Validación en tiempo real para el número de móvil (solo números, máximo 9 dígitos)
        if (name === 'cusMobile') {
            const numericValue = value.replace(/\D/g, '').slice(0, 9);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
            return;
        }
        
        // Validación en tiempo real para el nombre (no números, máximo 50 caracteres)
        if (name === 'cusName') {
            const lettersOnly = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '').slice(0, 50);
            setFormData(prev => ({ ...prev, [name]: lettersOnly }));
            return;
        }
        
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Resetear errores
        setFormErrors([]);
        setResponseErrors("");
        setFieldErrors({ name: false, mobile: false });

        const dataToSend = {
            ...formData,
            employeeId: currentUser.id
        };

        // Validaciones
        const errors = validateForm(dataToSend);
        if (errors.length > 0) {
            handleValidationErrors(errors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/customers', dataToSend, {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });

            if (response.status === 201) {
                handleSuccess(response);
            } else {
                handleUnexpectedResponse(response);
            }
        } catch (error) {
            handleApiError(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const validateForm = (data) => {
        const errors = [];
        const newFieldErrors = { name: false, mobile: false };

        // Validación del nombre
        if (!data.cusName) {
            errors.push('El nombre es obligatorio');
            newFieldErrors.name = true;
        } else if (data.cusName.length < 3) {
            errors.push('El nombre debe tener al menos 3 caracteres');
            newFieldErrors.name = true;
        }

        // Validación del móvil
        if (!data.cusMobile) {
            errors.push('El número de móvil es obligatorio');
            newFieldErrors.mobile = true;
        } else if (data.cusMobile.length !== 9) {
            errors.push('El número de móvil debe tener 9 dígitos');
            newFieldErrors.mobile = true;
        }

        // Validación del email
        if (data.cusEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.cusEmail)) {
            errors.push('Formato de correo electrónico no válido');
        }

        setFieldErrors(newFieldErrors);
        return errors;
    };

    const handleValidationErrors = (errors) => {
        setFormErrors(errors);
        Swal.fire({
            icon: 'error',
            title: 'Error de validación',
            html: errors.map(error => `<div>• ${error}</div>`).join(''),
            confirmButtonColor: '#d33',
            background: '#fff',
            customClass: {
                title: 'text-red-600 font-bold',
                content: 'text-red-500'
            }
        });
    };

    const handleSuccess = (response) => {
        customerAddModalResponse(response.data);
        Swal.fire({
            icon: 'success',
            title: 'Cliente creado',
            text: 'El cliente se ha registrado correctamente',
            confirmButtonColor: '#3085d6',
            timer: 1500
        });
        // Resetear formulario
        setFormData({
            cusName: '',
            cusMobile: '',
            cusEmail: ''
        });
        onToggle();
    };

    const handleUnexpectedResponse = (response) => {
        console.error('Respuesta inesperada:', response);
        setResponseErrors("Error inesperado. Contacte al soporte técnico.");
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error inesperado. Contacte al soporte técnico.',
            confirmButtonColor: '#d33'
        });
    };

    const handleApiError = (error) => {
        let errorMessage = 'Error al procesar la solicitud';
        
        if (error.response) {
            const { status, data } = error.response;
            
            if (status === 409) {
                errorMessage = 'Ya existe un cliente con este número de móvil';
            } else if (status === 400) {
                errorMessage = data.message || 'Datos inválidos enviados al servidor';
            } else if (status === 401) {
                errorMessage = 'No autorizado. Por favor inicie sesión nuevamente';
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

        setResponseErrors(errorMessage);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            confirmButtonColor: '#d33'
        });
    };

    return (
        <Modal show={isOpen} size="md" onClose={onToggle} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Crear nuevo cliente</h3>
                    
                    {responseErrors && (
                        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                            {responseErrors}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 mb-6">
                            <div>
                                <label htmlFor="cusName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="cusName"
                                    name="cusName"
                                    value={formData.cusName}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder="Ej: Juan Pérez"
                                    disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {formData.cusName.length}/50 caracteres
                                </div>
                                {fieldErrors.name && <p className="mt-1 text-sm text-red-600">Campo requerido (3-50 caracteres)</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="cusMobile" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Teléfono móvil
                                </label>
                                <input
                                    type="text"
                                    id="cusMobile"
                                    name="cusMobile"
                                    value={formData.cusMobile}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border ${fieldErrors.mobile ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder="Ej: 612345678"
                                    disabled={isSubmitting}
                                />
                                <div className="text-xs text-gray-500 mt-1">
                                    {formData.cusMobile.length}/9 dígitos
                                </div>
                                {fieldErrors.mobile && <p className="mt-1 text-sm text-red-600">9 dígitos requeridos</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="cusEmail" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Correo electrónico (opcional)
                                </label>
                                <input
                                    type="email"
                                    id="cusEmail"
                                    name="cusEmail"
                                    value={formData.cusEmail}
                                    onChange={handleChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="opcional@ejemplo.com"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {formErrors.length > 0 && (
                            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                                {formErrors.map((error, index) => (
                                    <div key={index}>• {error}</div>
                                ))}
                            </div>
                        )}

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
                                    Procesando...
                                </span>
                            ) : (
                                <><i className="ri-add-fill"></i> Crear cliente</>
                            )}
                        </button>
                        
                        <button
                            onClick={onToggle}
                            type="button"
                            className="w-full my-2 text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            disabled={isSubmitting}
                        >
                            <i className="ri-close-line"></i> Cancelar
                        </button>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    );
}

CustomerAddModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    customerAddModalResponse: PropTypes.func.isRequired
};