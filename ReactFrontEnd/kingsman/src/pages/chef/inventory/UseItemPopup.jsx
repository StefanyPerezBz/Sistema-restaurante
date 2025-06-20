
"use client";

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from 'axios';

function UseItemPopup({ item, onConfirm, onCancel, onReloadItems }) {
    const [openModal, setOpenModal] = useState(true);
    const [email, setEmail] = useState('');
    const [quantityUsed, setQuantityUsed] = useState('');

    

    const handleConfirm = async () => {
        // Check if the quantity used is a valid number
        if (!isNaN(quantityUsed) && parseInt(quantityUsed) > 0) {
            try {
                // Make a PUT request to the API endpoint to decrement the item quantity
                await axios.put(`http://localhost:8080/api/inventory/use/${item.id}/${quantityUsed}`);

                // Call the onConfirm function with the quantity used
                onConfirm(parseInt(quantityUsed));

                // Reload items in the table
                onReloadItems();
               
                // Close the popup window
                onCancel();

               

            } catch (error) {
                console.error('Error al disminuir la cantidad del artículo:', error);
                alert('No se pudo reducir la cantidad del artículo. Inténtalo de nuevo..');
            }
        } else {
            alert('Por favor, introduzca una cantidad válida.');
        }
    };

    return (
        <>
            {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
            <Modal show={openModal} size="md" onClose={onCancel} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-2xl text-center font-medium text-gray-900 dark:text-white">{item.itemName}</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label className="text-xl" htmlFor="available" value={'Available Quantity: '+item.quantity+' '+item.unit} />
                            </div>
                            <TextInput
                                type="number"
                                id="quantityUsed"
                                value={quantityUsed}
                                placeholder="Enter quantity use"
                                onChange={(e) => setQuantityUsed(e.target.value)}
                                required
                            />
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
