import  { useState,useEffect, } from "react";
import {  useSelector } from 'react-redux'
import axios from 'axios';
import toast from 'react-hot-toast';


export default function Bill() {
        const [responseErrors, setResponseErrors] = useState('');
        const [OrderResponse, setOrderResponse] = useState({});
        const { currentUser } = useSelector((state) => state.user);
        const [customerData, setCustomerData] = useState({});
        const [orderItems, setOrderItems] = useState([]);
        const [tableNumber, setTableNumber] = useState(0);
        const [note, setNote] = useState('');
        const [subtotal, setSubtotal] = useState(0);
        const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
        const [discountPercentage, setDiscountPercentage] = useState(0);

        const [paymentMethod, setPaymentMethod] = useState('');
        const [cashAmount, setCashAmount] = useState(0);

        useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const orderIDFromUrl = urlParams.get('order');
            
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
                        setTableNumber(tableNumber);
                        setNote(specialNote);
                        setSubtotal(subTotal);
                        setDiscountPercentage(discountPercentage);
                        setTotalAfterDiscount(totalAfterDiscount);
                        if(customer){
                            setCustomerData(customer);
                            setDiscountPercentage(5);
                        }
                    }else {
                        window.location.href = "/cashier?tab=orders&error=order-not-found";
                    }
                })
                .catch(error => {
                    window.location.href = "/cashier?tab=orders&error=order-not-found";
                    console.error("Error fetching order details:", error);
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

        const handleClearFields = () => {
            setCustomerData({
                cusName: '',
                cusMobile: '',
                cusEmail: ''
            });
        };

        
        
        const updateOrder = async () => {
            try {
                if (orderItems.length < 1) {
                    return setResponseErrors("At least one item must be ordered.");
                }
                if (paymentMethod === '') {
                    return setResponseErrors("Please select a payment method.");
                }  
                if (paymentMethod === 'cash' && (isNaN(parseFloat(cashAmount)) || parseFloat(cashAmount) < totalAfterDiscount)) {
                    return setResponseErrors("Cash amount must be a valid number and equal to or greater than the total amount.");
                }          
        
                const convertedOrderItems = orderItems.map(item => {
                    const { foodId, ...rest } = item;
                    return { foodItemId: foodId, ...rest };
                });
        
                const orderJSON = {
                    orderId: OrderResponse.orderId,
                    customerId: customerData.cusId || "",
                    orderDateTime: OrderResponse.orderDateTime,
                    orderStatus: 'Completed',
                    tableNumber: tableNumber,
                    subTotal: subtotal,
                    discountValue: subtotal * (discountPercentage / 100),
                    discountPercentage: discountPercentage,
                    totalAfterDiscount: totalAfterDiscount,
                    paymentMethod: paymentMethod,
                    paymentStatus: true,
                    employeeId: currentUser.id,
                    orderItems: convertedOrderItems
                };
        
                const response = await axios.put(`http://localhost:8080/api/orders/${OrderResponse.orderId}`, orderJSON, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
        
                if (response.status === 200) {
                    if (tableNumber > 0) {
                        const tableResponse = await axios.put(`http://localhost:8080/api/table/${tableNumber}/availability?availability=true`);
                        if (tableResponse.status !== 200) {
                            toast.error("Failed to update table availability.", { duration: 6000 });
                        }
                    }
        
                    toast.success('Order Completed.');
                    setCustomerData({});
                    handleClearFields();
                    setOrderItems([]);
                    setResponseErrors("");
                    setTableNumber(0);
                    window.location.href = "/cashier?tab=orders";
                } else {
                    console.error('Unexpected response status:', response);
                    toast.error("Something went wrong. \n Please contact system support.", { duration: 6000 });
                }
            } catch (error) {
                setResponseErrors("Something went wrong. \n Please contact system support.");
                console.error("Error:", error);
                toast.error("Something went wrong. \n Please contact system support.", { duration: 6000 });
            }
        };
        
          
        const convertDate = (dateString) => {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = date.getHours() % 12 || 12; // Convert 0 to 12
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const period = date.getHours() < 12 ? 'AM' : 'PM';
            return `${year}-${month}-${day} ${hours}.${minutes} ${period}`;
        };
        
    

        

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

                    {/* Side Bar*/}
                    <div className="h-full  w-full">                            
                        <div className="flex justify-between">
                            <div className={`p-6 mr-1 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600  ${customerData && Object.keys(customerData).length > 0 ? 'w-1/2' : 'w-full'}`}> 
                                <div>
                                    <h4 className="font-bold">Detalles de factura</h4>
                                    <hr className="my-1" />
                                    <br/>
                                    <div className={`overflow-x-auto m-0  ${customerData && Object.keys(customerData).length > 0 ? 'w-full' : 'w-1/2'}`}>
                                        <table className="table-auto w-full">
                                            <tbody className="text-sm">
                                                <tr>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                                            <span><i className="ri-bill-line"></i></span> &nbsp;
                                                            <div className="text-right"># de factura :</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="text-left">#{OrderResponse.orderId}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                                            <span><i className="ri-account-pin-circle-fill"></i></span> &nbsp;
                                                            <div className="text-right">Por :</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="text-left">{OrderResponse.employeeFirstName} {OrderResponse.employeeLastName}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                                            <span><i className="ri-calendar-schedule-line "></i></span> &nbsp;
                                                            <div className="text-right">Fecha y Hora :</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="text-left">{convertDate(OrderResponse.orderDateTime)}</div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                                            <span><i className="ri-store-3-line"></i></span> &nbsp;
                                                            <div className="text-right">Estado de factura :</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="text-left">
                                                        <span className={`inline-flex p-1 mr-auto items-center font-semibold text-xs text-white rounded-lg ${
                                                                            OrderResponse.orderStatus === "Pending" ? "bg-yellow-300" :
                                                                            OrderResponse.orderStatus === "Processing" ? "bg-blue-300" :
                                                                            OrderResponse.orderStatus === "Ready" ? "bg-green-300" :
                                                                            OrderResponse.orderStatus === "Completed" ? "bg-green-500" :
                                                                            ""
                                                                        }`}
                                                        >
                                                            &nbsp;
                                                            {OrderResponse.orderStatus}
                                                            &nbsp;
                                                        </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="flex items-center font-bold">
                                                            <span><i className="ri-restaurant-line text-gray-800 dark:text-gray-50"></i></span> &nbsp;
                                                            <div className="text-right"># de mesa :</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="text-left">
                                                            {tableNumber !== 0 ? (
                                                                // Convert tableNumber to string  before rendering
                                                                tableNumber.toString() 
                                                            ) : (
                                                                "No Table Assigned"
                                                            )}

                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="flex items-center font-bold">
                                                            <span><i className="ri-sticky-note-add-fill text-gray-800 dark:text-gray-50"></i></span> &nbsp;
                                                            <div className="text-right">Nota :</div>
                                                        </div>
                                                    </td>
                                                    <td className="p-1 whitespace-nowrap">
                                                        <div className="text-left">
                                                            {note}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            
                            {customerData && Object.keys(customerData).length > 0  && (
                                <div className="w-1/2 ml-1 p-6 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600 dark: border-none">
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
                                            <div className="w-full mb-6 md:mb-0">
                                                <label
                                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                                    htmlFor="grid-email"
                                                >
                                                   Correo electrónico
                                                </label>
                                                <input
                                                    className=" appearance-none block w-full bg-transparent text-grey-darker border rounded py-2 px-4 mb-3 selection:border-none focus:outline-none  focus:border-black focus:ring-0 dark:border-grey-darker dark:focus:border-gray-500"
                                                    id="grid-email"
                                                    type="email"
                                                    value={customerData.cusEmail}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between">
                            <div className=" w-1/2 mr-1 py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-28rem)] h-auto">
                                <div className="overflow-x-auto overflow-scroll max-h-[calc(100vh-24rem)] h-auto px-2 py-2">
                                    <table className="w-full table-auto">
                                        <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-2 py-1">
                                                    <div className="text-left font-semibold"> #</div>
                                                </th>
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
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {orderItems.length < 1 ? (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-gray-400 py-4">No hay ítems encontrados.</td>
                                                </tr>
                                            ) : (
                                                orderItems.map((item, index) => ( 
                                                    <tr key={index+1}>
                                                        <td className="px-2 py-1">
                                                            <div className="font-medium capitalize text-gray-500 dark:text-gray-50">{index+1}</div>
                                                        </td>
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
                                                    </tr>
                                                ))
                                            )}{}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className=" w-1/2 ml-1 py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-28rem)] h-auto">
                                <div className="px-6 py-3">
                                    <hr className="mt-2 mb-3"/>
                                    <div className="flex justify-between">
                                        <p className="text-md">Subtotal</p>
                                        <div>
                                            <p className="mb-1 text-md">S/. {subtotal.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                            <div className="flex items-center justify-evenly">
                                                <p className="text-md">Descuento &nbsp;</p>
                                                <select
                                                    value={discountPercentage}
                                                    onChange={(e) => setDiscountPercentage(e.target.value)}
                                                    className="appearance-none block bg-transparent border border-gray-300 rounded  leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-transparent dark:border-gray-600 dark:text-white dark:focus:bg-gray-700 dark:focus:border-gray-500"
                                                >
                                                    <option value="0">0%</option>
                                                    <option value="5">5%</option>
                                                    <option value="10">10%</option>
                                                    <option value="15">15%</option>
                                                    <option value="20">20%</option>
                                                    <option value="25">25%</option>
                                                </select>
                                            </div>
                                        <div className="flex items-center">
                                            <p className="mb-1 text-md">S/. {(subtotal * (discountPercentage / 100)).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                            <p className="text-md"></p>
                                            <div>
                                                {discountPercentage === 5 ? (
                                                    <p className="top-full left-0 mt-1 text-xs text-gray-500">
                                                        Descuento para miembro aplicado
                                                    </p>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                    </div>
                                    <hr className="mt-2 mb-3"/>
                                    <div className="flex justify-between">
                                        <p className="text-lg font-bold">Total</p>
                                        <div>
                                            <p className="mb-1 text-lg font-bold">S/. {totalAfterDiscount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <hr className="mt-2 mb-3"/>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-md font-bold">Método de pago</p>
                                            <select
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="w-1/2 appearance-none block bg-transparent border border-gray-300 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-transparent dark:border-gray-600 dark:text-white dark:focus:bg-gray-700 dark:focus:border-gray-500"
                                            >
                                                <option hidden value="">Seleccionar método de pago</option>
                                                <option value="cash">Efectivo</option>
                                                <option value="card">Tarjeta Visa / Master Card</option>
                                            </select>
                                        </div>
                                        {paymentMethod === 'cash' && (
                                            <div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-md font-bold">Monto en efectivo</p>
                                                    <input
                                                        className="w-1/2 appearance-none block bg-transparent border border-gray-300 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 dark:bg-transparent dark:border-gray-600 dark:text-white dark:focus:bg-gray-700 dark:focus:border-gray-500"
                                                        type="number"
                                                        placeholder="Ingresa el monto"
                                                        value={cashAmount}
                                                        onChange={(e) => setCashAmount(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-md font-bold">Monto restante</p>
                                                    <div>
                                                        {isNaN(parseFloat(cashAmount)) ? (
                                                            <p className="mb-1 text-lg font-bold">S/.{cashAmount}</p>
                                                        ) : (
                                                            <p className="mb-1 text-lg font-bold">S/. {(parseFloat(cashAmount) - totalAfterDiscount).toFixed(2)}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    <button onClick={() => updateOrder()} className="mt-6 w-full rounded-md bg-green-500  py-1.5 font-medium text-white hover:bg-green-600">
                                        <i className="ri-restaurant-2-fill"></i> Completar orden
                                    </button>
                                    <button onClick={() => { window.location.href = "/cashier?tab=orders" }} className="mt-3 w-full rounded-md bg-blue-500  py-1.5 font-medium text-white hover:bg-blue-600">
                                        <i className="ri-arrow-left-s-line"></i> Regresar
                                    </button>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
