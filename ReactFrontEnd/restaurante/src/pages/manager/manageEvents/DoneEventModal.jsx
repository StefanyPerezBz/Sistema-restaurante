

import React, { useState } from 'react';
import { Modal, Button, Label, TextInput } from 'flowbite-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const DoneEventModal = ({ event, handleClose, onSuccess }) => {
    if (!event) {
        return null;
    }

    const [formData, setFormData] = useState({
        budget: event.budget ? String(event.budget) : '',
        soldTicketQuantity: event.soldTicketQuantity ? String(event.soldTicketQuantity) : ''
    });

    const [budgetError, setBudgetError] = useState('');
    const [ticketError, setTicketError] = useState('');

    const handleBudgetChange = (e) => {
        const value = e.target.value;
        
        // Permite: vacío, números, o números con un punto decimal
        if (value === '' || /^\d*\.?\d{0,1}$/.test(value)) {
            setFormData({...formData, budget: value});
            setBudgetError('');
        }
    };

    const validateBudget = () => {
        const budgetStr = String(formData.budget).trim();
        
        if (!budgetStr) {
            setBudgetError('El presupuesto es obligatorio');
            return false;
        }
        
        // No permite punto sin decimal (ej. "123.")
        if (/\.$/.test(budgetStr) || !/^\d+(\.\d)?$/.test(budgetStr)) {
            setBudgetError('Debe ser entero o con un decimal (ej: 1500 o 1500.5)');
            return false;
        }
        
        if (parseFloat(budgetStr) < 1) {
            setBudgetError('Debe ser mayor o igual a 1');
            return false;
        }
        
        setBudgetError('');
        return true;
    };

    const handleTicketChange = (e) => {
        const value = e.target.value;
        
        // Solo permite números enteros
        if (value === '' || /^\d*$/.test(value)) {
            setFormData({...formData, soldTicketQuantity: value});
            setTicketError('');
        }
    };

    const validateTicket = () => {
        const ticketStr = String(formData.soldTicketQuantity).trim();
        
        if (!ticketStr) {
            setTicketError('La cantidad es obligatoria');
            return false;
        }
        
        if (!/^\d+$/.test(ticketStr)) {
            setTicketError('Debe ser un número entero');
            return false;
        }
        
        if (parseInt(ticketStr) < 1) {
            setTicketError('Debe ser mayor o igual a 1');
            return false;
        }
        
        setTicketError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isBudgetValid = validateBudget();
        const isTicketValid = validateTicket();
        
        if (!isBudgetValid || !isTicketValid) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                text: 'Por favor corrige los errores antes de continuar',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        try {
            // Formatear budget (eliminar .0 si es entero)
            const budgetValue = parseFloat(formData.budget);
            const formattedBudget = Number.isInteger(budgetValue) 
                ? budgetValue.toString() 
                : budgetValue.toFixed(1);

            const updatedEvent = {
                ...event,
                budget: formattedBudget,
                soldTicketQuantity: formData.soldTicketQuantity,
                status: 'completed'
            };

            await axios.put(`http://localhost:8080/api/events/update/${event.eventID}`, updatedEvent);

            await Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Evento actualizado correctamente',
                confirmButtonText: 'Aceptar'
            });

            handleClose();
            
            // Recargar la página después de cerrar el modal
            setTimeout(() => {
                window.location.reload();
            }, 500);

        } catch (error) {
            console.error('Error al actualizar evento:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar el evento. Por favor intenta nuevamente.',
                confirmButtonText: 'Entendido'
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
                    <div className="mb-4">
                        <Label htmlFor="budget" value="Monto recaudado (S/.)" />
                        <TextInput
                            id="budget"
                            type="text"
                            name="budget"
                            value={formData.budget}
                            onChange={handleBudgetChange}
                            placeholder="Ejemplo: 1500 o 1500.5"
                            color={budgetError ? 'failure' : ''}
                            helperText={budgetError && <span className="text-red-500 text-sm">{budgetError}</span>}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="soldTicketQuantity" value="Cantidad de tickets vendidos" />
                        <TextInput
                            id="soldTicketQuantity"
                            type="text"
                            name="soldTicketQuantity"
                            value={formData.soldTicketQuantity}
                            onChange={handleTicketChange}
                            placeholder="Ejemplo: 120"
                            color={ticketError ? 'failure' : ''}
                            helperText={ticketError && <span className="text-red-500 text-sm">{ticketError}</span>}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        Confirmar
                    </Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default DoneEventModal;