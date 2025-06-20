import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal } from "flowbite-react";

const QuantityInputModal = ({ isOpen, onToggle, onAddToBill, itemData }) => {
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        if (isOpen) {
            setQuantity(1)
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const newValue = e.target.value;

        if (newValue > 0) {
            setQuantity(parseInt(newValue));
        }
    };

    const handleAddToBillClick = () => {
        onAddToBill(quantity);
        onToggle();
    };

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PEN'
    }).format(itemData.foodPrice);

    return (
        <>
            <Modal show={isOpen} size="md" onClose={onToggle} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <div className="flex-col">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{itemData.foodName}</h3>
                            <p className="text-sm text-gray-900 dark:text-white">{formattedPrice}</p>
                        </div>

                        <div className="grid gap-6 mb-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Cantidad
                                </label>
                                <input
                                    type="number"
                                    id="qut"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={quantity}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleAddToBillClick}
                            type="submit"
                            className="w-full my-2 text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <i className="ri-add-large-fill"></i> Añadir a la factura
                        </button>
                        <button
                            onClick={onToggle}
                            type="button"
                            className=" w-full my-2 text-white bg-orange-500 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            <i className="ri-close-large-fill"></i> Cerrar
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

QuantityInputModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onAddToBill: PropTypes.func.isRequired,
    itemData: PropTypes.object.isRequired
};

export default QuantityInputModal;
