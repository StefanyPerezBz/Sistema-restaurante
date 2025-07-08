import { Button, Label, Modal, TextInput, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FileInput } from "flowbite-react";
import Swal from 'sweetalert2';
import { HiInformationCircle } from "react-icons/hi";

function EditFoodItem({ foodId, onSubmit, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [file, setFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [nameError, setNameError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [formError, setFormError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasImageChanged, setHasImageChanged] = useState(false);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/food/get/${foodId}`);
                const { foodName, foodPrice, foodImageURL } = response.data;
                setName(foodName);
                setPrice(foodPrice);
                setImageUrl(foodImageURL);

                // Mostrar vista previa de la imagen existente
                if (foodImageURL) {
                    setPreviewImage(`http://localhost:8080/api/food/image/${foodImageURL}`);
                }
            } catch (error) {
                console.error('Error al obtener los detalles del artículo:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los detalles del artículo',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        };

        fetchItemDetails();
    }, [foodId]);

    const validateForm = () => {
        let isValid = true;
        setFormError('');

        // Validar nombre (máximo 50 caracteres)
        if (!name || name.length > 50) {
            setNameError(true);
            isValid = false;
            setFormError('El nombre es requerido (máximo 50 caracteres)');
        } else {
            setNameError(false);
        }

        // Validar precio (número con hasta 1 decimal)
        const priceRegex = /^\d+(\.\d{1})?$/;
        if (!price || !priceRegex.test(price)) {
            setPriceError(true);
            isValid = false;
            setFormError('Ingrese un precio válido (ejemplo: 10.9)');
        } else {
            setPriceError(false);
        }

        // Validar imagen (obligatoria)
        if (!previewImage) {
            setImageError(true);
            isValid = false;
            setFormError('La imagen es requerida');
        } else {
            setImageError(false);
        }

        return isValid;
    }

    const handleUpdateItem = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Subir nueva imagen si se cambió
            if (hasImageChanged && file) {
                await handleImageUpload();
            }

            const updatedItem = {
                foodName: name,
                foodPrice: parseFloat(price),
                foodImageURL: imageUrl
            };

            await axios.put(`http://localhost:8080/api/food/edit/${foodId}`, updatedItem);

            Swal.fire({
                title: '¡Éxito!',
                text: 'El artículo se ha actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                onSubmit(); // Recargar items después de editar
            });

        } catch (error) {
            console.error('Error al actualizar el elemento:', error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar el artículo',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/food/upload-image/${foodId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setImageUrl(response.data);
            return true;
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            throw error;
        }
    }

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
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
            setHasImageChanged(true);
            setFormError('');

            // Crear URL de vista previa
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    }

    return (
        <Modal show={openModal} size="md" onClose={onCancel} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        Editar artículo: {name}
                    </h3>

                    {/* Nombre del alimento */}
                    <div>
                        <div className="mb-2 block flex justify-between">
                            <Label htmlFor="foodName" value="Nombre del artículo *" />
                            <span className="text-sm text-gray-500">{name.length}/50 caracteres</span>
                        </div>
                        <TextInput
                            id="foodName"
                            value={name}
                            placeholder="Ej: Hamburguesa clásica"
                            onChange={(e) => {
                                const input = e.target.value;
                                const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;   // letras, tildes, ñ, espacios

                                if (input.length <= 50 && regex.test(input)) {
                                    setName(input);
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
                            <Label htmlFor="price" value="Precio (S/.) *" />
                        </div>
                        <TextInput
                            id="price"
                            value={price}
                            placeholder="Ej: 10.9"
                            onChange={(e) => {
                                const value = e.target.value;
                                const regex = /^\d+(\.\d{0,1})?$/; // enteros o con un decimal
                                if (value === "" || regex.test(value)) {
                                    setPrice(value);
                                    setPriceError(false);
                                }
                            }}
                            color={priceError ? "failure" : ""}
                            required
                        />

                    </div>

                    {/* Imagen del alimento */}
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="image" value="Imagen del artículo *" />
                        </div>

                        {previewImage && (
                            <div className="mt-2 mb-4">
                                <p className="text-sm text-gray-500 mb-2">Vista previa:</p>
                                <img
                                    src={previewImage}
                                    alt="Imagen actual"
                                    className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}

                        <FileInput
                            id="newImage"
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
                    </div>

                    {/* Mensaje de error general */}
                    {formError && (
                        <Alert color="failure" icon={HiInformationCircle}>
                            <span className="font-medium">Error:</span> {formError}
                        </Alert>
                    )}

                    {/* Botón de actualizar */}
                    <div className="w-full pt-4">
                        <Button
                            gradientDuoTone="greenToBlue"
                            onClick={handleUpdateItem}
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting ? 'Actualizando...' : 'Guardar cambios'}
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default EditFoodItem;