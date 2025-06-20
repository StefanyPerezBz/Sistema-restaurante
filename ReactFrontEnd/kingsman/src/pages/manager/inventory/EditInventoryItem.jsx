

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";

function EditInventoryItem({ itemId, onSubmit, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [quantity, setQuantity] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [unit, setUnit] = useState('');
    const [itemName, setItemName] = useState('');
    

    useEffect(() => {
        // Fetch item details by itemId
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/inventory/view/${itemId}`);
                const { quantity, vendorId ,unit, itemName } = response.data; // Assuming the response contains quantity and vendorId
                setQuantity(quantity);
                setVendorId(vendorId);
                setUnit(unit);
                setItemName(itemName);
                
                console.log('Detalles del artículo:', response.data);
            } catch (error) {
                console.error('Error al obtener los detalles del artículo:', error);
            }
        };

        fetchItemDetails();
    }, [itemId]);

    const handleUpdateItem = async () => {
        try {
            await axios.put(`http://localhost:8080/api/inventory/edit/${itemId}`, { quantity, vendorId });
            onSubmit(); // Reload items after editing
            onCancel();
        } catch (error) {
            console.error('Error al actualizar el elemento:', error);
        }
    };


    return (
        <>
            {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
            <Modal show={openModal} size="md" onClose={onCancel} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <Label className="text-xl font-medium text-gray-900 dark:text-white" htmlFor="quantity" value={"Editar ingrediente ("+itemName+")"}/>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="quantity" value={"Cantidad ("+unit+")"}/>
                            </div>
                            <TextInput
                                id="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="vendorName" value="Nombre del proveedor" />
                            </div>
                            <TextInput
                                id="vendorName"
                                type="text"
                                value={vendorId}
                                onChange={(e) => setVendorId(e.target.value)}
                                required />
                        </div>

                        <div className="w-full">
                            <Button onClick={handleUpdateItem} color='success' className=' bg-green-500' >Actualizar</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default EditInventoryItem;
