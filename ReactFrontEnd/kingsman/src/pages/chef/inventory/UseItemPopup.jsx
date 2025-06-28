"use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

function UseItemPopup({ item, onConfirm, onCancel, onReloadItems }) {
    const [openModal, setOpenModal] = useState(true);
    const [quantityUsed, setQuantityUsed] = useState('');
    const [error, setError] = useState('');

    const validateInput = () => {
        if (!quantityUsed) {
            setError('La cantidad es obligatoria');
            return false;
        }
        
        const quantity = parseInt(quantityUsed);
        if (isNaN(quantity) || quantity < 1) {
            setError('La cantidad debe ser un número entero mayor o igual a 1');
            return false;
        }
        
        if (quantity > item.quantity) {
            setError('La cantidad no puede ser mayor que la disponible');
            return false;
        }
        
        setError('');
        return true;
    };

    const handleConfirm = async () => {
        if (!validateInput()) return;

        try {
            // Make a PUT request to the API endpoint to decrement the item quantity
            await axios.put(`http://localhost:8080/api/inventory/use/${item.id}/${quantityUsed}`);

            // Show success message
            Swal.fire({
                title: 'Éxito',
                text: 'Cantidad actualizada correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            // Call the onConfirm function with the quantity used
            onConfirm(parseInt(quantityUsed));

            // Reload items in the table
            onReloadItems();
            
            // Close the popup window
            onCancel();

        } catch (error) {
            console.error('Error al disminuir la cantidad del artículo:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo reducir la cantidad del artículo. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCancel} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-2xl text-center font-medium text-gray-900 dark:text-white">{item.itemName}</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label className="text-xl" htmlFor="available" value={'Cantidad disponible: '+item.quantity} />
                            </div>
                            <TextInput
                                type="number"
                                id="quantityUsed"
                                value={quantityUsed}
                                placeholder="Ingresar cantidad a usar"
                                onChange={(e) => {
                                    setQuantityUsed(e.target.value);
                                    setError(''); // Clear error when user types
                                }}
                                min="1"
                                step="1"
                                required
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                    {error}
                                </p>
                            )}
                        </div>
                        
                        <div className="w-full flex">
                            <Button className='mr-3 ml-16' color="success" onClick={handleConfirm}>Usar artículo</Button>
                            <Button className='mr-3 ml-9' onClick={onCancel} color="gray">Cancelar</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default UseItemPopup;