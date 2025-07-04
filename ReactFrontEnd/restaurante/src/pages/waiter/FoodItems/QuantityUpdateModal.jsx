import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal } from "flowbite-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const QuantityUpdateModal = ({ isOpen, onToggle, editQuantity, itemData }) => {
    const [quantity, setQuantity] = useState(1);
    const [inputError, setInputError] = useState("");

    useEffect(() => {
        if (isOpen) {
            setQuantity(itemData.quantity);
            setInputError("");
        }
    }, [isOpen, itemData.quantity]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputError(""); // Limpiar error al cambiar

        if (newValue === "") {
            setQuantity("");
            return;
        }

        const numValue = parseInt(newValue);
        if (!isNaN(numValue)) {
            setQuantity(numValue);
        }
    };

    const validateInput = () => {
        if (quantity === "" || isNaN(quantity)) {
            setInputError("La cantidad es obligatoria");
            return false;
        }

        if (quantity < 1) {
            setInputError("La cantidad mínima es 1");
            return false;
        }

        if (!Number.isInteger(quantity)) {
            setInputError("Debe ser un número entero");
            return false;
        }

        return true;
    };

    const confirmUpdateQuantity = () => {
        if (!validateInput()) {
            MySwal.fire({
                title: "Error",
                text: inputError || "Por favor ingrese una cantidad válida",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        if (quantity === itemData.quantity) {
            MySwal.fire({
                title: "Sin cambios",
                text: "La cantidad ingresada es la misma que la actual",
                icon: "info",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        MySwal.fire({
            title: `¿Actualizar cantidad de ${itemData.foodName}?`,
            html: `<p>De ${itemData.quantity} a ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}</p>
                  <small>Total: ${new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN'
                  }).format(itemData.foodPrice * quantity)}</small>`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, actualizar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                editQuantity(quantity);
                onToggle();
                
                MySwal.fire({
                    title: "¡Actualizado!",
                    text: `La cantidad de ${itemData.foodName} se ha actualizado a ${quantity} ${quantity === 1 ? 'unidad' : 'unidades'}`,
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    timer: 1500
                });
            }
        });
    };

    const formattedPrice = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(itemData.foodPrice);

    return (
        <Modal show={isOpen} size="md" onClose={onToggle} popup>
            <Modal.Header />
            <Modal.Body>
                <div className="space-y-6">
                    <div className="flex-col">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{itemData.foodName}</h3>
                        <p className="text-sm text-gray-900 dark:text-white">{formattedPrice}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Cantidad actual: {itemData.quantity}
                        </p>
                    </div>

                    <div className="grid gap-6 mb-6">
                        <div>
                            <label
                                htmlFor="qut"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Nueva cantidad *
                            </label>
                            <input
                                type="number"
                                id="qut"
                                min="1"
                                step="1"
                                className={`bg-gray-50 border ${inputError ? "border-red-500" : "border-gray-300"} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                value={quantity}
                                onChange={handleChange}
                                required
                            />
                            {inputError && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                                    {inputError}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={confirmUpdateQuantity}
                            type="button"
                            className="w-full text-white bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:outline-none focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-800 flex items-center justify-center"
                        >
                            <i className="ri-refresh-line mr-2"></i> Actualizar cantidad
                        </button>
                        <button
                            onClick={onToggle}
                            type="button"
                            className="w-full text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 flex items-center justify-center"
                        >
                            <i className="ri-close-line mr-2"></i> Cancelar
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

QuantityUpdateModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    editQuantity: PropTypes.func.isRequired,
    itemData: PropTypes.shape({
        foodName: PropTypes.string.isRequired,
        foodPrice: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
    }).isRequired,
};

export default QuantityUpdateModal;