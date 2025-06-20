import  { useState,useEffect, } from "react";
import {  useSelector } from 'react-redux'
import CustomerAddModal from "../customer/CustomerAddModal";
import SearchCustomerModal from "../customer/SearchCustomerModal";
import UpdateCustomerModal from "../customer/UpdateCustomerModal";
import axios from 'axios';
import QuantityInputModal from "../FoodItems/QuantityInputModal";
import QuantityUpdateModal from "../FoodItems/QuantityUpdateModal";
import toast from 'react-hot-toast';




export default function UpdateOrder() {
        const [responseErrors, setResponseErrors] = useState('');
        const [OrderResponse, setOrderResponse] = useState({});
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
        const [orderItemsConvertedResponse, setOrderItemsConvertedResponse] = useState([]);
        const [billItemData, setBillItemData] = useState({});
        const [tableList, setTableList] = useState([]);
        const [tableNumber, setTableNumber] = useState(0);
        const [tableNumberStatic, setTableNumberStatic] = useState(0);
        const [note, setNote] = useState('');

        const [subtotal, setSubtotal] = useState(0);
        const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
        const [discountPercentage, setDiscountPercentage] = useState(0);

        useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderIDFromUrl = urlParams.get('order');
            getAvailableTables();

            axios.get(`http://localhost:8080/api/orders/${orderIDFromUrl}`)
                .then(response => {
                    if (response.status === 200){
                        setOrderResponse(response.data);
                        const { orderItems, tableNumber, specialNote, subTotal, discountPercentage, totalAfterDiscount, customer } = response.data;
                        const convertedOrderItems = orderItems.map(item => ({
                            orderItemId: item.orderItemId,
                            foodId: item.foodItemId,
                            foodName:item.foodItemName, 
                            foodPrice:item.foodPrice,
                            quantity: item.quantity,
                            totalPrice: item.quantity * item.foodPrice,
                        }));
                        setOrderItems(convertedOrderItems);
                        setOrderItemsConvertedResponse(convertedOrderItems);
                        setTableNumber(tableNumber);
                        setTableNumberStatic(tableNumber);
                        setNote(specialNote);
                        setSubtotal(subTotal);
                        setDiscountPercentage(discountPercentage);
                        setTotalAfterDiscount(totalAfterDiscount);
                        if(customer){
                            setCustomerData(customer);     //details tika set wenawa
                        }
                    }else {
                        window.location.href = "/waiter?tab=manage-orders&error=order-not-found";
                    }
                })
                .catch(error => {
                    window.location.href = "/waiter?tab=manage-orders&error=order-not-found";
                    console.error("Error al obtener los detalles del pedido:", error);
                });
    
            axios.get("http://localhost:8080/api/food/all")
                .then(response => {
                    setFoodItems(response.data);
                })
                .catch(error => {
                    console.error("Error al obtener alimentos:", error);
                });
        }, []);

        useEffect(() => {
            // Calculate subtotal by summing total prices of all products
            const newSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
            setSubtotal(newSubtotal);
    
            // Calculate total after applying discount
            const discountAmount = (newSubtotal * discountPercentage) / 100;
            const newTotalAfterDiscount = newSubtotal - discountAmount;
            setTotalAfterDiscount(newTotalAfterDiscount);

        }, [orderItems, discountPercentage]);

        const openCustomerAddModal = () => {
            SetCustomerAddModal(prevState => !prevState);
        }

        const OpenSearchCustomerModal = () => {
            SetCustomerSearchModal(prevState => !prevState);
        }

        const OpenCustomerUpdateModal = () => {
            SetCustomerUpdateModal(prevState => !prevState);
        }

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

        const handleCustomerModalResponse = (Data) => {
            setCustomerData(Data); 
        };

        const handleClearFields = () => {
            setCustomerData({
                cusName: '',
                cusMobile: '',
                cusEmail: ''
            });
        };

        const handleTableNumberChange = (e) => {
            setTableNumber(parseInt(e.target.value));
        };

        const handleNoteChange = (event) => {
            setNote(event.target.value);
        };

        // Filter food items based on  category and search query
        const filteredFoodItems = foodItems.filter(item =>
            (activeCategory === "All" || item.foodCategory === activeCategory) &&
            item.foodName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        //Change active category
        const changeCategory = (category) => {
            setActiveCategory(category);
        };

        //Handle Search 
        const handleSearchQueryChange = (e) => {
            setSearchQuery(e.target.value);
        };

        const handleSelectedFoodItem = (itemData) => {
            setSelectedFoodItem(itemData);
        };

        const handleAddToBill = (quantity) => {
          
            if (selectedFoodItem.foodId) {
                const updatedOrderItems = [...orderItems];
                // Check if the item already exists
                const existingItemIndex = orderItems.findIndex(item => item.foodId === selectedFoodItem.foodId);
        
                if (existingItemIndex !== -1) {
                    //update its quantity and totalPrice
                    const newQuantity =  updatedOrderItems[existingItemIndex].quantity += quantity;
                    updatedOrderItems[existingItemIndex].totalPrice = selectedFoodItem.foodPrice * newQuantity;
                } else {
                    // Newly add it
                    const totalPrice = selectedFoodItem.foodPrice * quantity;
                    updatedOrderItems.push({ ...selectedFoodItem, quantity, totalPrice });
                }
        
                setOrderItems(updatedOrderItems);
                setSelectedFoodItem({});
            }
        };


        //Remove item from the order
        const removeFromOrder = (foodId) => {
            const updatedOrderItems = orderItems.filter(item => item.foodId !== foodId);
            setOrderItems(updatedOrderItems);
        };
        

        //Edit item quantity in the order
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
                return setResponseErrors("Se debe pedir al menos un artículo.");
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
        
            // Generate JSON object with order details
            const orderJSON = {
                orderId: OrderResponse.orderId,
                customerId: customerData.cusId || "",
                orderDateTime: OrderResponse.orderDateTime,
                orderStatus: OrderResponse.orderStatus,
                tableNumber: tableNumber,
                subTotal: subtotal,
                discountValue: 0.0,
                discountPercentage: 0.0,
                totalAfterDiscount: totalAfterDiscount,
                paymentMethod: "",
                paymentStatus: false,
                employeeId: currentUser.id,
                orderItems: convertedOrderItems
            };
        
            try {
                console.log(tableNumber +" || "+tableNumberStatic)
                // Check for table availability update
               // Update table availability if there’s a change or if a new table is selected
                if (tableNumber !== tableNumberStatic) {
                    if (tableNumberStatic > 0) {
                        // Free up the old table if it was previously assigned
                        await tableAvailabilityUpdate(true, tableNumberStatic);
                    }
                    if (tableNumber > 0) {
                        // Book the new table
                        await tableAvailabilityUpdate(false, tableNumber);
                    }
                }
        
                // Update the order
                const response = await axios.put(`http://localhost:8080/api/orders/${OrderResponse.orderId}`, orderJSON, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (response.status === 200) {
                    // Update table availability if tableNumber is 0
                    if (tableNumber === 0 && tableNumberStatic > 0) {

                        const tableResponse = await tableAvailabilityUpdate(true, tableNumberStatic);

                        if (tableResponse) {
                            toast.success('Pedido actualizado y mesa liberada exitosamente!');
                        } else {
                            toast.error("No se pudo actualizar la disponibilidad de la mesa. Contacte con el soporte del sistema..", { duration: 6000 });
                            console.error('No se pudo actualizar la disponibilidad de la mesa:', tableResponse);
                        }
                    }
                    else{
                        toast.success('Orden actualizada.');
                    }

                   
                    setCustomerData({});
                    handleClearFields();
                    setOrderItems([]);
                    setResponseErrors("");
                    setTableNumber(0);
                    window.location.href = "/waiter?tab=manage-orders";
                } else {
                    // Unexpected response
                    console.error('Estado de respuesta inesperado:', response);
                    toast.error(
                        "Hubo un error. \n Póngase en contacto con el soporte del sistema.",
                        { duration: 6000 }
                    );
                }
            } catch (error) {
                setResponseErrors(error);
                console.error("Error:", error);
            }
        };
        
          
        // Function to compare order items and find removed ones
        const findRemovedItemIds = (responseItems, itemList) => {
            const orderItems1 = responseItems || [];
            const orderItems2 = itemList || [];
        
            const removedIds = orderItems1
                .filter(item1 => !orderItems2.find(item2 => item1.orderItemId === item2.orderItemId))
                .map(item => item.orderItemId);
        
            // Return the array of removed item IDs
            return removedIds;
        };

        const deleteItems = async (removedIds) => {
            try {
                for (const itemId of removedIds) {
                    const response = await axios.delete(`http://localhost:8080/api/orders/items/${itemId}`);
                    if (response.status !== 204) {
                        console.error(`No se pudo eliminar el elemento con ID ${itemId}.`);
                        toast.error(
                            "Hubo un error. \n Póngase en contacto con el soporte del sistema.",
                            { duration: 6000 }
                        );
                        return false; 
                    }
                }
                return true; 
            } catch (error) {
                console.error('Error:', error);
                return false;
            }
        };

        const tableAvailabilityUpdate = async (status, tableNumber) => {
            const tableResponse = await axios.put(`http://localhost:8080/api/table/${tableNumber}/availability?availability=`+status);
            if (tableResponse.status == 200) {
                return true;
            }
            return false;
        }
        
        const getAvailableTables =  () => {
            
            axios.get("http://localhost:8080/api/table/available")
            .then(response => {
                setTableList(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las mesas disponibles:", error);
            });
        }
        
        
    

        

  return (
    <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">    
        <div className="w-full">
            <div className=" max-w-full  px-6">
                {responseErrors && (
                            <div
                                id="alert-2"
                                className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50  dark:bg-gray-800 dark:text-red-400 transition duration-300 ease-in-out"
                                role="alert"
                            >
                                <i className="ri-information-2-fill"></i>
                                <span className="sr-only">Error</span>
                                <div className="ms-3 text-sm font-medium">
                                    {responseErrors}
                                </div>
                                <button
                                    onClick={() => setResponseErrors("")}
                                    type="button"
                                    className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
                                    data-dismiss-target="#alert-2"
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
                            <h1 className="mb-2 text-left text-xl font-bold dark:text-white">Orden - <span className=" text-green-500 font-extrabold">#{OrderResponse.orderId}</span>  &nbsp; |  &nbsp; 
                                De {OrderResponse.employeeFirstName} {OrderResponse.employeeLastName}
                            </h1>
                            <div>
                                <div className="max-w-full mb-2">
                                        <div className="relative">
                                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none ">
                                                <i className="ri-search-line"></i>
                                            </div>
                                            <input
                                                type="search"
                                                id="default-search"
                                                className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg  border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                                placeholder="Search Food Items..."
                                                value={searchQuery}
                                                onChange={handleSearchQueryChange}
                                            />
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                type="button"
                                                className="text-white absolute right-2.5 bottom-2.5 bg-orange-500 hover:bg-orange-600 selection:border-none focus:outline-none font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-500 dark:hover:bg-orange-700"
                                            >
                                                Vaciar
                                            </button>
                                        </div>
                                </div>
                            </div>
                            {/* Category Tabs */}
                            <div className="mb-4 flex space-x-4 p-2 bg-white rounded-lg shadow-md dark:bg-gray-600">
                                <button onClick={() => changeCategory("All")} className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${activeCategory === "All" ? 'bg-green-400 text-white font-bol' : ''}`}>Todo</button>
                                <button onClick={() => changeCategory("Main Dish")} className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${activeCategory === "Main Dish" ? 'bg-green-400 text-white font-bol' : ''}`}>Plato Principal</button>
                                <button onClick={() => changeCategory("Side Dish")} className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${activeCategory === "Side Dish" ? 'bg-green-400 text-white font-bol' : ''}`}>Guarnición</button>
                                <button onClick={() => changeCategory("Beverages")} className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${activeCategory === "Beverages" ? 'bg-green-400 text-white font-bol' : ''}`}>Bebidas</button>
                            </div>

                            {/* Food Items */}
                            <div className='transition-all duration-20 p-2 max-h-[calc(100vh-17rem)] h-auto  rounded-lg block overflow-scroll'>
                            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                                {filteredFoodItems.length < 1 ? (
                                    <div className="col-span-full text-center my-4 text-gray-400">
                                        <p>No se encontraron artículos.</p>
                                    </div>
                                ) : (
                                    filteredFoodItems.map(item => (
                                        <div key={item.foodId} onClick={() => { OpenQuantityModal(); handleSelectedFoodItem(item); }} className="bg-white shadow-md rounded-lg text-gray-600 hover:bg-green-400 hover:text-white dark:bg-gray-600 dark:hover:bg-green-400 flex flex-col">
                                            <img
                                            className="rounded-t-lg w-full h-40 object-cover"
                                            src={`http://localhost:8080/api/food/image/${item.foodImageURL}`}
                                            alt={item.foodName}
                                            />
                                            <div className="px-5 pt-2 pb-3">
                                            <h3 className="text-center capitalize font-bold text-base tracking-tight dark:text-white">{item.foodName}</h3>
                                            <p className="text-sm text-center dark:text-white">S/. {item.foodPrice.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            </div>

                        </div>
                    </div>

                    {/* Side Bar*/}
                    
                    <div className="h-full  md:w-2/5">
                        <div className="p-6 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600 dark: border-none">
                            <div>
                                <h4 className="font-bold">Detalles del cliente</h4>
                                <hr className="my-2" />
                            </div>
                            <div className="rounded  pt-1">
                                <div className="w-full flex flex-col mb-2">
                                    <div className="w-full flex justify-between">
                                        <div className="w-1/2 mb-6 md:mb-0 mr-1">
                                            <label
                                                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                                htmlFor="grid-name"
                                            >
                                                Nombre
                                            </label>
                                            <input
                                                className="appearance-none block w-full bg-transparent text-grey-darker rounded py-2 px-4 mb-3 selection:border-none focus:outline-none  focus:border-black focus:ring-0 dark:border-grey-darker dark:focus:border-gray-500"
                                                id="grid-name"
                                                type="text"
                                                value={customerData.cusName}
                                                readOnly
                                            />
                                        </div>
                                        <div className="w-1/2 mb-6 md:mb-0 mx-auto ml-1">
                                            <label
                                                className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                                htmlFor="grid-mobile"
                                            >
                                                Móvil
                                            </label>
                                            <input
                                                className="appearance-none block w-full bg-transparent text-grey-darker border rounded py-2 px-4 mb-3 selection:border-none focus:outline-none  focus:border-black focus:ring-0 dark:border-grey-darker dark:focus:border-gray-500"
                                                id="grid-mobile"
                                                type="text"
                                                value={customerData.cusMobile}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    {/* <div className="w-full mb-6 md:mb-0">
                                        <label
                                            className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                            htmlFor="grid-email"
                                        >
                                            Email
                                        </label>
                                        <input
                                            className=" appearance-none block w-full bg-transparent text-grey-darker border rounded py-2 px-4 mb-3 selection:border-none focus:outline-none  focus:border-black focus:ring-0 dark:border-grey-darker dark:focus:border-gray-500"
                                            id="grid-email"
                                            type="email"
                                            value={customerData.cusEmail}
                                            readOnly
                                        />
                                    </div> */}
                                </div>
                            </div>
                            <div>
                            <div className='flex items-center justify-between w-full overflow-hidden'>
                                <button onClick={OpenSearchCustomerModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600 mx-1">
                                    <i className="ri-user-search-fill"></i>
                                    <span className="ml-1">Buscar</span>
                                </button>
                                <button onClick={openCustomerAddModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-green-500 mr-1 text-white font-semibold rounded hover:bg-green-600 mx-1">
                                    <i className="ri-user-add-fill"></i>
                                    <span className="ml-1">Agregar</span>
                                </button>
                                {customerData.cusName && (
                                    <>
                                        <button onClick={OpenCustomerUpdateModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 mx-1">
                                            <i className="ri-edit-fill"></i>
                                            <span className="ml-1">Actualizar</span>
                                        </button>
                                        <button onClick={() => handleClearFields()} className="flex-grow flex items-center justify-center px-3 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mx-1">
                                            <i className="ri-close-large-line"></i>
                                        </button>
                                    </>
                                )}
                            </div>

                            </div>
                        </div>


                        <div className=" py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-22rem)] h-auto">

                            <div className="overflow-x-auto overflow-scroll max-h-[calc(100vh-40rem)] h-auto px-2 py-2">
                                <table className="w-full table-auto">
                                    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-2 py-1">
                                                <div className="text-left font-semibold"> Nombre</div>
                                            </th>
                                            <th className="px-2 py-1">
                                                <div className="text-center font-semibold">Precio</div>
                                            </th>
                                            <th className="px-2 py-1">
                                                <div className="text-center font-semibold">Cantidad</div>
                                            </th>
                                            <th className="px-2 py-1">
                                                <div className="text-right font-semibold">Total S/.</div>
                                            </th>
                                            <th className="px-2 py-1">
                                                <div className="text-center font-semibold">Acción</div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {orderItems.length < 1 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center text-gray-400 py-4">No se encontraron artículos. Seleccione del menú.</td>
                                            </tr>
                                        ) : (
                                            orderItems.map(item => (
                                                <tr key={item.foodId}>
                                                    <td className="px-2 py-1">
                                                        <div className="font-medium capitalize text-gray-800 dark:text-gray-50">{item.foodName}</div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="text-center font-medium text-green-500">{item.foodPrice.toFixed(2)}</div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="text-center dark:text-gray-50">{item.quantity}</div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="text-right font-medium text-green-500">{item.totalPrice.toFixed(2)}</div>
                                                    </td>
                                                    <td className="px-2 py-1">
                                                        <div className="flex justify-center">
                                                            <button className="text-2xl text-amber-500"  onClick={() => openQuantityUpdateModal(item)}>
                                                                <i className="ri-edit-fill"></i>
                                                            </button>
                                                            <button className="text-2xl ml-1 text-red-500" onClick={() => removeFromOrder(item.foodId)}>
                                                                <i className="ri-delete-bin-2-line"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}{}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-6 py-3">
                                <hr className="mt-2 mb-3"/>
                                <div className="flex justify-between">
                                    <p className="text-lg font-bold">Total</p>
                                    <div>
                                        <p className="mb-1 text-lg font-bold">S/. {totalAfterDiscount.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="table"  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Seleccionar mesa :</label>
                                    <select
                                        id="table"
                                        value={tableNumber}
                                        onChange={handleTableNumberChange}
                                        className="block p-1 mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value={0}>No hay mesa asignada</option>
                                            {tableNumberStatic > 0 && (
                                                <option key={tableNumberStatic} value={tableNumberStatic}>Mesa {tableNumberStatic} (El actual)</option>
                                            )}                                        
                                        {tableList.map((data) => (
                                            <option key={data.id} value={data.tableNumber}>
                                                Mesa {data.tableNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full mt-1">
                                        <label
                                            htmlFor="note"
                                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                        >
                                            Nota :
                                        </label>
                                        <textarea
                                            id="note"
                                            rows={1}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            value={note}
                                            onChange={handleNoteChange}
                                        />
                                </div>
                                <button onClick={() => updateOrder()} className="mt-6 w-full rounded-md bg-amber-500  py-1.5 font-medium text-white hover:bg-amber-600">
                                    <i className="ri-restaurant-2-fill"></i> Orden de actualización
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>

        {/* Modals */}
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
