// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Label, TextInput, Select } from 'flowbite-react';
// import axios from 'axios';

// const DoneEventModal = ({ event, handleClose }) => {
//     if (!event) {
//         return null; // Handle case where event prop is not yet available
//     }
//         const [formData, setFormData] = useState({
//         budget: event.budget || '',
//         soldTicketQuantity: event.soldTicketQuantity || ''
//     });

//     const [budgetErrorMessage, setBudgetErrorMessage] = useState('');
//     const [ticketQuantityErrorMessage, setTicketQuantityErrorMessage] = useState('');

//     // useEffect(() => {
//     //     setFormData({
//     //         budget: event.budget || '',
//     //         soldTicketQuantity: event.soldTicketQuantity || '',
//     //         status: event.eventStatus || 'Pending'
//     //     });
//     // }, [event]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });

//         if (name === 'budget') {
//             if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
//                 setBudgetErrorMessage('El presupuesto debe ser un número válido con hasta dos decimales.');
//             } else {
//                 setBudgetErrorMessage('');
//             }
//         } else if (name === 'soldTicketQuantity') {
//             if (value !== '' && !/^\d+$/.test(value)) {
//                 setTicketQuantityErrorMessage('La cantidad del ticket debe ser un número entero válido.');
//             } else {
//                 setTicketQuantityErrorMessage('');
//             }
//         }
//     };

//     const handleSubmit = async (e) => {
//           e.preventDefault();
//        try {
//             const updatedEvent = {
//                 ...event,
//                 ...formData
//             };

//             await axios.put(`http://localhost:8080/api/events/update/${event.eventID}`, updatedEvent);
//             // handleUpdateEvent(updatedEvent);
//             handleClose();
//         } catch (error) {
//             console.error('No se pudo actualizar el evento', error);
//             setErrorMessage('No se pudo actualizar el evento. Inténtalo de nuevo..');
//         }
//     };

//     return (
//         <Modal show={true} onClose={handleClose}>
//             <Modal.Header>
//                 Marcar evento como terminado
//             </Modal.Header>
//             <Modal.Body>
//                 <form onSubmit={handleSubmit}>
//                     <div>
//                         <Label htmlFor="budget" value="Presupuesto (S/.)" />
//                         <TextInput
//                             id="budget"
//                             type="text"
//                             name="budget"
//                             value={formData.budget}
//                             onChange={handleChange}
//                             required
//                         />
//                         {budgetErrorMessage && <p className="text-red-500">{budgetErrorMessage}</p>}
//                     </div>
//                     <div className='mt-4'>
//                         <Label htmlFor="soldTicketQuantity" value="Cantidad de tickets vendidos" />
//                         <TextInput
//                             id="soldTicketQuantity"
//                             type="text"
//                             name="soldTicketQuantity"
//                             value={formData.soldTicketQuantity}
//                             onChange={handleChange}
//                             required
//                         />
//                         {ticketQuantityErrorMessage && <p className="text-red-500">{ticketQuantityErrorMessage}</p>}
//                     </div>
//                     {/* <div>
//                         <Label htmlFor="status" value="Event Status" />
//                         <Select
//                             id="status"
//                             name="status"
//                             value={formData.status}
//                             onChange={handleChange}
//                             required
//                         >
//                             <option value="Pending">Pending</option>
//                             <option value="Completed">Completed</option>
//                             <option value="Cancelled">Cancelled</option>
//                         </Select>
//                     </div> */}
//                     <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded w-full mt-6"> Confirmar</Button>
//                 </form>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default DoneEventModal;

import React, { useState } from 'react';
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DoneEventModal = ({ event, handleClose }) => {
    if (!event) {
        return null;
    }

    const [formData, setFormData] = useState({
        budget: event.budget || '',
        soldTicketQuantity: event.soldTicketQuantity || ''
    });

    const [budgetErrorMessage, setBudgetErrorMessage] = useState('');
    const [ticketQuantityErrorMessage, setTicketQuantityErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'budget') {
            if (value !== '' && (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) < 1)) {
                setBudgetErrorMessage('El presupuesto debe ser un número válido mayor o igual a 1 con hasta dos decimales.');
            } else {
                setBudgetErrorMessage('');
            }
        } else if (name === 'soldTicketQuantity') {
            if (value !== '' && (!/^\d+$/.test(value) || parseInt(value) < 1)) {
                setTicketQuantityErrorMessage('La cantidad debe ser un número entero mayor o igual a 1.');
            } else {
                setTicketQuantityErrorMessage('');
            }
        }

    };

    const validateForm = () => {
        let isValid = true;

        // Validar presupuesto
        if (!formData.budget) {
            setBudgetErrorMessage('El presupuesto es obligatorio');
            isValid = false;
        } else if (!/^\d+(\.\d{1,2})?$/.test(formData.budget)) {
            setBudgetErrorMessage('Formato inválido (ej: 1500.50)');
            isValid = false;
        } else if (parseFloat(formData.budget) < 1) {
            setBudgetErrorMessage('El presupuesto debe ser al menos 1 sol');
            isValid = false;
        } else {
            setBudgetErrorMessage('');
        }

        // Validar cantidad de tickets
        if (!formData.soldTicketQuantity) {
            setTicketQuantityErrorMessage('La cantidad es obligatoria');
            isValid = false;
        } else if (!/^\d+$/.test(formData.soldTicketQuantity)) {
            setTicketQuantityErrorMessage('Debe ser un número entero');
            isValid = false;
        } else if (parseInt(formData.soldTicketQuantity) < 1) {
            setTicketQuantityErrorMessage('Debe haber al menos 1 ticket vendido');
            isValid = false;
        } else {
            setTicketQuantityErrorMessage('');
        }

        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                text: 'Por favor corrige los errores marcados',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        try {
            const updatedEvent = {
                ...event,
                ...formData
            };

            const { data } = await axios.put(`http://localhost:8080/api/events/update/${event.eventID}`, updatedEvent);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El evento se ha actualizado correctamente',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                handleClose();
            });

        } catch (error) {
            console.error('No se pudo actualizar el evento', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el evento. Inténtalo de nuevo.',
                confirmButtonColor: '#3085d6',
            });
        }
    };

    return (
        <Modal show={true} onClose={handleClose}>
            <Modal.Header>
                Marcar evento como terminado
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="budget" value="Presupuesto (S/.)" />
                        <TextInput
                            id="budget"
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            placeholder="Ejemplo: 1500.50"
                            color={budgetErrorMessage ? 'failure' : ''}
                        />
                        {budgetErrorMessage && (
                            <p className="text-red-500 text-sm mt-1">{budgetErrorMessage}</p>
                        )}
                    </div>
                    <div className='mt-4'>
                        <Label htmlFor="soldTicketQuantity" value="Cantidad de tickets vendidos" />
                        <TextInput
                            id="soldTicketQuantity"
                            type="text"
                            name="soldTicketQuantity"
                            value={formData.soldTicketQuantity}
                            onChange={handleChange}
                            required
                            placeholder="Ejemplo: 120"
                            color={ticketQuantityErrorMessage ? 'failure' : ''}
                        />
                        {ticketQuantityErrorMessage && (
                            <p className="text-red-500 text-sm mt-1">{ticketQuantityErrorMessage}</p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded w-full mt-6"
                    >
                        Confirmar
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default DoneEventModal;