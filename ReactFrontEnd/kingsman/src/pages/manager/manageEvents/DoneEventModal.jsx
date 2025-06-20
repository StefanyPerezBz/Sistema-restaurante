import React, { useState, useEffect } from 'react';
import { Modal, Button, Label, TextInput, Select } from 'flowbite-react';
import axios from 'axios';

const DoneEventModal = ({ event, handleClose }) => {
    if (!event) {
        return null; // Handle case where event prop is not yet available
    }
        const [formData, setFormData] = useState({
        budget: event.budget || '',
        soldTicketQuantity: event.soldTicketQuantity || ''
    });

    const [budgetErrorMessage, setBudgetErrorMessage] = useState('');
    const [ticketQuantityErrorMessage, setTicketQuantityErrorMessage] = useState('');

    // useEffect(() => {
    //     setFormData({
    //         budget: event.budget || '',
    //         soldTicketQuantity: event.soldTicketQuantity || '',
    //         status: event.eventStatus || 'Pending'
    //     });
    // }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'budget') {
            if (value !== '' && !/^\d+(\.\d{1,2})?$/.test(value)) {
                setBudgetErrorMessage('El presupuesto debe ser un número válido con hasta dos decimales.');
            } else {
                setBudgetErrorMessage('');
            }
        } else if (name === 'soldTicketQuantity') {
            if (value !== '' && !/^\d+$/.test(value)) {
                setTicketQuantityErrorMessage('La cantidad del ticket debe ser un número entero válido.');
            } else {
                setTicketQuantityErrorMessage('');
            }
        }
    };

    const handleSubmit = async (e) => {
          e.preventDefault();
       try {
            const updatedEvent = {
                ...event,
                ...formData
            };

            await axios.put(`http://localhost:8080/api/events/update/${event.eventID}`, updatedEvent);
            // handleUpdateEvent(updatedEvent);
            handleClose();
        } catch (error) {
            console.error('No se pudo actualizar el evento', error);
            setErrorMessage('No se pudo actualizar el evento. Inténtalo de nuevo..');
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
                        <Label htmlFor="budget" value="Budget (Rs.)" />
                        <TextInput
                            id="budget"
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                        />
                        {budgetErrorMessage && <p className="text-red-500">{budgetErrorMessage}</p>}
                    </div>
                    <div>
                        <Label htmlFor="soldTicketQuantity" value="Sold Ticket Quantity" />
                        <TextInput
                            id="soldTicketQuantity"
                            type="text"
                            name="soldTicketQuantity"
                            value={formData.soldTicketQuantity}
                            onChange={handleChange}
                            required
                        />
                        {ticketQuantityErrorMessage && <p className="text-red-500">{ticketQuantityErrorMessage}</p>}
                    </div>
                    {/* <div>
                        <Label htmlFor="status" value="Event Status" />
                        <Select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </Select>
                    </div> */}
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 ml-2 rounded w-full"> Confirmar</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default DoneEventModal;

