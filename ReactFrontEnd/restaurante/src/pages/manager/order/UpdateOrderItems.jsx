import { useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import QuantityUpdateModal from "../../waiter/FoodItems/QuantityUpdateModal";
import QuantityInputModal from "../../waiter/FoodItems/QuantityInputModal";

export default function UpdateOrderItems() {
    const [responseErrors, setResponseErrors] = useState('');
    const [OrderResponse, setOrderResponse] = useState({});

    const [quantityModalOpen, setQuantityModalOpen] = useState(false);
    const [quantityUpdateModalOpen, setQuantityUpdateModalOpen] = useState(false);
    const [foodItems, setFoodItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    
    const [selectedFoodItem, setSelectedFoodItem] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [orderItemsConvertedResponse, setOrderItemsConvertedResponse] = useState([]);
    const [billItemData, setBillItemData] = useState({});

    const [subtotal, setSubtotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIDFromUrl = urlParams.get('order');
        
        axios.get(`${import.meta.env.REACT_APP_API_URL}/api/orders/${orderIDFromUrl}`)
            .then(response => {
                if (response.status === 200){
                    setOrderResponse(response.data);
                    const { orderItems, subTotal, discountPercentage, totalAfterDiscount } = response.data;
                    const convertedOrderItems = orderItems.map(item => ({
                        orderItemId: item.orderItemId,
                        foodId: item.foodItemId,
                        foodName: item.foodItemName, 
                        foodPrice: item.foodPrice,
                        quantity: item.quantity,
                        totalPrice: item.quantity * item.foodPrice,
                    }));
                    setOrderItems(convertedOrderItems);
                    setOrderItemsConvertedResponse(convertedOrderItems);
                    setSubtotal(subTotal);
                    setDiscountPercentage(discountPercentage);
                    setTotalAfterDiscount(totalAfterDiscount);
                } else {
                    window.location.href = "/manager?tab=manage-orders&error=order-not-found";
                }
            })
            .catch(error => {
                window.location.href = "/manager?tab=manage-orders&error=order-not-found";
                console.error("Error al obtener los detalles del pedido:", error);
            });

        axios.get(`${import.meta.env.REACT_APP_API_URL}/api/food/all`)
            .then(response => {
                setFoodItems(response.data);
            })
            .catch(error => {
                console.error("Error al obtener alimentos:", error);
            });
    }, []);

    useEffect(() => {
        const newSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
        setSubtotal(newSubtotal);

        const discountAmount = (newSubtotal * discountPercentage) / 100;
        const newTotalAfterDiscount = newSubtotal - discountAmount;
        setTotalAfterDiscount(newTotalAfterDiscount);
    }, [orderItems, discountPercentage]);

    const OpenQuantityModal = () => {
        setQuantityModalOpen(prevState => !prevState);
    }

    const openQuantityUpdateModal = (item) => {
        setBillItemData(item);
        setQuantityUpdateModalOpen(true);
    };
    
    const closeQuantityUpdateModal = () => {
        setBillItemData({});
        setQuantityUpdateModalOpen(false);
    };

    const filteredFoodItems = foodItems.filter(item =>
        (activeCategory === "All" || item.foodCategory === activeCategory) &&
        item.foodName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const changeCategory = (category) => {
        setActiveCategory(category);
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectedFoodItem = (itemData) => {
        setSelectedFoodItem(itemData);
    };

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
            title: '¿Eliminar artículo?',
            text: "¿Estás seguro de que deseas eliminar este artículo de la orden?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedOrderItems = orderItems.filter(item => item.foodId !== foodId);
                setOrderItems(updatedOrderItems);
                toast.success('Artículo eliminado de la orden');
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
    
    const updateOrder = async () => {
        if (orderItems.length < 1) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe agregar al menos un artículo para actualizar la orden',
                confirmButtonColor: '#f59e0b',
            });
            return;
        }
    
        const removedIds = findRemovedItemIds(orderItemsConvertedResponse, orderItems);

        let deleteStatus = true;
        if (removedIds.length > 0) {
            deleteStatus = await deleteItems(removedIds);
        }
      
        if (!deleteStatus) {
            return;
        }

        const convertedOrderItems = orderItems.map(item => {
            const { foodId, ...rest } = item;
            return { foodItemId: foodId, ...rest };
        });
    
        const orderJSON = {
            orderId: OrderResponse.orderId,
            customerId: OrderResponse.customerId || "",
            orderDateTime: OrderResponse.orderDateTime,
            orderStatus: OrderResponse.orderStatus,
            tableNumber: OrderResponse.tableNumber,
            subTotal: subtotal,
            discountValue: OrderResponse.discountValue,
            discountPercentage: OrderResponse.discountPercentage,
            totalAfterDiscount: totalAfterDiscount,
            paymentMethod: OrderResponse.paymentMethod,
            paymentStatus: OrderResponse.paymentStatus,
            employeeId: OrderResponse.employeeId,
            orderItems: convertedOrderItems
        };
    
        try {
            const response = await axios.put(`${import.meta.env.REACT_APP_API_URL}/api/orders/${OrderResponse.orderId}`, orderJSON, {
                headers: { "Content-Type": "application/json" }
            });
            
            if (response.status === 200) {
                await Swal.fire({
                    icon: 'success',
                    title: '¡Orden actualizada!',
                    text: 'La orden se ha actualizado correctamente',
                    confirmButtonColor: '#10b981',
                    timer: 2000,
                    timerProgressBar: true
                });
                setOrderItems([]);
                setResponseErrors("");
                window.location.href = "/manager?tab=update-order&order=" + OrderResponse.orderId;
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar',
                text: 'Ocurrió un error al actualizar la orden',
                confirmButtonColor: '#f59e0b',
            });
        }
    };
      
    const findRemovedItemIds = (responseItems, itemList) => {
        const orderItems1 = responseItems || [];
        const orderItems2 = itemList || [];
    
        return orderItems1
            .filter(item1 => !orderItems2.find(item2 => item1.orderItemId === item2.orderItemId))
            .map(item => item.orderItemId);
    };

    const deleteItems = async (removedIds) => {
        try {
            for (const itemId of removedIds) {
                const response = await axios.delete(`${import.meta.env.REACT_APP_API_URL}/api/orders/items/${itemId}`);
                if (response.status !== 204) {
                    throw new Error(`No se pudo eliminar el elemento con ID ${itemId}`);
                }
            }
            return true;
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: 'Hubo un error al eliminar artículos. Contacte al soporte.',
                confirmButtonColor: '#f59e0b',
            });
            return false;
        }
    };

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">    
            <div className="w-full">
                <div className="max-w-full px-4 sm:px-6">
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
                            >
                                <span className="sr-only">Cerrar</span>
                                <i className="ri-close-large-fill"></i>
                            </button>
                        </div>
                    )}
                    
                    <div className="mx-auto justify-center flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
                        {/* Left Panel - Food Items */}
                        <div className="w-full lg:w-3/5">
                            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4">
                                <h1 className="mb-4 text-xl font-bold dark:text-white">
                                    Orden - <span className="text-green-500 font-extrabold">#{OrderResponse.orderId}</span>
                                    <span className="block sm:inline"> | Por {OrderResponse.employeeFirstName} {OrderResponse.employeeLastName}</span>
                                </h1>
                                
                                <div className="mb-4">
                                    <div className="relative">
                                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                            <i className="ri-search-line"></i>
                                        </div>
                                        <input
                                            type="search"
                                            id="default-search"
                                            className="block p-3 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            placeholder="Buscar..."
                                            value={searchQuery}
                                            onChange={handleSearchQueryChange}
                                        />
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            type="button"
                                            className="text-white absolute right-2.5 bottom-2.5 bg-orange-500 hover:bg-orange-600 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-orange-500 dark:hover:bg-orange-700"
                                        >
                                            Vaciar
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Category Tabs - Responsive */}
                                <div className="mb-4 flex overflow-x-auto pb-2 space-x-2 sm:space-x-4 p-2 bg-white rounded-lg shadow-md dark:bg-gray-600">
                                    {["All", "Main Dish", "Side Dish", "Beverages"].map(category => (
                                        <button 
                                            key={category}
                                            onClick={() => changeCategory(category)} 
                                            className={`flex-shrink-0 py-2 px-3 sm:px-4 rounded-md focus:outline-none transition-all duration-300 ${
                                                activeCategory === category ? 'bg-green-400 text-white font-bold' : 'bg-gray-200 dark:bg-gray-500'
                                            }`}
                                        >
                                            {category === "All" ? "Todo" : 
                                             category === "Main Dish" ? "Plato Principal" :
                                             category === "Side Dish" ? "Guarnición" : "Bebidas"}
                                        </button>
                                    ))}
                                </div>

                                {/* Food Items Grid - Responsive */}
                                <div className="p-2 max-h-[calc(100vh-17rem)] h-auto rounded-lg overflow-auto">
                                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {filteredFoodItems.length < 1 ? (
                                            <div className="col-span-full text-center my-4 text-gray-400">
                                                <p>No se encontraron artículos.</p>
                                            </div>
                                        ) : (
                                            filteredFoodItems.map(item => (
                                                <div 
                                                    key={item.foodId} 
                                                    onClick={() => { OpenQuantityModal(); handleSelectedFoodItem(item); }} 
                                                    className="bg-white shadow-md rounded-lg text-gray-600 hover:bg-green-400 hover:text-white dark:bg-gray-600 dark:hover:bg-green-400 flex flex-col cursor-pointer transition duration-200"
                                                >
                                                    <img
                                                        className="rounded-t-lg w-full h-32 sm:h-40 object-cover"
                                                        src={`${import.meta.env.REACT_APP_API_URL}/api/food/image/${item.foodImageURL}`}
                                                        alt={item.foodName}
                                                        onError={(e) => {
                                                            e.target.onerror = null; 
                                                            e.target.src = "https://via.placeholder.com/300x200?text=Imagen+no+disponible";
                                                        }}
                                                    />
                                                    <div className="p-3">
                                                        <h3 className="text-center capitalize font-bold text-sm sm:text-base tracking-tight dark:text-white line-clamp-1">
                                                            {item.foodName}
                                                        </h3>
                                                        <p className="text-center text-sm dark:text-white mt-1">
                                                            S/. {item.foodPrice.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Panel - Order Summary */}
                        <div className="w-full lg:w-2/5">
                            <div className="bg-white dark:bg-gray-700 rounded-lg border shadow-md p-4 flex flex-col h-full">
                                <div className="overflow-auto flex-grow max-h-[calc(100vh-18rem)]">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 dark:bg-gray-600 text-xs font-semibold uppercase text-gray-400">
                                            <tr>
                                                <th className="px-2 py-2 text-left">Artículo</th>
                                                <th className="px-2 py-2 text-center">Precio</th>
                                                <th className="px-2 py-2 text-center">Cant</th>
                                                <th className="px-2 py-2 text-right">Total</th>
                                                <th className="px-2 py-2 text-center">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-600 text-sm">
                                            {orderItems.length < 1 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-gray-400 py-4">
                                                        No hay artículos. Seleccione del menú.
                                                    </td>
                                                </tr>
                                            ) : (
                                                orderItems.map(item => (
                                                    <tr key={item.foodId} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                                        <td className="px-2 py-2">
                                                            <div className="font-medium capitalize text-gray-800 dark:text-gray-50 line-clamp-1">
                                                                {item.foodName}
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2 text-center text-green-500">
                                                            {item.foodPrice.toFixed(2)}
                                                        </td>
                                                        <td className="px-2 py-2 text-center dark:text-gray-50">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-2 py-2 text-right text-green-500 font-medium">
                                                            {item.totalPrice.toFixed(2)}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            <div className="flex justify-center space-x-2">
                                                                <button 
                                                                    onClick={() => openQuantityUpdateModal(item)}
                                                                    className="text-amber-500 hover:text-amber-600 transition"
                                                                    aria-label="Editar cantidad"
                                                                >
                                                                    <i className="ri-edit-fill text-xl"></i>
                                                                </button>
                                                                <button 
                                                                    onClick={() => removeFromOrder(item.foodId)}
                                                                    className="text-red-500 hover:text-red-600 transition"
                                                                    aria-label="Eliminar artículo"
                                                                >
                                                                    <i className="ri-delete-bin-2-line text-xl"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-bold">Total:</span>
                                        <span className="text-lg font-bold text-green-500">
                                            S/. {totalAfterDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <button 
                                        onClick={updateOrder}
                                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition duration-200 flex items-center justify-center"
                                    >
                                        <i className="ri-restaurant-2-fill mr-2"></i>
                                        Actualizar orden
                                    </button>
                                    
                                    <a 
                                        href={`/manager?tab=update-order&order=${OrderResponse.orderId}`} 
                                        className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200 flex items-center justify-center"
                                    >
                                        <i className="ri-arrow-left-s-line mr-2"></i>
                                        Regresar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
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
    );
}