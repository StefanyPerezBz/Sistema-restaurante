// import { Button, Checkbox, Label, Modal, TextInput, Dropdown, Alert } from "flowbite-react";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { set } from "firebase/database";
// import { HiCheck } from "react-icons/hi";
// import { HiInformationCircle } from "react-icons/hi";

// function AddInventoryItem({ onSubmit, onCancel }) {
//     const [openModal, setOpenModal] = useState(true);
//     const [itemName, setItemName] = useState('');
//     const [quantity, setQuantity] = useState('');
//     const [price, setPrice] = useState('');
//     const [totalPrice, setTotalPrice] = useState('');
//     const [selectedUnit, setSelectedUnit] = useState('');
//     const [vendorId, setVendorId] = useState('');
//     const [isaddSuccessModel, setAddSuccessModel] = useState(false);
//     const [fillAllFieldsAlert, setFillAllFieldsAlert] = useState(false);

//     useEffect(() => {
//         // Hide the alert after 2 seconds
//         const timeout = setTimeout(() => {
//             setAddSuccessModel(false);
//             setFillAllFieldsAlert(false);
//         }, 2000);

//         // Clear the timeout when the component unmounts
//         return () => clearTimeout(timeout);
//     }
//         , [fillAllFieldsAlert, isaddSuccessModel]);

//     useEffect(() => {

//         setTotalPrice(quantity * price)

//     }, [quantity, price]);


//     const handleAddItem = async () => {


//         // Validate input fields before adding the item
//         if (itemName && quantity && vendorId && selectedUnit && totalPrice) {
//             const newItem = {
//                 itemName,
//                 quantity,
//                 vendorId,
//                 unit: selectedUnit,
//                 totalPrice
//             };
//             try {
//                 const response = await axios.post('http://localhost:8080/api/inventory/add', newItem);

//                 if (response.data === 'Artículo añadido al inventario con éxito') {
//                     // Item added successfully
//                     console.log('Artículo agregado exitosamente:', response.data);

//                     onSubmit(); // Reload items after adding
//                     setAddSuccessModel(true);


//                     setItemName('');
//                     setQuantity('');
//                     setVendorId('');
//                     setPrice('');



//                 } else {
//                     console.error('No se pudo agregar el artículo:', response.data);
//                 }

//             } catch (error) {
//                 console.error('Error al agregar el artículo:', error.message);

//             }

//         } else {
//             setFillAllFieldsAlert(true);
//         }


//     };

//     const handleUnitSelect = (unit) => {
//         setSelectedUnit(unit);
//         console.log('Unidad seleccionada:', unit);
//     };



//     return (
//         <>
//             <Modal show={openModal} size="md" onClose={onCancel} popup>
//                 <Modal.Header />
//                 <Modal.Body>
//                     <div className="space-y-6">
//                         <Label className="text-xl font-medium text-gray-900 dark:text-white" htmlFor="quantity" value={"Agregar nuevo ingrediente"} />
//                         <div>
//                             <div className="mb-2 block">
//                                 <Label htmlFor="itemName" value={"Nombre"} />
//                             </div>
//                             <TextInput
//                                 id="itemName"
//                                 value={itemName}
//                                 onChange={(e) => setItemName(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <div className="mb-2 block">
//                                 <Label htmlFor="quantity" value={"Cantidad"} />
//                             </div>
//                             <TextInput
//                                 id="quantity"
//                                 value={quantity}
//                                 onChange={(e) => setQuantity(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <div className="mb-2 block">
//                                 <Label htmlFor="unit" value={"Unidad de medida"} />
//                             </div>

//                             <Dropdown color='success' outline dismissOnClick={true} label={selectedUnit || "Seleccionar unidad de medida"}>
//                                 <Dropdown.Item onClick={() => handleUnitSelect("Kg")}>Kg</Dropdown.Item>
//                                 <Dropdown.Item onClick={() => handleUnitSelect("Pcs")}>Piezas o unidades</Dropdown.Item>
//                                 <Dropdown.Item onClick={() => handleUnitSelect("Liter")}>Litro</Dropdown.Item>
//                             </Dropdown>
//                         </div>
//                         <div>
//                             <div className="mb-2 block">
//                                 <Label htmlFor="price" value={"S/. (Precio por unidad)"} />
//                             </div>
//                             <TextInput
//                                 id="price"
//                                 value={price}
//                                 onChange={(e) => setPrice(e.target.value)}
//                                 required
//                             />
//                         </div>
//                         <div>
//                             <div className="mb-2 block">
//                                 <Label htmlFor="vendorName" value="Nombre del proveedor" />
//                             </div>
//                             <TextInput
//                                 id="vendorName"
//                                 type="text"
//                                 value={vendorId}
//                                 onChange={(e) => setVendorId(e.target.value)}
//                                 required />
//                         </div>
//                         {/* Fill all fields alert */}
//                         {fillAllFieldsAlert && (
//                             <Alert color="failure" icon={HiInformationCircle}>
//                                 <span className="font-medium">Por favor complete todos los campos!</span>
//                             </Alert>
//                         )}

//                         <div className="w-full">
//                             <Button color="success" onClick={handleAddItem} disabled={!selectedUnit} >Agregar</Button>
//                         </div>

//                     </div>

//                 </Modal.Body>
//             </Modal>
//             {/* inventory item added popup window */}
//             {isaddSuccessModel && (
//                 <Modal show={isaddSuccessModel} size="md" onClose={() => setAddSuccessModel(false)} popup>
//                     <Modal.Header />
//                     <Modal.Body>
//                         <div className="text-center">
//                             <HiCheck className="mx-auto mb-4 h-14 w-14 text-green-500 dark:text-gray-200" />
//                             <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
//                                 Artículo añadido al inventario con éxito
//                             </h3>
//                         </div>
//                     </Modal.Body>
//                 </Modal>
//             )}

//         </>
//     );
// }
// export default AddInventoryItem;

import { Button, Label, Modal, TextInput, Dropdown, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { HiCheck, HiInformationCircle } from "react-icons/hi";
import Swal from "sweetalert2";

function AddInventoryItem({ onSubmit, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [isaddSuccessModel, setAddSuccessModel] = useState(false);
    const [fillAllFieldsAlert, setFillAllFieldsAlert] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        // Hide the alert after 2 seconds
        const timeout = setTimeout(() => {
            setAddSuccessModel(false);
            setFillAllFieldsAlert(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [fillAllFieldsAlert, isaddSuccessModel]);

    useEffect(() => {
        setTotalPrice(quantity * price);
    }, [quantity, price]);

    const validateFields = () => {
        const errors = {};
        
        // Validate item name (letters only, max 50 chars)
        if (!itemName.trim()) {
            errors.itemName = 'El nombre del ingrediente es requerido';
        } else if (/\d/.test(itemName)) {
            errors.itemName = 'El nombre no debe contener números';
        } else if (itemName.length > 50) {
            errors.itemName = 'El nombre es demasiado largo (máx 50 caracteres)';
        }
        
        // Validate quantity (numbers only, minimum 1)
        if (!quantity) {
            errors.quantity = 'La cantidad es requerida';
        } else if (isNaN(quantity)) {
            errors.quantity = 'La cantidad debe ser un número';
        } else if (parseFloat(quantity) < 1) {
            errors.quantity = 'La cantidad mínima es 1';
        }
        
        // Validate price (numbers only)
        if (!price) {
            errors.price = 'El precio es requerido';
        } else if (isNaN(price)) {
            errors.price = 'El precio debe ser un número';
        }
        
        // Validate unit
        if (!selectedUnit) {
            errors.unit = 'La unidad de medida es requerida';
        }
        
        // Validate vendor (letters only, max 50 chars)
        if (!vendorId.trim()) {
            errors.vendorId = 'El proveedor es requerido';
        } else if (/\d/.test(vendorId)) {
            errors.vendorId = 'El proveedor no debe contener números';
        } else if (vendorId.length > 50) {
            errors.vendorId = 'El nombre del proveedor es demasiado largo (máx 50 caracteres)';
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddItem = async () => {
        if (!validateFields()) {
            setFillAllFieldsAlert(true);
            return;
        }

        const newItem = {
            itemName,
            quantity,
            vendorId,
            unit: selectedUnit,
            totalPrice
        };

        try {
            const response = await axios.post('http://localhost:8080/api/inventory/add', newItem);

            if (response.data === 'Artículo añadido al inventario con éxito') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Artículo añadido al inventario con éxito',
                    timer: 2000,
                    showConfirmButton: false
                });

                onSubmit(); // Reload items after adding
                setItemName('');
                setQuantity('');
                setVendorId('');
                setPrice('');
                setSelectedUnit('');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo agregar el artículo',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error al agregar el artículo: ${error.message}`,
            });
        }
    };

    const handleUnitSelect = (unit) => {
        setSelectedUnit(unit);
        setValidationErrors({...validationErrors, unit: null});
    };

    return (
        <>
            <Modal show={openModal} size="md" onClose={onCancel} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <Label className="text-xl font-medium text-gray-900 dark:text-white" htmlFor="quantity" value={"Agregar nuevo ingrediente"} />
                        
                        {/* Item Name Field */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="itemName" value={"Nombre"} />
                            </div>
                            <TextInput
                                id="itemName"
                                value={itemName}
                                onChange={(e) => {
                                    setItemName(e.target.value);
                                    setValidationErrors({...validationErrors, itemName: null});
                                }}
                                required
                            />
                            {validationErrors.itemName && (
                                <span className="text-red-500 text-sm">{validationErrors.itemName}</span>
                            )}
                        </div>
                        
                        {/* Quantity Field */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="quantity" value={"Cantidad"} />
                            </div>
                            <TextInput
                                id="quantity"
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => {
                                    setQuantity(e.target.value);
                                    setValidationErrors({...validationErrors, quantity: null});
                                }}
                                required
                            />
                            {validationErrors.quantity && (
                                <span className="text-red-500 text-sm">{validationErrors.quantity}</span>
                            )}
                        </div>
                        
                        {/* Unit Field */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="unit" value={"Unidad de medida"} />
                            </div>
                            <Dropdown color='success' outline dismissOnClick={true} label={selectedUnit || "Seleccionar unidad de medida"}>
                                <Dropdown.Item onClick={() => handleUnitSelect("Kg")}>Kg</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleUnitSelect("Pcs")}>Piezas o unidades</Dropdown.Item>
                                <Dropdown.Item onClick={() => handleUnitSelect("Liter")}>Litro</Dropdown.Item>
                            </Dropdown>
                            {validationErrors.unit && (
                                <span className="text-red-500 text-sm">{validationErrors.unit}</span>
                            )}
                        </div>
                        
                        {/* Price Field */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="price" value={"S/. (Precio por unidad)"} />
                            </div>
                            <TextInput
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                    setValidationErrors({...validationErrors, price: null});
                                }}
                                required
                            />
                            {validationErrors.price && (
                                <span className="text-red-500 text-sm">{validationErrors.price}</span>
                            )}
                        </div>
                        
                        {/* Vendor Field */}
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="vendorName" value="Nombre del proveedor" />
                            </div>
                            <TextInput
                                id="vendorName"
                                type="text"
                                value={vendorId}
                                onChange={(e) => {
                                    setVendorId(e.target.value);
                                    setValidationErrors({...validationErrors, vendorId: null});
                                }}
                                required
                            />
                            {validationErrors.vendorId && (
                                <span className="text-red-500 text-sm">{validationErrors.vendorId}</span>
                            )}
                        </div>
                        
                        {/* Total Price Display */}
                        <div className="font-medium">
                            <Label value={`Precio total: S/. ${totalPrice || '0'}`} />
                        </div>

                        {/* Fill all fields alert */}
                        {fillAllFieldsAlert && (
                            <Alert color="failure" icon={HiInformationCircle}>
                                <span className="font-medium">Por favor complete todos los campos correctamente!</span>
                            </Alert>
                        )}

                        <div className="w-full">
                            <Button color="success" onClick={handleAddItem}>Agregar</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddInventoryItem;