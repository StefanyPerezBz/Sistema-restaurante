import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import CustomerAddModal from "../customer/CustomerAddModal";
import SearchCustomerModal from "../customer/SearchCustomerModal";
import UpdateCustomerModal from "../customer/UpdateCustomerModal";
import axios from 'axios';
import QuantityInputModal from "../FoodItems/QuantityInputModal";
import QuantityUpdateModal from "../FoodItems/QuantityUpdateModal";
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function TakeOrder() {
    const [responseErrors, setResponseErrors] = useState('');
    const { currentUser } = useSelector((state) => state.user);

    const [customerAddModal, SetCustomerAddModal] = useState(false);
    const [customerSearchModal, SetCustomerSearchModal] = useState(false);
    const [customerUpdateModal, SetCustomerUpdateModal] = useState(false);
    const [customerData, setCustomerData] = useState({});

    const [quantityModalOpen, setQuantityModalOpen] = useState(false);
    const [quantityUpdateModalOpen, setQuantityUpdateModalOpen] = useState(false);
    const [foodItems, setFoodItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedFoodItem, setSelectedFoodItem] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [billItemData, setBillItemData] = useState({});
    const [tableList, setTableList] = useState([]);
    const [tableNumber, setTableNumber] = useState(0);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [subtotal, setSubtotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    useEffect(() => {
        setResponseErrors("");
        getAvailableTables();

        axios.get("http://localhost:8080/api/food/available")
            .then(response => {
                setFoodItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching food items:", error);
                showError("Error al cargar los artículos del menú");
            });
    }, []);

    useEffect(() => {
        const newSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
        setSubtotal(newSubtotal);
        const discountAmount = (newSubtotal * discountPercentage) / 100;
        setTotalAfterDiscount(newSubtotal - discountAmount);
    }, [orderItems, discountPercentage]);

    const showError = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#3085d6',
            customClass: {
                container: 'z-[9999]'
            }
        });
    };

    const showSuccess = (message) => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            confirmButtonColor: '#3085d6',
            customClass: {
                container: 'z-[9999]'
            }
        });
    };

    const openCustomerAddModal = () => SetCustomerAddModal(prev => !prev);
    const OpenSearchCustomerModal = () => SetCustomerSearchModal(prev => !prev);
    const OpenCustomerUpdateModal = () => SetCustomerUpdateModal(prev => !prev);
    const OpenQuantityModal = () => setQuantityModalOpen(prev => !prev);

    const openQuantityUpdateModal = (item) => {
        setBillItemData(item);
        setQuantityUpdateModalOpen(true);
    };

    const closeQuantityUpdateModal = () => {
        setBillItemData({});
        setQuantityUpdateModalOpen(false);
    };

    const handleCustomerModalResponse = (Data) => setCustomerData(Data);

    const handleClearFields = () => {
        setCustomerData({
            cusName: '',
            cusMobile: '',
            cusEmail: ''
        });
    };

    const handleTableNumberChange = (selectedOption) => {
        setTableNumber(selectedOption ? selectedOption.value : 0);
    };

    const handleNoteChange = (event) => setNote(event.target.value);

    const filteredFoodItems = foodItems.filter(item =>
        (activeCategory === "All" || item.foodCategory === activeCategory) &&
        item.foodName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const changeCategory = (category) => setActiveCategory(category);
    const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);
    const handleSelectedFoodItem = (itemData) => setSelectedFoodItem(itemData);

    const handleAddToBill = (quantity) => {
        if (selectedFoodItem.foodId) {
            const updatedOrderItems = [...orderItems];
            const existingItemIndex = orderItems.findIndex(item => item.foodId === selectedFoodItem.foodId);

            if (existingItemIndex !== -1) {
                const newQuantity = updatedOrderItems[existingItemIndex].quantity += quantity;
                updatedOrderItems[existingItemIndex].totalPrice = selectedFoodItem.foodPrice * newQuantity;
            } else {
                const totalPrice = selectedFoodItem.foodPrice * quantity;
                updatedOrderItems.push({ ...selectedFoodItem, quantity, totalPrice });
            }

            setOrderItems(updatedOrderItems);
            setSelectedFoodItem({});
        }
    };

    const removeFromOrder = (foodId) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres eliminar este artículo del pedido?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            customClass: {
                container: 'z-[9999]'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedOrderItems = orderItems.filter(item => item.foodId !== foodId);
                setOrderItems(updatedOrderItems);
                showSuccess('El artículo ha sido eliminado');
            }
        });
    };

    const updateQuantity = (newQuantity) => {
        const itemIdToUpdate = billItemData.foodId;
        const index = orderItems.findIndex(item => item.foodId === itemIdToUpdate);

        const updatedOrderItems = [...orderItems];
        updatedOrderItems[index].quantity = newQuantity;
        updatedOrderItems[index].totalPrice = updatedOrderItems[index].foodPrice * newQuantity;
        setOrderItems(updatedOrderItems);
    };

    const validateOrder = () => {
        if (orderItems.length < 1) {
            showError('Se debe pedir al menos un artículo');
            return false;
        }

        if (!customerData.cusId) {
            showError('Debe seleccionar un cliente para realizar el pedido');
            return false;
        }

        if (tableNumber === 0) {
            showError('Debe seleccionar una mesa para realizar el pedido');
            return false;
        }

        return true;
    };

    const updateTableAvailability = async (tableNumber, availability) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/table/by-number/${tableNumber}/availability`,
                null, // Cuerpo vacío
                {
                    params: {
                        availability: availability // Envía como parámetro de consulta
                    },
                    headers: { "Content-Type": "application/json" }
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error al ${availability ? 'liberar' : 'ocupar'} la mesa ${tableNumber}:`, error);
            throw error;
        }
    };

    const generateOrder = async () => {
        if (!validateOrder()) return;

        setIsSubmitting(true);

        try {
            // 1. Ocupar la mesa primero
            await updateTableAvailability(tableNumber, false);

            // 2. Crear el pedido
            const convertedOrderItems = orderItems.map(item => ({
                foodItemId: item.foodId,
                quantity: item.quantity,
                foodPrice: item.foodPrice,
                totalPrice: item.totalPrice
            }));

            const orderJSON = {
                customerId: customerData.cusId,
                orderDateTime: new Date().toISOString(),
                orderStatus: "Pending",
                tableNumber: tableNumber,
                subTotal: subtotal,
                discountValue: 0.0,
                discountPercentage: 0.0,
                totalAfterDiscount: totalAfterDiscount,
                paymentMethod: "",
                paymentStatus: false,
                employeeId: currentUser.id,
                orderItems: convertedOrderItems,
                specialNote: note
            };

            const response = await axios.post(
                "http://localhost:8080/api/orders",
                orderJSON,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            if (response.status === 201) {
                // Éxito - limpiar el formulario
                setCustomerData({});
                handleClearFields();
                setOrderItems([]);
                setResponseErrors("");
                setTableNumber(0);
                setNote("");
                showSuccess('Pedido creado correctamente');
            } else {
                throw new Error('Estado de respuesta inesperado');
            }
        } catch (error) {
            console.error("Error al crear el pedido:", error);

            // Revertir la ocupación de la mesa si falla
            if (tableNumber > 0) {
                try {
                    await updateTableAvailability(tableNumber, true);
                } catch (updateError) {
                    console.error("Error al liberar la mesa:", updateError);
                    showError('Error al crear el pedido. La mesa podría quedar ocupada. Contacte al administrador.');
                }
            }

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Error al crear el pedido. Por favor intente nuevamente.';
            showError(errorMessage);
        } finally {
            setIsSubmitting(false);
            getAvailableTables();
        }
    };

    const getAvailableTables = () => {
        axios.get("http://localhost:8080/api/table/available")
            .then(response => {
                setTableList(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las mesas disponibles:", error);
                showError('Error al cargar las mesas disponibles');
            });
    }

    const tableOptions = [
        { value: 0, label: 'Seleccione una mesa' },
        ...tableList.map(data => ({
            value: data.tableNumber,
            label: `Mesa ${data.tableNumber}`
        }))
    ];

    const selectedTableOption = tableOptions.find(option => option.value === tableNumber) || tableOptions[0];

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">
            <div className="w-full">
                <div className="max-w-full px-6">
                    {responseErrors && (
                        <div className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 transition duration-300 ease-in-out" role="alert">
                            <i className="ri-information-2-fill"></i>
                            <span className="sr-only">Error</span>
                            <div className="ms-3 text-sm font-medium">
                                {responseErrors}
                            </div>
                            <button
                                onClick={() => setResponseErrors("")}
                                type="button"
                                className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                                aria-label="Close"
                            >
                                <span className="sr-only">Cerrar</span>
                                <i className="ri-close-large-fill"></i>
                            </button>
                        </div>
                    )}
                    <div className="mx-auto justify-center md:flex md:space-x-6 xl:px-0">
                        <div className="rounded-lg md:w-3/5">
                            <div>
                                <h1 className="mb-2 text-left text-xl font-bold dark:text-white">Orden</h1>
                                <div className="max-w-full mb-2">
                                    <div className="relative">
                                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                            <i className="ri-search-line"></i>
                                        </div>
                                        <input
                                            type="search"
                                            className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Buscar artículos..."
                                            value={searchQuery}
                                            onChange={handleSearchQueryChange}
                                        />
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            type="button"
                                            className="text-white absolute right-2.5 bottom-2.5 bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-500 dark:hover:bg-orange-700"
                                        >
                                            Vaciar
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4 flex space-x-4 p-2 bg-white rounded-lg shadow-md dark:bg-gray-600">
                                    <button onClick={() => changeCategory("All")} className={`flex-1 py-2 px-4 rounded-md ${activeCategory === "All" ? 'bg-green-400 text-white font-bold' : ''}`}>Todo</button>
                                    <button onClick={() => changeCategory("Main Dish")} className={`flex-1 py-2 px-4 rounded-md ${activeCategory === "Main Dish" ? 'bg-green-400 text-white font-bold' : ''}`}>Plato Principal</button>
                                    <button onClick={() => changeCategory("Side Dish")} className={`flex-1 py-2 px-4 rounded-md ${activeCategory === "Side Dish" ? 'bg-green-400 text-white font-bold' : ''}`}>Guarnición</button>
                                    <button onClick={() => changeCategory("Beverages")} className={`flex-1 py-2 px-4 rounded-md ${activeCategory === "Beverages" ? 'bg-green-400 text-white font-bold' : ''}`}>Bebidas</button>
                                </div>

                                <div className='p-2 max-h-[calc(100vh-17rem)] h-auto rounded-lg overflow-auto'>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                        {filteredFoodItems.length < 1 ? (
                                            <div className="col-span-full text-center my-4 text-gray-400">
                                                <p>No se encontraron artículos.</p>
                                            </div>
                                        ) : (
                                            filteredFoodItems.map(item => (
                                                <div key={item.foodId} onClick={() => { OpenQuantityModal(); handleSelectedFoodItem(item); }} className="bg-white shadow-md rounded-lg hover:bg-green-400 hover:text-white dark:bg-gray-600 dark:hover:bg-green-400 flex flex-col cursor-pointer">
                                                    <img
                                                        className="rounded-t-lg w-full h-40 object-cover"
                                                        src={`http://localhost:8080/api/food/image/${item.foodImageURL}`}
                                                        alt={item.foodName}
                                                    />
                                                    <div className="px-5 pt-2 pb-3">
                                                        <h3 className="text-center capitalize font-bold text-base dark:text-white">{item.foodName}</h3>
                                                        <p className="text-sm text-center dark:text-white">S/. {item.foodPrice.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-full md:w-2/5">
                            <div className="p-6 rounded-lg border bg-white mb-3 shadow-md dark:bg-gray-600 dark:border-none">
                                <div>
                                    <h4 className="font-bold">Detalles del cliente</h4>
                                    <hr className="my-2" />
                                </div>
                                <div className="rounded pt-1">
                                    <div className="w-full flex flex-col mb-2">
                                        <div className="w-full flex justify-between">
                                            <div className="w-1/2 mb-6 md:mb-0 mr-1">
                                                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                                                    Nombre
                                                </label>
                                                <input
                                                    className="appearance-none block w-full 
             bg-gray-200 text-gray-500 cursor-not-allowed
             border border-gray-300 rounded py-2 px-4 mb-3
             focus:outline-none focus:ring-0
             dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                                    type="text"
                                                    value={customerData.cusName || ''}
                                                    readOnly
                                                />

                                            </div>
                                            <div className="w-1/2 mb-6 md:mb-0 ml-1">
                                                <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                                                    Móvil
                                                </label>
                                                <input
                                                    className="appearance-none block w-full 
             bg-gray-200 text-gray-500 cursor-not-allowed 
             border border-gray-300 rounded py-2 px-4 mb-3 
             focus:outline-none focus:ring-0 
             dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                                    type="text"
                                                    value={customerData.cusMobile || ''}
                                                    readOnly
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex items-center justify-between w-full overflow-hidden'>
                                        <button onClick={OpenSearchCustomerModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600 mx-1">
                                            <i className="ri-user-search-fill"></i>
                                            <span className="ml-1">Buscar</span>
                                        </button>
                                        <button onClick={openCustomerAddModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 mx-1">
                                            <i className="ri-user-add-fill"></i>
                                            <span className="ml-1">Agregar</span>
                                        </button>
                                        {customerData.cusName && (
                                            <>
                                                <button onClick={OpenCustomerUpdateModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 mx-1">
                                                    <i className="ri-edit-fill"></i>
                                                    <span className="ml-1">Actualizar</span>
                                                </button>
                                                <button onClick={handleClearFields} className="flex-grow flex items-center justify-center px-3 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mx-1">
                                                    <i className="ri-close-large-line"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md dark:bg-gray-600 dark:border-none min-h-[calc(100vh-22rem)]">
                                <div className="overflow-auto max-h-[calc(100vh-35rem)] px-4 py-4">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 text-sm font-semibold uppercase text-gray-400 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Nombre</th>
                                                <th className="px-4 py-3 text-center">Precio</th>
                                                <th className="px-4 py-3 text-center">Cantidad</th>
                                                <th className="px-4 py-3 text-right">Total</th>
                                                <th className="px-4 py-3 text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-base">
                                            {orderItems.length < 1 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-gray-400 py-6">No se encontraron artículos. Seleccione del menú.</td>
                                                </tr>
                                            ) : (
                                                orderItems.map(item => (
                                                    <tr key={item.foodId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-4 py-3 font-medium capitalize dark:text-gray-50">{item.foodName}</td>
                                                        <td className="px-4 py-3 text-center text-green-500">{item.foodPrice.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-center dark:text-gray-50">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-right text-green-500">{item.totalPrice.toFixed(2)}</td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex justify-center space-x-2">
                                                                <button
                                                                    className="text-xl text-amber-500 hover:text-amber-600"
                                                                    onClick={() => openQuantityUpdateModal(item)}
                                                                >
                                                                    <i className="ri-edit-fill"></i>
                                                                </button>
                                                                <button
                                                                    className="text-xl text-red-500 hover:text-red-600"
                                                                    onClick={() => removeFromOrder(item.foodId)}
                                                                >
                                                                    <i className="ri-delete-bin-2-line"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-6 py-3">
                                    <hr className="mt-2 mb-3" />
                                    <div className="flex justify-between mb-4">
                                        <p className="text-lg font-bold">Total</p>
                                        <p className="text-lg font-bold">S/. {totalAfterDiscount.toFixed(2)}</p>
                                    </div>
                                    <div className="w-full mb-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mesa:</label>
                                        <Select
                                            value={selectedTableOption}
                                            onChange={handleTableNumberChange}
                                            options={tableOptions}
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isSearchable={true}
                                            placeholder="Seleccionar mesa..."
                                            noOptionsMessage={() => "No hay mesas disponibles"}
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    minHeight: '42px',
                                                    height: '42px',
                                                    borderRadius: '6px',
                                                    borderColor: '#d1d5db',
                                                    '&:hover': {
                                                        borderColor: '#9ca3af'
                                                    }
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor: state.isSelected ? '#4ade80' : state.isFocused ? '#f3f4f6' : 'white',
                                                    color: state.isSelected ? 'white' : '#1f2937',
                                                    '&:hover': {
                                                        backgroundColor: state.isSelected ? '#4ade80' : '#f3f4f6'
                                                    }
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: '#1f2937'
                                                })
                                            }}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: '#4ade80',
                                                    primary25: '#f0fdf4',
                                                    primary50: '#dcfce7',
                                                    primary75: '#bbf7d0'
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="w-full mb-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Nota:
                                        </label>
                                        <textarea
                                            rows={2}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Escribe una nota aquí..."
                                            value={note}
                                            onChange={handleNoteChange}
                                        />
                                    </div>
                                    <button
                                        onClick={generateOrder}
                                        disabled={isSubmitting}
                                        className={`w-full rounded-md py-2 font-medium text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </span>
                                        ) : (
                                            <>
                                                <i className="ri-restaurant-2-fill"></i> Realizar pedido
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CustomerAddModal
                isOpen={customerAddModal}
                onToggle={openCustomerAddModal}
                customerAddModalResponse={handleCustomerModalResponse}
            />

            <SearchCustomerModal
                isOpen={customerSearchModal}
                onToggle={OpenSearchCustomerModal}
                searchModalResponse={handleCustomerModalResponse}
            />

            <UpdateCustomerModal
                isOpen={customerUpdateModal}
                onToggle={OpenCustomerUpdateModal}
                customerUpdateModalResponse={handleCustomerModalResponse}
                currentCustomerData={customerData}
            />

            <QuantityInputModal
                isOpen={quantityModalOpen}
                onToggle={OpenQuantityModal}
                onAddToBill={handleAddToBill}
                itemData={selectedFoodItem}
            />

            <QuantityUpdateModal
                isOpen={quantityUpdateModalOpen}
                onToggle={closeQuantityUpdateModal}
                editQuantity={updateQuantity}
                itemData={billItemData}
            />
        </div>
    )
}