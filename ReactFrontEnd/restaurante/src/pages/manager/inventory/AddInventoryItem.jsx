

import { Button, Label, Modal, TextInput, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { HiInformationCircle } from "react-icons/hi";
import Swal from "sweetalert2";
import Select from "react-select";

function AddInventoryItem({ onSubmit, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [formData, setFormData] = useState({
        itemName: '',
        quantity: '',
        price: '',
        vendorId: '',
        unit: '',
        totalPrice: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isCheckingName, setIsCheckingName] = useState(false);

    const unitOptions = [
        { value: 'kg', label: 'Kilogramos (kg)' },
        { value: 'g', label: 'Gramos (g)' },
        { value: 'l', label: 'Litros (l)' },
        { value: 'ml', label: 'Mililitros (ml)' },
        { value: 'pcs', label: 'Unidades (pcs)' },
        { value: 'doz', label: 'Docena (doz)' },
        { value: 'pkg', label: 'Paquete (pkg)' },
        { value: 'tbsp', label: 'Cucharada (tbsp)' },
        { value: 'tsp', label: 'Cucharadita (tsp)' },
        { value: 'cup', label: 'Taza (cup)' },
        { value: 'box', label: 'Caja (box)' },
        { value: 'gal', label: 'Galón (gal)' },
        { value: 'bag', label: 'Bolsa (bag)' },
        { value: 'bottle', label: 'Botella (bottle)' }
    ];

    useEffect(() => {
        if (formData.quantity && formData.price) {
            setFormData(prev => ({
                ...prev,
                totalPrice: (parseFloat(prev.quantity) * parseFloat(prev.price)).toFixed(2)
            }));
        }
    }, [formData.quantity, formData.price]);

    const checkItemNameExists = async (name) => {
        try {
            setIsCheckingName(true);
            const response = await axios.get(`http://localhost:8080/api/inventory/check-name?name=${encodeURIComponent(name)}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error al verificar el nombre:', error);
            return false;
        } finally {
            setIsCheckingName(false);
        }
    };

    const validateFields = async () => {
        const errors = {};

        if (!formData.itemName.trim()) {
            errors.itemName = 'El nombre del ingrediente es requerido';
        } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(formData.itemName)) {
            errors.itemName = 'El nombre solo debe contener letras y espacios';
        } else if (formData.itemName.length > 50) {
            errors.itemName = 'El nombre es demasiado largo (máx 50 caracteres)';
        } else {
            const nameExists = await checkItemNameExists(formData.itemName);
            if (nameExists) {
                errors.itemName = 'Este ingrediente ya existe en el inventario';
            }
        }


        if (!formData.quantity) {
            errors.quantity = 'La cantidad es requerida';
        } else if (isNaN(formData.quantity)) {
            errors.quantity = 'La cantidad debe ser un número';
        } else if (!Number.isInteger(Number(formData.quantity))) {
            errors.quantity = 'La cantidad debe ser un número entero';
        } else if (parseInt(formData.quantity) <= 0) {
            errors.quantity = 'La cantidad debe ser mayor a 0';
        }


        if (!formData.price) {
            errors.price = 'El precio es requerido';
        } else if (isNaN(formData.price)) {
            errors.price = 'El precio debe ser un número';
        } else if (!/^\d+(\.\d)?$/.test(formData.price)) {
            errors.price = 'El precio debe tener como máximo un decimal';
        } else if (parseFloat(formData.price) <= 0) {
            errors.price = 'El precio debe ser mayor a 0';
        }


        if (!formData.unit) {
            errors.unit = 'La unidad de medida es requerida';
        }

        if (!formData.vendorId.trim()) {
            errors.vendorId = 'El proveedor es requerido';
        } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(formData.vendorId)) {
            errors.vendorId = 'El proveedor solo debe contener letras y espacios';
        } else if (formData.vendorId.length > 50) {
            errors.vendorId = 'El nombre del proveedor es demasiado largo (máx 50 caracteres)';
        }


        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddItem = async () => {
        // Validación inicial del formulario
        if (!await validateFields()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor corrija los errores en el formulario',
            });
            return;
        }

        try {
            const itemToSend = {
                ...formData,
                totalPrice: parseFloat(formData.quantity) * parseFloat(formData.price)
            };

            await axios.post('http://localhost:8080/api/inventory/add', itemToSend);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Artículo añadido al inventario con éxito',
                timer: 2000,
                showConfirmButton: false
            });
            onSubmit();
            onCancel();
        } catch (error) {
            let errorMessage = 'Error al agregar el artículo';

            if (error.response) {
                if (error.response.status === 409) {
                    errorMessage = error.response.data || 'Este ingrediente ya existe en el inventario';
                    setValidationErrors({ ...validationErrors, itemName: errorMessage });
                } else {
                    errorMessage = error.response.data || errorMessage;
                }
            }

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleUnitChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            unit: selectedOption.value
        }));
        setValidationErrors(prev => ({ ...prev, unit: null }));
    };

    return (
        <Modal show={openModal} size="md" onClose={onCancel} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <Label className="text-xl font-medium text-gray-900 dark:text-white"
                        value="Agregar nuevo artículo" />

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="itemName" value="Nombre del artículo" />
                        </div>
                        <div className="relative">
                            <TextInput
                                id="itemName"
                                name="itemName"
                                type="text"
                                value={formData.itemName}
                                onChange={handleInputChange}
                                maxLength={50}
                                required
                                placeholder="Nombre del artículo"
                            />
                            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                {formData.itemName.length}/50
                            </div>
                        </div>
                        {validationErrors.itemName && (
                            <span className="text-red-500 text-sm">{validationErrors.itemName}</span>
                        )}
                        {isCheckingName && (
                            <span className="text-blue-500 text-sm">Verificando nombre...</span>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="quantity" value="Cantidad" />
                        </div>
                        <TextInput
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Cantidad del artículo"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.quantity && (
                            <span className="text-red-500 text-sm">{validationErrors.quantity}</span>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="unit" value="Unidad de medida" />
                        </div>
                        <Select
                            id="unit"
                            options={unitOptions}
                            value={unitOptions.find(option => option.value === formData.unit)}
                            onChange={handleUnitChange}
                            placeholder="Seleccionar unidad de medida"
                            className="text-sm"
                            noOptionsMessage={() => "No hay opciones disponibles"}

                        />
                        {validationErrors.unit && (
                            <span className="text-red-500 text-sm">{validationErrors.unit}</span>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="price" value="Precio por unidad (S/.)" />
                        </div>
                        <TextInput
                            id="price"
                            name="price"
                            type="number"
                            min="1"
                            step="0.1"
                            placeholder="Precio por unidad"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                        />
                        {validationErrors.price && (
                            <span className="text-red-500 text-sm">{validationErrors.price}</span>
                        )}
                    </div>

                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="vendorId" value="Nombre del proveedor" />
                        </div>
                        <div className="relative">
                            <TextInput
                                id="vendorId"
                                name="vendorId"
                                type="text"
                                value={formData.vendorId}
                                onChange={handleInputChange}
                                maxLength={50}
                                required
                                placeholder="Nombre del proveedor"
                            />
                            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                {formData.vendorId.length}/50
                            </div>
                        </div>
                        {validationErrors.vendorId && (
                            <span className="text-red-500 text-sm">{validationErrors.vendorId}</span>
                        )}
                    </div>

                    <div className="font-medium">
                        <Label value={`Precio total: S/. ${formData.totalPrice || '0.00'}`} />
                    </div>

                    <div className="w-full">
                        <Button
                            onClick={handleAddItem}
                            color='success'
                            className='bg-green-500 hover:bg-green-600'
                        >
                            Agregar
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddInventoryItem;