// import { useState, useEffect, } from "react";
// import { useSelector } from 'react-redux'
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import SearchCustomerModal from "../../waiter/customer/SearchCustomerModal";
// import CustomerAddModal from "../../waiter/customer/CustomerAddModal";
// import UpdateCustomerModal from "../../waiter/customer/UpdateCustomerModal";


// export default function UpdateOrder() {
//     const [responseErrors, setResponseErrors] = useState('');
//     const [OrderResponse, setOrderResponse] = useState({});
//     const { currentUser } = useSelector((state) => state.user);
//     const [customerData, setCustomerData] = useState({});
//     const [orderItems, setOrderItems] = useState([]);
//     const [tableNumber, setTableNumber] = useState(0);
//     const [note, setNote] = useState('');
//     const [orderStatus, setOrderStatus] = useState('');
//     const [subtotal, setSubtotal] = useState(0);
//     const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
//     const [discountPercentage, setDiscountPercentage] = useState(0);

//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [cashAmount, setCashAmount] = useState(0);

//     const [customerAddModal, SetCustomerAddModal] = useState(false);
//     const [customerSearchModal, SetCustomerSearchModal] = useState(false);
//     const [customerUpdateModal, SetCustomerUpdateModal] = useState(false);

//     useEffect(() => {
//         const urlParams = new URLSearchParams(window.location.search);
//         const orderIDFromUrl = urlParams.get('order');

//         axios.get(`http://localhost:8080/api/orders/${orderIDFromUrl}`)
//             .then(response => {
//                 if (response.status === 200) {
//                     setOrderResponse(response.data);
//                     const { orderItems, tableNumber, specialNote, subTotal, discountPercentage, totalAfterDiscount, paymentMethod, orderStatus, customer } = response.data;
//                     const convertedOrderItems = orderItems.map(item => ({
//                         orderItemId: item.orderItemId,
//                         foodId: item.foodItemId,
//                         foodName: item.foodItemName,
//                         foodPrice: item.foodPrice,
//                         quantity: item.quantity,
//                         totalPrice: item.quantity * item.foodPrice,
//                     }));
//                     setOrderItems(convertedOrderItems);
//                     setTableNumber(tableNumber);
//                     setNote(specialNote);
//                     setSubtotal(subTotal);
//                     setDiscountPercentage(discountPercentage);
//                     setTotalAfterDiscount(totalAfterDiscount);
//                     setCashAmount(totalAfterDiscount);
//                     setPaymentMethod(paymentMethod);
//                     setOrderStatus(orderStatus);
//                     if (customer) {
//                         setCustomerData(customer);
//                         setDiscountPercentage(5);
//                     }
//                 } else {
//                     window.location.href = "/manager?tab=manage-orders&error=order-not-found";
//                 }
//             })
//             .catch(error => {
//                 window.location.href = "/manager?tab=manage-orders&error=order-not-found";
//                 console.error("Error al obtener los detalles del pedido:", error);
//             });

//     }, []);

//     useEffect(() => {
//         // Calculate subtotal by summing total prices of all products
//         const newSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
//         setSubtotal(newSubtotal);

//         // Calculate total after applying discount
//         const discountAmount = (newSubtotal * discountPercentage) / 100;
//         const newTotalAfterDiscount = newSubtotal - discountAmount;
//         setTotalAfterDiscount(newTotalAfterDiscount);

//     }, [orderItems, discountPercentage]);

//     const handleClearFields = () => {
//         setCustomerData({
//             cusName: '',
//             cusMobile: '',
//             cusEmail: ''
//         });
//     };



//     const updateOrder = async () => {
//         if (orderItems.length < 1) {
//             return setResponseErrors("Se debe pedir al menos un artículo.");
//         }
//         if (paymentMethod === '' && orderStatus == "Completed") {
//             return setResponseErrors("Por favor seleccione un método de pago.");
//         }
//         if (paymentMethod === 'cash' && (isNaN(parseFloat(cashAmount)) || parseFloat(cashAmount) < totalAfterDiscount)) {
//             return setResponseErrors("El monto en efectivo debe ser un número válido e igual o mayor que el monto total.");
//         }

//         const convertedOrderItems = orderItems.map(item => {
//             const { foodId, ...rest } = item;
//             return { foodItemId: foodId, ...rest };
//         });

//         // Generate JSON object with order details
//         const orderJSON = {
//             orderId: OrderResponse.orderId,
//             customerId: customerData.cusId || "",
//             orderDateTime: OrderResponse.orderDateTime,
//             orderStatus: orderStatus,
//             tableNumber: tableNumber,
//             subTotal: subtotal,
//             discountValue: subtotal * (discountPercentage / 100),
//             discountPercentage: discountPercentage,
//             totalAfterDiscount: totalAfterDiscount,
//             paymentMethod: paymentMethod,
//             paymentStatus: paymentMethod ? true : false,
//             employeeId: currentUser.id,
//             orderItems: convertedOrderItems,
//             specialNote: note
//         };
//         console.log(orderItems);

//         axios.put(`http://localhost:8080/api/orders/${OrderResponse.orderId}`, orderJSON, {
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     // Successful
//                     toast.success('Orden Completada.');
//                     setCustomerData({});
//                     handleClearFields();
//                     setOrderItems([]);
//                     setResponseErrors("");
//                     setTableNumber(0);
//                     window.location.href = "/manager?tab=manage-orders";
//                 } else {
//                     // Unexpected response
//                     console.error('Estado de respuesta inesperado:', response);
//                     toast.error(
//                         "Hubo un error. \n Por favor, contacte con el soporte del sistema.",
//                         { duration: 6000 }
//                     );
//                 }
//             })
//             .catch(error => {
//                 setResponseErrors(error);
//                 console.error("Error:", error);
//             });
//     };


//     const OpenSearchCustomerModal = () => {
//         SetCustomerSearchModal(prevState => !prevState);
//     }

//     const handleCustomerModalResponse = (Data) => {
//         setCustomerData(Data);
//     };

//     const openCustomerAddModal = () => {
//         SetCustomerAddModal(prevState => !prevState);
//     }

//     const OpenCustomerUpdateModal = () => {
//         SetCustomerUpdateModal(prevState => !prevState);
//     }

//     const handleOrderStatusChange = (newStatus) => {
//         setOrderStatus(newStatus);
//     };

//     const handleTableNumberChange = (newTableNumber) => {
//         setTableNumber(newTableNumber);
//     };

//     const handleNoteChange = (newNote) => {
//         setNote(newNote);
//     };

//     const convertDate = (dateString) => {
//         const date = new Date(dateString);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const hours = date.getHours() % 12 || 12; // Convert 0 to 12
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const period = date.getHours() < 12 ? 'AM' : 'PM';
//         return `${year}-${month}-${day} ${hours}.${minutes} ${period}`;
//     };





//     return (
//         <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">
//             <div className="w-full">
//                 <div className=" max-w-full  px-6">
//                     {responseErrors && (
//                         <div
//                             id="alert-2"
//                             className="flex items-center p-4 mb-4 text-red-800 rounded-lg bg-red-50  dark:bg-gray-800 dark:text-red-400 transition duration-300 ease-in-out"
//                             role="alert"
//                         >
//                             <i className="ri-information-2-fill"></i>
//                             <span className="sr-only">Error</span>
//                             <div className="ms-3 text-sm font-medium">
//                                 {responseErrors}
//                             </div>
//                             <button
//                                 onClick={() => setResponseErrors("")}
//                                 type="button"
//                                 className="ms-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
//                                 data-dismiss-target="#alert-2"
//                                 aria-label="Close"
//                             >
//                                 <span className="sr-only">Cerrar</span>
//                                 <i className="ri-close-large-fill"></i>
//                             </button>
//                         </div>

//                     )}
//                     <div className="mx-auto justify-center md:flex md:space-x-6 xl:px-0">

//                         {/* Side Bar*/}
//                         <div className="h-full  w-full">
//                             <div className="flex justify-between">
//                                 <div className={`p-6 mr-1 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600  ${customerData && Object.keys(customerData).length > 0 ? 'w-1/2' : 'w-full'}`}>
//                                     <div>
//                                         <h4 className="font-bold">Detalles de la Orden</h4>
//                                         <hr className="my-1" />
//                                         <br />
//                                         <div className={`overflow-x-auto m-0  ${customerData && Object.keys(customerData).length > 0 ? 'w-full' : 'w-1/2'}`}>
//                                             <table className="table-auto w-full">
//                                                 <tbody className="text-sm">
//                                                     <tr>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
//                                                                 <span><i className="ri-bill-line"></i></span> &nbsp;
//                                                                 <div className="text-right">Factura # :</div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="text-left">#{OrderResponse.orderId}</div>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
//                                                                 <span><i className="ri-account-pin-circle-fill"></i></span> &nbsp;
//                                                                 <div className="text-right">Por :</div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="text-left">{OrderResponse.employeeFirstName} {OrderResponse.employeeLastName}</div>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
//                                                                 <span><i className="ri-calendar-schedule-line "></i></span> &nbsp;
//                                                                 <div className="text-right">Fecha y hora :</div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="text-left">{convertDate(OrderResponse.orderDateTime)}</div>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
//                                                                 <span><i className="ri-store-3-line"></i></span> &nbsp;
//                                                                 <div className="text-right">Estado de la orden :</div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="text-left">
//                                                                 <select
//                                                                     className={`inline-flex mr-auto items-center font-semibold text-xs text-black p-1 mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${OrderResponse.orderStatus === "Pending" ? "bg-yellow-300" :
//                                                                         OrderResponse.orderStatus === "Processing" ? "bg-blue-300" :
//                                                                             OrderResponse.orderStatus === "Ready" ? "bg-green-300" :
//                                                                                 OrderResponse.orderStatus === "Completed" ? "bg-green-500 text-white" :
//                                                                                     OrderResponse.orderStatus === "Canceled" ? "bg-red-500" :
//                                                                                         ""
//                                                                         }`}
//                                                                     value={orderStatus}
//                                                                     onChange={(e) => handleOrderStatusChange(e.target.value)}
//                                                                 >
//                                                                     <option value="Pending" className="bg-yellow-300 text-black">Pendiente</option>
//                                                                     <option value="Processing" className="bg-blue-300 text-black">En preparación</option>
//                                                                     <option value="Ready" className="bg-green-300 text-black">Listo</option>
//                                                                     <option value="Completed" className="bg-green-500 text-white">Completado</option>
//                                                                     <option value="Canceled" className="bg-red-500 text-black">Cancelado</option>
//                                                                 </select>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="flex items-center font-bold">
//                                                                 <span><i className="ri-restaurant-line text-gray-800 dark:text-gray-50"></i></span> &nbsp;
//                                                                 <div className="text-right">Mesa # :</div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="text-left">

//                                                                 <select
//                                                                     id="table"
//                                                                     value={tableNumber}
//                                                                     onChange={(e) => handleTableNumberChange(e.target.value)}
//                                                                     className="inline-flex mr-auto items-center font-semibold text-xs text-black p-1 mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-0 focus:border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                                                                 >
//                                                                     <option value={0}>No hay mesa asignada</option>
//                                                                     {[...Array(10).keys()].map((num) => (
//                                                                         <option key={num + 1} value={num + 1}>
//                                                                             Mesa {num + 1}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>

//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                     <tr>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="flex items-center font-bold">
//                                                                 <span><i className="ri-sticky-note-add-fill text-gray-800 dark:text-gray-50"></i></span> &nbsp;
//                                                                 <div className="text-right">Nota :</div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="p-1 whitespace-nowrap">
//                                                             <div className="text-left">
//                                                                 <textarea
//                                                                     id="note"
//                                                                     rows={1}
//                                                                     className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                                                                     placeholder={note ? note : "Escribe una nota..."}
//                                                                     value={note}
//                                                                     onChange={(e) => handleNoteChange(e.target.value)}
//                                                                 />
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="w-1/2 ml-1 p-6 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600 dark: border-none">
//                                     <div>
//                                         <h4 className="font-bold">Detalles del cliente</h4>
//                                         <hr className="my-2" />
//                                     </div>
//                                     <div className="rounded  pt-1">
//                                         <div className="w-full flex flex-col mb-2">
//                                             <div className="w-full flex justify-between">
//                                                 <div className="w-1/2 mb-6 md:mb-0 mr-1">
//                                                     <label
//                                                         className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
//                                                         htmlFor="grid-name"
//                                                     >
//                                                         Nombre
//                                                     </label>
//                                                     <input
//                                                         className="appearance-none block w-full 
//              bg-gray-200 text-gray-500 cursor-not-allowed 
//              rounded py-2 px-4 mb-3 
//              border border-gray-300 
//              focus:outline-none focus:ring-0 
//              dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
//                                                         id="grid-name"
//                                                         type="text"
//                                                         value={customerData.cusName}
//                                                         readOnly
//                                                     />
//                                                 </div>
//                                                 <div className="w-1/2 mb-6 md:mb-0 mx-auto ml-1">
//                                                     <label
//                                                         className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
//                                                         htmlFor="grid-mobile"
//                                                     >
//                                                         Móvil
//                                                     </label>
//                                                     <input
//                                                         className="appearance-none block w-full 
//              bg-gray-200 text-gray-500 cursor-not-allowed 
//              border border-gray-300 rounded 
//              py-2 px-4 mb-3 
//              focus:outline-none focus:ring-0 
//              dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
//                                                         id="grid-mobile"
//                                                         type="text"
//                                                         value={customerData.cusMobile}
//                                                         readOnly
//                                                     />

//                                                 </div>
//                                             </div>
//                                             <div className="w-full mb-6 md:mb-0">
//                                                 <label
//                                                     className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
//                                                     htmlFor="grid-email"
//                                                 >
//                                                     Correo electrónico
//                                                 </label>
//                                                 <input
//                                                     className="appearance-none block w-full 
//              bg-gray-200 text-gray-500 cursor-not-allowed 
//              border border-gray-300 rounded 
//              py-2 px-4 mb-3 
//              focus:outline-none focus:ring-0 
//              dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
//                                                     id="grid-email"
//                                                     type="email"
//                                                     value={customerData.cusEmail}
//                                                     readOnly
//                                                 />

//                                             </div>
//                                         </div>
//                                         <div className='flex items-center justify-between w-full overflow-hidden'>
//                                             <button onClick={OpenSearchCustomerModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600 mx-1">
//                                                 <i className="ri-user-search-fill"></i>
//                                                 <span className="ml-1">Buscar</span>
//                                             </button>
//                                             <button onClick={openCustomerAddModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-green-500 mr-1 text-white font-semibold rounded hover:bg-green-600 mx-1">
//                                                 <i className="ri-user-add-fill"></i>
//                                                 <span className="ml-1">Agregar</span>
//                                             </button>
//                                             {customerData.cusName && (
//                                                 <>
//                                                     <button onClick={OpenCustomerUpdateModal} className="flex-grow flex items-center justify-center px-3 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 mx-1">
//                                                         <i className="ri-edit-fill"></i>
//                                                         <span className="ml-1">Actualizar</span>
//                                                     </button>
//                                                     <button onClick={() => handleClearFields()} className="flex-grow flex items-center justify-center px-3 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mx-1">
//                                                         <i className="ri-close-large-line"></i>
//                                                         <span className="ml-1">Vaciar</span>
//                                                     </button>
//                                                 </>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex justify-between">
//                                 <div className=" w-1/2 mr-1 py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-28rem)] h-auto">
//                                     <div className="overflow-x-auto overflow-scroll max-h-[calc(100vh-24rem)] h-auto px-2 py-2">
//                                         <table className="w-full table-auto">
//                                             <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400 dark:bg-gray-700">
//                                                 <tr>
//                                                     <th className="px-2 py-1">
//                                                         <div className="text-left font-semibold"> #</div>
//                                                     </th>
//                                                     <th className="px-2 py-1">
//                                                         <div className="text-left font-semibold"> Nombre</div>
//                                                     </th>
//                                                     <th className="px-2 py-1">
//                                                         <div className="text-center font-semibold">Precio</div>
//                                                     </th>
//                                                     <th className="px-2 py-1">
//                                                         <div className="text-center font-semibold">Cantidad</div>
//                                                     </th>
//                                                     <th className="px-2 py-1">
//                                                         <div className="text-right font-semibold">Total S/.</div>
//                                                     </th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody className="divide-y divide-gray-100 text-sm">
//                                                 {orderItems.length < 1 ? (
//                                                     <tr>
//                                                         <td colSpan="5" className="text-center text-gray-400 py-4">No se encontraron artículos.</td>
//                                                     </tr>
//                                                 ) : (
//                                                     orderItems.map((item, index) => (
//                                                         <tr key={index + 1}>
//                                                             <td className="px-2 py-1">
//                                                                 <div className="font-medium capitalize text-gray-500 dark:text-gray-50">{index + 1}</div>
//                                                             </td>
//                                                             <td className="px-2 py-1">
//                                                                 <div className="font-medium capitalize text-gray-800 dark:text-gray-50">{item.foodName}</div>
//                                                             </td>
//                                                             <td className="px-2 py-1">
//                                                                 <div className="text-center font-medium text-green-500">{item.foodPrice.toFixed(2)}</div>
//                                                             </td>
//                                                             <td className="px-2 py-1">
//                                                                 <div className="text-center dark:text-gray-50">{item.quantity}</div>
//                                                             </td>
//                                                             <td className="px-2 py-1">
//                                                                 <div className="text-right font-medium text-green-500">{item.totalPrice.toFixed(2)}</div>
//                                                             </td>
//                                                         </tr>
//                                                     ))
//                                                 )}{ }
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>

//                                 <div className=" w-1/2 ml-1 py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-28rem)] h-auto">
//                                     <div className="px-6 py-3">
//                                         <hr className="mt-2 mb-3" />
//                                         <div className="flex justify-between">
//                                             <p className="text-md">Subtotal</p>
//                                             <div>
//                                                 <p className="mb-1 text-md">S/. {subtotal.toFixed(2)}</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <div className="flex items-center justify-evenly">
//                                                 <p className="text-md">Descuento &nbsp;</p>
//                                                 <select
//                                                     value={discountPercentage}
//                                                     onChange={(e) => setDiscountPercentage(e.target.value)}
//                                                     className="appearance-none block bg-transparent border border-gray-300 rounded  leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-transparent dark:border-gray-600 dark:text-white dark:focus:bg-gray-700 dark:focus:border-gray-500"
//                                                 >
//                                                     <option value="0">0%</option>
//                                                     <option value="5">5%</option>
//                                                     <option value="10">10%</option>
//                                                     <option value="15">15%</option>
//                                                     <option value="20">20%</option>
//                                                     <option value="25">25%</option>
//                                                 </select>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <p className="mb-1 text-md">S/. {(subtotal * (discountPercentage / 100)).toFixed(2)}</p>
//                                             </div>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <p className="text-md"></p>
//                                             <div>
//                                                 {customerData && Object.keys(customerData).length > 0 && discountPercentage === 5 && (
//                                                     <p className="top-full left-0 mt-1 text-xs text-gray-500">
//                                                         Descuento de miembro aplicado
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                         <hr className="mt-2 mb-3" />
//                                         <div className="flex justify-between">
//                                             <p className="text-lg font-bold">Total</p>
//                                             <div>
//                                                 <p className="mb-1 text-lg font-bold">S/. {totalAfterDiscount.toFixed(2)}</p>
//                                             </div>
//                                         </div>
//                                         <hr className="mt-2 mb-3" />
//                                         <div>
//                                             <div className="flex items-center justify-between">
//                                                 <p className="text-md font-bold">Método de pago</p>
//                                                 <select
//                                                     value={paymentMethod}
//                                                     onChange={(e) => setPaymentMethod(e.target.value)}
//                                                     className="w-1/2 appearance-none block bg-transparent border border-gray-300 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-transparent dark:border-gray-600 dark:text-white dark:focus:bg-gray-700 dark:focus:border-gray-500"
//                                                 >
//                                                     <option hidden value="">Elegir método de pago</option>
//                                                     <option value="cash">Efectivo</option>
//                                                     <option value="card">Tarjeta Visa / MasterCardr</option>
//                                                     <option value="Return">Devolución</option>
//                                                 </select>
//                                             </div>
//                                             {paymentMethod === 'cash' && (
//                                                 <div>
//                                                     <div className="flex items-center justify-between mt-1">
//                                                         <p className="text-md font-bold">Monto en efectivo</p>
//                                                         <input
//                                                             className="w-1/2 appearance-none block bg-transparent border border-gray-300 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-transparent dark:border-gray-600 dark:text-white dark:focus:bg-gray-700 dark:focus:border-gray-500"
//                                                             type="number"
//                                                             placeholder="Ingrese el monto en efectivo"
//                                                             value={cashAmount}
//                                                             onChange={(e) => setCashAmount(e.target.value)}
//                                                         />
//                                                     </div>
//                                                     <div className="flex items-center justify-between mt-1">
//                                                         <p className="text-md font-bold">Cantidad restante</p>
//                                                         <div>
//                                                             {isNaN(parseFloat(cashAmount)) ? (
//                                                                 <p className="mb-1 text-lg font-bold">S/. {cashAmount}</p>
//                                                             ) : (
//                                                                 <p className="mb-1 text-lg font-bold">S/.{(parseFloat(cashAmount) - totalAfterDiscount).toFixed(2)}</p>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             )}

//                                         </div>
//                                         <button onClick={() => updateOrder()} className="mt-6 w-full rounded-md bg-green-500  py-1.5 font-medium text-white hover:bg-green-600">
//                                             <i className="ri-save-fill"></i> Guardar pedido
//                                         </button>
//                                         <button onClick={() => { window.location.href = "manager?tab=update-order-items&order=" + OrderResponse.orderId }} className="mt-3 w-full rounded-md bg-amber-500  py-1.5 font-medium text-white hover:bg-amber-600">
//                                             <i className="ri-menu-add-fill"></i> Actualizar artículos del pedido
//                                         </button>
//                                         <button onClick={() => { window.location.href = "/manager?tab=manage-orders" }} className="mt-3 w-full rounded-md bg-blue-500  py-1.5 font-medium text-white hover:bg-blue-600">
//                                             <i className="ri-arrow-left-s-line"></i> Regresar
//                                         </button>

//                                     </div>

//                                 </div>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <SearchCustomerModal
//                 isOpen={customerSearchModal}
//                 onToggle={OpenSearchCustomerModal}
//                 searchModalResponse={handleCustomerModalResponse}
//             />

//             <CustomerAddModal
//                 isOpen={customerAddModal}
//                 onToggle={openCustomerAddModal}
//                 customerAddModalResponse={handleCustomerModalResponse}
//             />

//             <UpdateCustomerModal
//                 isOpen={customerUpdateModal}
//                 onToggle={OpenCustomerUpdateModal}
//                 customerUpdateModalResponse={handleCustomerModalResponse}
//                 currentCustomerData={customerData}
//             />

//         </div>
//     )
// }

import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import SearchCustomerModal from "../../waiter/customer/SearchCustomerModal";
import CustomerAddModal from "../../waiter/customer/CustomerAddModal";
import UpdateCustomerModal from "../../waiter/customer/UpdateCustomerModal";

export default function UpdateOrder() {
    const [responseErrors, setResponseErrors] = useState('');
    const [OrderResponse, setOrderResponse] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [customerAddModal, SetCustomerAddModal] = useState(false);
    const [customerSearchModal, SetCustomerSearchModal] = useState(false);
    const [customerUpdateModal, SetCustomerUpdateModal] = useState(false);
    const [customerData, setCustomerData] = useState({});

    const [orderItems, setOrderItems] = useState([]);
    const [tableList, setTableList] = useState([]);
    const [tableNumber, setTableNumber] = useState(0);
    const [tableNumberStatic, setTableNumberStatic] = useState(0);
    const [note, setNote] = useState('');
    const [orderStatus, setOrderStatus] = useState('');

    const [subtotal, setSubtotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        customer: false,
        table: false,
        payment: false,
        cash: false
    });

    // ==================== FUNCIONES DE ALERTAS ====================
    const showError = (message) => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#3085d6',
            customClass: { container: 'z-[9999]' }
        });
    };

    const showSuccess = (message) => {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: message,
            confirmButtonColor: '#3085d6',
            customClass: { container: 'z-[9999]' }
        });
    };

    const showConfirm = (message, callback) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar',
            customClass: { container: 'z-[9999]' }
        }).then((result) => {
            if (result.isConfirmed) callback();
        });
    };

    const showTableSelection = async () => {
        try {
            const { data: tables } = await axios.get("http://localhost:8080/api/table/available");

            // Incluir la mesa actual aunque no esté disponible
            const currentTable = tableList.find(table => table.tableNumber === tableNumberStatic);
            const availableTables = [...tables];
            if (currentTable && !tables.some(t => t.tableNumber === currentTable.tableNumber)) {
                availableTables.push(currentTable);
            }

            if (availableTables.length === 0) {
                showError('No hay mesas disponibles');
                return;
            }

            const { value: selectedTable } = await Swal.fire({
                title: 'Cambiar mesa',
                text: 'Seleccione una nueva mesa para transferir el pedido',
                input: 'select',
                inputOptions: availableTables.reduce((options, table) => {
                    options[table.tableNumber] = `Mesa ${table.tableNumber}${table.tableNumber === tableNumberStatic ? ' (Actual)' : table.tableAvailability ? ' (Disponible)' : ''}`;
                    return options;
                }, {}),
                inputPlaceholder: 'Seleccione una mesa',
                showCancelButton: true,
                confirmButtonText: 'Cambiar mesa',
                cancelButtonText: 'Cancelar',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Debe seleccionar una mesa';
                    }
                    if (parseInt(value) === tableNumberStatic) {
                        return 'Esta es la mesa actual del pedido';
                    }
                },
                customClass: { container: 'z-[9999]' }
            });

            if (selectedTable) {
                const newTableNumber = parseInt(selectedTable);
                setTableNumber(newTableNumber);
                setValidationErrors({ ...validationErrors, table: false });
                showSuccess(`Mesa cambiada a ${newTableNumber}`);
            }
        } catch (error) {
            console.error("Error al obtener mesas:", error);
            showError('Error al cargar las mesas disponibles');
        }
    };

    // ==================== EFECTOS ====================
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIDFromUrl = urlParams.get('order');
        fetchTables();

        axios.get(`http://localhost:8080/api/orders/${orderIDFromUrl}`)
            .then(response => {
                if (response.status === 200) {
                    setOrderResponse(response.data);
                    const { orderItems, tableNumber, specialNote, subTotal, discountPercentage, totalAfterDiscount, paymentMethod, orderStatus, customer } = response.data;

                    const convertedOrderItems = orderItems.map(item => ({
                        orderItemId: item.orderItemId,
                        foodId: item.foodItemId,
                        foodName: item.foodItemName,
                        foodPrice: item.foodPrice,
                        quantity: item.quantity,
                        totalPrice: item.quantity * item.foodPrice,
                    }));

                    setOrderItems(convertedOrderItems);
                    setTableNumber(tableNumber);
                    setTableNumberStatic(tableNumber);
                    setNote(specialNote);
                    setSubtotal(subTotal);
                    setDiscountPercentage(discountPercentage || 0);
                    setDiscountValue(subTotal * (discountPercentage / 100) || 0);
                    setTotalAfterDiscount(totalAfterDiscount);
                    setCashAmount(totalAfterDiscount.toFixed(1));
                    setPaymentMethod(paymentMethod);
                    setOrderStatus(orderStatus);

                    if (customer) {
                        setCustomerData(customer);
                        if (!discountPercentage) {
                            setDiscountPercentage(5);
                            setDiscountValue(subTotal * (5 / 100));
                        }
                    }
                } else {
                    window.location.href = "/manager?tab=manage-orders&error=order-not-found";
                }
            })
            .catch(error => {
                window.location.href = "/manager?tab=manage-orders&error=order-not-found";
                console.error("Error al obtener los detalles del pedido:", error);
            });
    }, []);

    useEffect(() => {
        const newSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
        setSubtotal(newSubtotal);

        const newDiscountValue = (newSubtotal * discountPercentage) / 100;
        setDiscountValue(newDiscountValue);

        const newTotalAfterDiscount = newSubtotal - newDiscountValue;
        setTotalAfterDiscount(newTotalAfterDiscount);

        if (paymentMethod === 'cash') {
            setCashAmount(newTotalAfterDiscount.toFixed(1));
        }
    }, [orderItems, discountPercentage]);

    // ==================== MANEJO DE DATOS ====================
    const fetchTables = () => {
        axios.get("http://localhost:8080/api/table/all")
            .then(response => {
                setTableList(response.data);
            })
            .catch(error => {
                console.error("Error al obtener las mesas:", error);
                showError('Error al cargar las mesas disponibles');
            });
    };

    const handleCustomerModalResponse = (Data) => {
        setCustomerData(Data);
        setValidationErrors({ ...validationErrors, customer: false });

        if (!customerData.cusId && Data.cusId) {
            setDiscountPercentage(5);
            setDiscountValue((subtotal * 5) / 100);
        }
    };

    const handleClearFields = () => {
        showConfirm('¿Desea eliminar el cliente asignado?', () => {
            setCustomerData({ cusName: '', cusMobile: '', cusEmail: '' });
            setDiscountPercentage(0);
            setDiscountValue(0);
            setValidationErrors({ ...validationErrors, customer: true });
        });
    };

    const handleOrderStatusChange = (newStatus) => {
        setOrderStatus(newStatus);
        if (newStatus === "Completed") {
            setValidationErrors({
                ...validationErrors,
                payment: paymentMethod === '',
                cash: paymentMethod === 'cash' && (isNaN(parseFloat(cashAmount)) || parseFloat(cashAmount) < totalAfterDiscount)
            });
        }
    };

    const handleTableNumberChange = (selectedOption) => {
        if (!selectedOption || selectedOption.value === tableNumberStatic) return;

        showConfirm(`¿Desea cambiar a la mesa ${selectedOption.value}?`, () => {
            setTableNumber(selectedOption.value);
            setValidationErrors({ ...validationErrors, table: false });
        });
    };

    const handleNoteChange = (event) => setNote(event.target.value);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        setValidationErrors({
            ...validationErrors,
            payment: method === '' && orderStatus === "Completed",
            cash: false
        });

        if (method === 'cash') {
            setCashAmount(totalAfterDiscount.toFixed(1));
        } else {
            setCashAmount('');
        }
    };

    const handleCashAmountChange = (e) => {
        const value = e.target.value;
        // Validar que sea un número con máximo un decimal
        if (/^\d*\.?\d{0,1}$/.test(value) || value === '') {
            setCashAmount(value);
            setValidationErrors({
                ...validationErrors,
                cash: value === '' || parseFloat(value) < parseFloat(totalAfterDiscount.toFixed(1))
            });
        }
    };
    // ==================== VALIDACIÓN Y ACTUALIZACIÓN ====================
    const validateOrder = () => {
        const errors = {
            customer: !customerData.cusId,
            table: tableNumber === 0,
            payment: paymentMethod === '' && orderStatus === "Completed",
            items: orderItems.length < 1,
            cash: paymentMethod === 'cash' && (
                cashAmount === '' ||
                parseFloat(cashAmount) < parseFloat(totalAfterDiscount.toFixed(1))
            )
        };

        setValidationErrors(errors);

        if (errors.items) {
            showError('Se debe pedir al menos un artículo');
            return false;
        }

        if (errors.customer) {
            showError('Debe seleccionar un cliente para actualizar el pedido');
            return false;
        }

        if (errors.table) {
            showError('Debe seleccionar una mesa para actualizar el pedido');
            return false;
        }

        if (errors.payment && orderStatus === "Completed") {
            showError("Por favor seleccione un método de pago.");
            return false;
        }

        if (errors.cash) {
            showError("El monto en efectivo debe ser igual o mayor que el monto total.");
            return false;
        }

        return true;
    };

    const updateOrder = async () => {
        if (!validateOrder()) return;

        // Validación adicional para método de pago si el estado es "Completed"
        if (orderStatus === "Completed" && !paymentMethod) {
            showError("Debe seleccionar un método de pago para completar el pedido");
            setValidationErrors({ ...validationErrors, payment: true });
            return;
        }

        showConfirm('¿Desea actualizar este pedido?', async () => {
            setIsSubmitting(true);

            try {
                const convertedOrderItems = orderItems.map(({ foodId, ...rest }) => ({
                    foodItemId: foodId,
                    ...rest
                }));

                const orderJSON = {
                    orderId: OrderResponse.orderId,
                    customerId: customerData.cusId,
                    orderDateTime: OrderResponse.orderDateTime,
                    orderStatus: orderStatus,
                    tableNumber: tableNumber,
                    subTotal: subtotal,
                    discountValue: discountValue,
                    discountPercentage: discountPercentage,
                    totalAfterDiscount: totalAfterDiscount,
                    paymentMethod: paymentMethod,
                    paymentStatus: paymentMethod ? true : false,
                    employeeId: currentUser.id,
                    orderItems: convertedOrderItems,
                    specialNote: note
                };

                // Actualizar estado de mesas si hay cambios
                if (tableNumber !== tableNumberStatic) {
                    if (tableNumberStatic > 0) {
                        await axios.put(
                            `http://localhost:8080/api/table/by-number/${tableNumberStatic}/availability`,
                            null,
                            { params: { availability: true } }
                        );
                    }
                    if (tableNumber > 0) {
                        await axios.put(
                            `http://localhost:8080/api/table/by-number/${tableNumber}/availability`,
                            null,
                            { params: { availability: false } }
                        );
                    }
                }

                const response = await axios.put(
                    `http://localhost:8080/api/orders/${OrderResponse.orderId}`,
                    orderJSON,
                    { headers: { "Content-Type": "application/json" } }
                );

                if (response.status === 200) {
                    showSuccess('Pedido actualizado exitosamente!');
                    window.location.href = "/manager?tab=manage-orders";
                }
            } catch (error) {
                console.error("Error:", error);
                showError("Error al actualizar el pedido. Por favor intente nuevamente.");
            } finally {
                setIsSubmitting(false);
            }
        });
    };

    // ==================== FUNCIONES UTILITARIAS ====================
    const convertDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours() % 12 || 12;
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
    };

    const tableOptions = tableList.map(table => ({
        value: table.tableNumber,
        label: `Mesa ${table.tableNumber}${table.tableNumber === tableNumberStatic ? ' (Actual)' : table.tableAvailability ? ' (Disponible)' : ''}`,
        isDisabled: !table.tableAvailability && table.tableNumber !== tableNumberStatic
    }));

    const selectedTableOption = tableOptions.find(option => option.value === tableNumber) ||
        (tableNumberStatic > 0 ? {
            value: tableNumberStatic,
            label: `Mesa ${tableNumberStatic} (Actual)`
        } : null);

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
                        {/* Panel izquierdo - Detalles de la orden y cliente */}
                        <div className="md:w-2/5">
                            <div className="p-6 rounded-lg border bg-white mb-3 shadow-md dark:bg-gray-600 dark:border-none">
                                <div>
                                    <h4 className="font-bold">Detalles de la Orden</h4>
                                    <hr className="my-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                        <i className="ri-bill-line mr-2"></i>
                                        <span>Factura #:</span>
                                    </div>
                                    <div className="text-left">#{OrderResponse.orderId}</div>

                                    <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                        <i className="ri-account-pin-circle-fill mr-2"></i>
                                        <span>Por:</span>
                                    </div>
                                    <div className="text-left">{OrderResponse.employeeFirstName} {OrderResponse.employeeLastName}</div>

                                    <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                        <i className="ri-calendar-schedule-line mr-2"></i>
                                        <span>Fecha y hora:</span>
                                    </div>
                                    <div className="text-left">{convertDate(OrderResponse.orderDateTime)}</div>

                                    <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                        <i className="ri-store-3-line mr-2"></i>
                                        <span>Estado:</span>
                                    </div>
                                    <div className="text-left">
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={{
                                                value: orderStatus,
                                                label: orderStatus === "Pending" ? "Pendiente" :
                                                    orderStatus === "Processing" ? "En preparación" :
                                                        orderStatus === "Ready" ? "Listo" :
                                                            orderStatus === "Completed" ? "Completado" : "Cancelado"
                                            }}
                                            onChange={(selectedOption) => handleOrderStatusChange(selectedOption.value)}
                                            options={[
                                                { value: "Pending", label: "Pendiente" },
                                                { value: "Processing", label: "En preparación" },
                                                { value: "Ready", label: "Listo" },
                                                { value: "Completed", label: "Completado" },
                                                { value: "Canceled", label: "Cancelado" }
                                            ]}
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    minHeight: '32px',
                                                    height: '32px',
                                                    borderRadius: '6px',
                                                    borderColor: validationErrors.payment ? '#f87171' : '#d1d5db',
                                                    backgroundColor: orderStatus === "Pending" ? '#fef08a' :
                                                        orderStatus === "Processing" ? '#bfdbfe' :
                                                            orderStatus === "Ready" ? '#bbf7d0' :
                                                                orderStatus === "Completed" ? '#86efac' : '#fca5a5',
                                                    color: orderStatus === "Completed" ? 'white' : '#1f2937',
                                                    '&:hover': {
                                                        borderColor: '#9ca3af'
                                                    }
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: orderStatus === "Completed" ? 'white' : '#1f2937'
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                        <i className="ri-restaurant-line mr-2"></i>
                                        <span>Mesa #:</span>
                                    </div>
                                    <div className="text-left">
                                        <div className="flex items-center">
                                            <Select
                                                value={selectedTableOption}
                                                onChange={handleTableNumberChange}
                                                options={tableOptions}
                                                className="basic-single flex-grow"
                                                classNamePrefix="select"
                                                isSearchable={true}
                                                placeholder="Seleccionar mesa..."
                                                noOptionsMessage={() => "No hay mesas disponibles"}
                                                styles={{
                                                    control: (provided, state) => ({
                                                        ...provided,
                                                        minHeight: '32px',
                                                        height: '32px',
                                                        borderRadius: '6px',
                                                        borderColor: validationErrors.table ? '#f87171' : '#d1d5db',
                                                        '&:hover': {
                                                            borderColor: '#9ca3af'
                                                        }
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        backgroundColor: state.isSelected ? '#4ade80' :
                                                            state.isDisabled ? '#f3f4f6' : 'white',
                                                        color: state.isSelected ? 'white' :
                                                            state.isDisabled ? '#9ca3af' : '#1f2937',
                                                        cursor: state.isDisabled ? 'not-allowed' : 'default',
                                                        '&:hover': {
                                                            backgroundColor: state.isSelected ? '#4ade80' :
                                                                state.isDisabled ? '#f3f4f6' : '#f3f4f6'
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
                                            <button
                                                onClick={showTableSelection}
                                                className="ml-2 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                title="Ver mesas disponibles"
                                            >
                                                <i className="ri-search-line"></i>
                                            </button>
                                        </div>
                                        {validationErrors.table && (
                                            <p className="mt-1 text-xs text-red-500">Se requiere una mesa</p>
                                        )}
                                    </div>

                                    <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                        <i className="ri-sticky-note-add-fill mr-2"></i>
                                        <span>Nota:</span>
                                    </div>
                                    <div className="text-left">
                                        <textarea
                                            rows={2}
                                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Escribe una nota aquí..."
                                            value={note}
                                            onChange={handleNoteChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`p-6 rounded-lg border bg-white mb-3 shadow-md dark:bg-gray-600 dark:border-none ${validationErrors.customer ? 'border-red-500' : ''}`}>
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
                                                    className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
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
                                                    className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                                    type="text"
                                                    value={customerData.cusMobile || ''}
                                                    readOnly
                                                />

                                            </div>
                                        </div>
                                        <div className="w-full mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                                                Correo electrónico
                                            </label>
                                            <input
                                                className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                                type="email"
                                                value={customerData.cusEmail || ''}
                                                readOnly
                                            />

                                        </div>
                                    </div>
                                    {validationErrors.customer && (
                                        <p className="text-xs text-red-500 mb-2">Se requiere un cliente</p>
                                    )}
                                </div>
                                <div>
                                    <div className='flex items-center justify-between w-full overflow-hidden'>
                                        <button
                                            onClick={() => SetCustomerSearchModal(true)}
                                            className="flex-grow flex items-center justify-center px-3 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600 mx-1"
                                        >
                                            <i className="ri-user-search-fill"></i>
                                            <span className="ml-1">Buscar</span>
                                        </button>
                                        <button
                                            onClick={() => SetCustomerAddModal(true)}
                                            className="flex-grow flex items-center justify-center px-3 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 mx-1"
                                        >
                                            <i className="ri-user-add-fill"></i>
                                            <span className="ml-1">Agregar</span>
                                        </button>
                                        {customerData.cusName && (
                                            <>
                                                <button
                                                    onClick={() => SetCustomerUpdateModal(true)}
                                                    className="flex-grow flex items-center justify-center px-3 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600 mx-1"
                                                >
                                                    <i className="ri-edit-fill"></i>
                                                    <span className="ml-1">Actualizar</span>
                                                </button>
                                                <button
                                                    onClick={handleClearFields}
                                                    className="flex-grow flex items-center justify-center px-3 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mx-1"
                                                >
                                                    <i className="ri-close-large-line"></i>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel derecho - Artículos del pedido y resumen */}
                        <div className="md:w-3/5">
                            <div className="py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md dark:bg-gray-600 dark:border-none">
                                <div className="overflow-auto max-h-[calc(100vh-35rem)] px-4 py-4">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 text-sm font-semibold uppercase text-gray-400 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 text-left">#</th>
                                                <th className="px-4 py-3 text-left">Nombre</th>
                                                <th className="px-4 py-3 text-center">Precio</th>
                                                <th className="px-4 py-3 text-center">Cantidad</th>
                                                <th className="px-4 py-3 text-right">Total S/.</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-base">
                                            {orderItems.length < 1 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-gray-400 py-6">No se encontraron artículos.</td>
                                                </tr>
                                            ) : (
                                                orderItems.map((item, index) => (
                                                    <tr key={item.foodId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                        <td className="px-4 py-3 text-left dark:text-gray-50">{index + 1}</td>
                                                        <td className="px-4 py-3 font-medium capitalize dark:text-gray-50">{item.foodName}</td>
                                                        <td className="px-4 py-3 text-center text-green-500">{item.foodPrice.toFixed(1)}</td>
                                                        <td className="px-4 py-3 text-center dark:text-gray-50">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-right text-green-500">{item.totalPrice.toFixed(1)}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-6 py-3">
                                    <hr className="mt-2 mb-3" />
                                    <div className="flex justify-between mb-2">
                                        <p className="text-md">Subtotal</p>
                                        <p className="text-md">S/. {subtotal.toFixed(1)}</p>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center">
                                            <p className="text-md">Descuento &nbsp;</p>
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                value={{
                                                    value: discountPercentage,
                                                    label: `${discountPercentage}%`
                                                }}
                                                onChange={(selectedOption) => {
                                                    setDiscountPercentage(selectedOption.value);
                                                    setDiscountValue((subtotal * selectedOption.value) / 100);
                                                }}
                                                options={[
                                                    { value: 0, label: "0%" },
                                                    { value: 5, label: "5%" },
                                                    { value: 10, label: "10%" },
                                                    { value: 15, label: "15%" },
                                                    { value: 20, label: "20%" },
                                                    { value: 25, label: "25%" }
                                                ]}
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        minHeight: '32px',
                                                        height: '32px',
                                                        width: '80px',
                                                        borderRadius: '6px',
                                                        borderColor: '#d1d5db',
                                                        '&:hover': {
                                                            borderColor: '#9ca3af'
                                                        }
                                                    })
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-md">S/. {discountValue.toFixed(1)}</p>
                                        </div>
                                    </div>
                                    {customerData.cusId && discountPercentage === 5 && (
                                        <div className="text-right text-xs text-gray-500 mb-2">
                                            Descuento de miembro aplicado
                                        </div>
                                    )}
                                    <hr className="mt-2 mb-3" />
                                    <div className="flex justify-between mb-4">
                                        <p className="text-lg font-bold">Total</p>
                                        <p className="text-lg font-bold">S/. {totalAfterDiscount.toFixed(1)}</p>
                                    </div>

                                    <div className="w-full mb-4">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Método de pago:</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            value={{
                                                value: paymentMethod,
                                                label: paymentMethod === "cash" ? "Efectivo" :
                                                    paymentMethod === "card" ? "Tarjeta Visa / MasterCard" :
                                                        paymentMethod === "return" ? "Devolución" : "Seleccionar método"
                                            }}
                                            onChange={(selectedOption) => handlePaymentMethodChange(selectedOption.value)}
                                            options={[
                                                { value: "", label: "Seleccionar método", isDisabled: true },
                                                { value: "cash", label: "Efectivo" },
                                                { value: "card", label: "Tarjeta Visa / MasterCard" },
                                                { value: "return", label: "Devolución" }
                                            ]}
                                            styles={{
                                                control: (provided, state) => ({
                                                    ...provided,
                                                    minHeight: '42px',
                                                    height: '42px',
                                                    borderRadius: '6px',
                                                    borderColor: validationErrors.payment ? '#f87171' : '#d1d5db',
                                                    '&:hover': {
                                                        borderColor: '#9ca3af'
                                                    }
                                                })
                                            }}
                                        />
                                        {validationErrors.payment && (
                                            <p className="mt-1 text-xs text-red-500">Se requiere un método de pago</p>
                                        )}
                                    </div>

                                    {paymentMethod === 'cash' && (
                                        <>
                                            <div className="w-full mb-2">
                                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Monto en efectivo:</label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min={totalAfterDiscount.toFixed(1)}
                                                    className={`block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border ${validationErrors.cash ? 'border-red-500' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                                    placeholder="Ingrese el monto en efectivo"
                                                    value={cashAmount}
                                                    onChange={handleCashAmountChange}
                                                    onBlur={(e) => {
                                                        if (e.target.value === '') {
                                                            setCashAmount(totalAfterDiscount.toFixed(1));
                                                        } else {
                                                            const value = parseFloat(e.target.value);
                                                            if (!isNaN(value)) {
                                                                setCashAmount(value.toFixed(1));
                                                            }
                                                        }
                                                    }}
                                                />
                                                {validationErrors.cash && (
                                                    <p className="mt-1 text-xs text-red-500">El monto debe ser igual o mayor al total</p>
                                                )}
                                            </div>
                                            <div className="flex justify-between mb-4">
                                                <p className="text-md font-bold">Cambio:</p>
                                                <p className="text-md font-bold">
                                                    {isNaN(parseFloat(cashAmount)) ? (
                                                        'S/. 0.0'
                                                    ) : (
                                                        (() => {
                                                            const change = parseFloat(cashAmount) - parseFloat(totalAfterDiscount.toFixed(1));
                                                            // Mostrar 0.0 si el cambio es -0.0 o muy cercano a cero
                                                            return `S/. ${Math.abs(change) < 0.05 ? '0.0' : change.toFixed(1)}`;
                                                        })()
                                                    )}
                                                </p>
                                            </div>
                                        </>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => { window.location.href = "manager?tab=update-order-items&order=" + OrderResponse.orderId }}
                                            className="rounded-md bg-amber-500 py-2 font-medium text-white hover:bg-amber-600"
                                        >
                                            <i className="ri-menu-add-fill"></i> Actualizar artículos
                                        </button>
                                        <button
                                            onClick={updateOrder}
                                            disabled={isSubmitting}
                                            className={`rounded-md py-2 font-medium text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
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
                                                    <i className="ri-save-fill"></i> Guardar pedido
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => { window.location.href = "/manager?tab=manage-orders" }}
                                        className="mt-3 w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600"
                                    >
                                        <i className="ri-arrow-left-s-line"></i> Regresar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <SearchCustomerModal
                isOpen={customerSearchModal}
                onToggle={() => SetCustomerSearchModal(!customerSearchModal)}
                searchModalResponse={handleCustomerModalResponse}
            />

            <CustomerAddModal
                isOpen={customerAddModal}
                onToggle={() => SetCustomerAddModal(!customerAddModal)}
                customerAddModalResponse={handleCustomerModalResponse}
            />

            <UpdateCustomerModal
                isOpen={customerUpdateModal}
                onToggle={() => SetCustomerUpdateModal(!customerUpdateModal)}
                customerUpdateModalResponse={handleCustomerModalResponse}
                currentCustomerData={customerData}
            />
        </div>
    )
}