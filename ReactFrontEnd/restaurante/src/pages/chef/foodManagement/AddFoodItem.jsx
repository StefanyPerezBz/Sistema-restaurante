
import { Button, Label, Modal, TextInput, Alert, FileInput, Dropdown } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import axios from "axios";
import Swal from 'sweetalert2';

export function AddFoodItem({ onClose }) {
    const [openModal, setOpenModal] = useState(true);
    const [foodName, setFoodName] = useState('');
    const [foodPrice, setFoodPrice] = useState('');
    const [selectedCat, setSelectedCat] = useState('');
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [categoryError, setCategoryError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [formError, setFormError] = useState('');

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(selectedFile.type)) {
                setImageError(true);
                setFormError('Formato de imagen no válido. Use JPEG, JPG o PNG');
                return;
            }

            // Validar tamaño de archivo (máximo 2MB)
            if (selectedFile.size > 2 * 1024 * 1024) {
                setImageError(true);
                setFormError('La imagen es demasiado grande (máximo 2MB)');
                return;
            }

            setFile(selectedFile);
            setImageError(false);
            setFormError('');

            // Crear URL de vista previa
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    const handleCategorySelect = (category) => {
        setSelectedCat(category);
        setCategoryError(false);
    }

    const validateForm = () => {
        let isValid = true;
        setFormError('');

        // Validar nombre (máximo 50 caracteres)
        if (!foodName || foodName.length > 50) {
            setNameError(true);
            isValid = false;
            setFormError('El nombre es requerido (máximo 50 caracteres)');
        } else {
            setNameError(false);
        }

        // Validar precio (número con hasta 1 decimal)
        const priceRegex = /^\d+(\.\d{1})?$/;
        if (!foodPrice || !priceRegex.test(foodPrice)) {
            setPriceError(true);
            isValid = false;
            setFormError('Ingrese un precio válido (ejemplo: 10.9)');
        } else {
            setPriceError(false);
        }

        // Validar categoría
        if (!selectedCat) {
            setCategoryError(true);
            isValid = false;
            setFormError('Seleccione una categoría');
        } else {
            setCategoryError(false);
        }

        // Validar imagen (ahora obligatoria)
        if (!file) {
            setImageError(true);
            isValid = false;
            setFormError('La imagen es requerida');
        } else {
            setImageError(false);
        }

        return isValid;
    }

    const handleAddFood = async () => {
        if (!validateForm()) {
            return;
        }

        const addItem = {
            foodName,
            foodPrice: parseFloat(foodPrice),
            foodCategory: selectedCat,
        };

        try {
            const response = await axios.post(`http://localhost:8080/api/food/add`, addItem);

            // Subir la imagen (obligatoria)
            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.post(
                    `http://localhost:8080/api/food/upload-image/${response.data.foodId}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Artículo agregado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    onClose();
                });

            } catch (error) {
                console.error('Error al subir la imagen:', error);
                // Eliminar el artículo si falla la subida de imagen
                await axios.delete(`http://localhost:8080/api/food/delete/${response.data.foodId}`);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al subir la imagen. El artículo no fue creado.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }

        } catch (error) {
            console.error('Error al agregar comida:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al agregar el artículo',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    return (
        <Modal show={openModal} size="2xl" onClose={onClose} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar artículo al menú</h3>

                    {/* Nombre del alimento */}
                    <div>
                        <div className="mb-2 block flex justify-between">
                            <Label htmlFor="foodName" value="Nombre del artículo" />
                            <span className="text-sm text-gray-500">{foodName.length}/50 caracteres</span>
                        </div>
                        <TextInput
                            id="foodName"
                            placeholder="Ej: Hamburguesa clásica"
                            value={foodName}
                            onChange={(e) => {
                                const input = e.target.value;
                                // Solo letras (incluye tildes y ñ Ñ), espacios y hasta 50 caracteres
                                const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;

                                if (input.length <= 50 && regex.test(input)) {
                                    setFoodName(input);
                                    setNameError(false);
                                }
                            }}
                            color={nameError ? "failure" : ""}
                            required
                        />
                    </div>

                    {/* Precio del alimento */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="price" value="Precio (S/.)" />
                        </div>
                        <TextInput
                            id="foodPrice"
                            placeholder="Ej: 5.9"
                            value={foodPrice}
                            onChange={(e) => {
                                const value = e.target.value;
                                const regex = /^\d+(\.\d{0,1})?$/; // Acepta enteros y un decimal opcional
                                if (value === "" || regex.test(value)) {
                                    setFoodPrice(value);
                                    setPriceError(false);
                                }
                            }}
                            color={priceError ? "failure" : ""}
                            required
                        />

                    </div>

                    {/* Imagen del alimento (obligatoria) */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="foodImage" value="Imagen del artículo *" />
                        </div>
                        <FileInput
                            id="file"
                            accept=".png, .jpeg, .jpg"
                            onChange={handleImageChange}
                            color={imageError ? "failure" : ""}
                            helperText={
                                imageError ?
                                    "Imagen requerida (JPEG, JPG o PNG, máx. 2MB)" :
                                    "Seleccione una imagen (JPEG, JPG o PNG, máx. 2MB)"
                            }
                            required
                        />
                        {previewImage && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                                <img
                                    src={previewImage}
                                    alt="Vista previa"
                                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    {/* Categoría del alimento */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="foodCategory" value="Categoría *" />
                        </div>
                        <Dropdown
                            color={categoryError ? "failure" : "success"}
                            outline
                            dismissOnClick={true}
                            label={selectedCat || "Seleccionar categoría"}
                            className="w-full"
                        >
                            <Dropdown.Item onClick={() => handleCategorySelect("Main Dish")}>Plato Principal</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Side Dish")}>Guarnición</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Beverages")}>Bebidas</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Dessert")}>Postre</Dropdown.Item>
                        </Dropdown>
                    </div>

                    {/* Mensaje de error general */}
                    {formError && (
                        <Alert color="failure" icon={HiInformationCircle}>
                            <span className="font-medium">Error:</span> {formError}
                        </Alert>
                    )}

                    {/* Botón de agregar */}
                    <div className="w-full pt-4">
                        <Button
                            gradientDuoTone="greenToBlue"
                            onClick={handleAddFood}
                            className="w-full"
                        >
                            Agregar artículo al menú
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default AddFoodItem;