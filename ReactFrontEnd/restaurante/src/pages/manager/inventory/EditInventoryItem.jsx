

import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

function EditInventoryItem({ itemId, onSubmit, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [formData, setFormData] = useState({
        quantity: '',
        vendorId: '',
        unit: '',
        itemName: '',
        price: '',
        totalPrice: ''
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [isCheckingName, setIsCheckingName] = useState(false);
    const [originalItemName, setOriginalItemName] = useState('');

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
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`localhost:8080/api/inventory/view/${itemId}`);
                const { quantity, vendorId, unit, itemName, price, totalPrice } = response.data;

                setFormData({
                    quantity,
                    vendorId,
                    unit,
                    itemName,
                    price,
                    totalPrice
                });
                setOriginalItemName(itemName);
            } catch (error) {
                console.error('Error al obtener los detalles del artículo:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los detalles del artículo',
                });
            }
        };
        fetchItemDetails();
    }, [itemId]);

    useEffect(() => {
        // Calcular el precio total cuando cambian cantidad o precio
        if (formData.quantity && formData.price) {
            const total = parseFloat(formData.quantity) * parseFloat(formData.price);
            setFormData(prev => ({
                ...prev,
                totalPrice: total.toFixed(2)
            }));
        }
    }, [formData.quantity, formData.price]);

    const checkItemNameExists = async (name) => {
        try {
            setIsCheckingName(true);
            const response = await axios.get(
                `localhost:8080/api/inventory/check-name-edit?name=${encodeURIComponent(name)}&id=${itemId}`
            );
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
            errors.itemName = 'El nombre del artículo es requerido';
        } else if (!/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/.test(formData.itemName)) {
            errors.itemName = 'El nombre solo debe contener letras y espacios';
        } else if (formData.itemName.length > 50) {
            errors.itemName = 'El nombre es demasiado largo (máx 50 caracteres)';
        } else if (formData.itemName !== originalItemName) {
            const nameExists = await checkItemNameExists(formData.itemName);
            if (nameExists) {
                errors.itemName = 'Este nombre de artículo ya existe en el inventario';
            }
        }

        if (!formData.quantity) {
            errors.quantity = 'La cantidad es requerida';
        } else if (isNaN(formData.quantity)) {
            errors.quantity = 'La cantidad debe ser un número';
        } else if (parseFloat(formData.quantity) <= 0) {
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

    const handleUpdateItem = async () => {
        if (!await validateFields()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor corrija los errores en el formulario',
            });
            return;
        }

        try {
            const updatedItem = {
                itemName: formData.itemName,
                quantity: parseFloat(formData.quantity),
                vendorId: formData.vendorId,
                unit: formData.unit,
                price: parseFloat(formData.price),
                totalPrice: parseFloat(formData.totalPrice)
            };

            await axios.put(`localhost:8080/api/inventory/edit/${itemId}`, updatedItem);

            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Artículo actualizado con éxito',
                timer: 2000,
                showConfirmButton: false
            });
            onSubmit();
            onCancel();
        } catch (error) {
            let errorMessage = error.response?.data || error.message;

            if (error.response?.status === 409) {
                setValidationErrors({ ...validationErrors, itemName: 'Este nombre de artículo ya existe en el inventario' });
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
                        value="Editar artículo" />

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
                            min="0.01"
                            step="0.01"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            required
                            placeholder="Cantidad del artículo"
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
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                            placeholder="Precio por unidad del artículo"
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
                            onClick={handleUpdateItem}
                            color='success'
                            className='bg-green-500 hover:bg-green-600'
                        >
                            Actualizar
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default EditInventoryItem;