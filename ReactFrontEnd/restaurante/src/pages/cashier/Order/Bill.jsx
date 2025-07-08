import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function Bill() {
    const [OrderResponse, setOrderResponse] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const [customerData, setCustomerData] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [tableNumber, setTableNumber] = useState(0);
    const [note, setNote] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cashAmount, setCashAmount] = useState('');
    const [changeAmount, setChangeAmount] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIDFromUrl = urlParams.get('order');

        axios.get(`localhost:8080/api/orders/${orderIDFromUrl}`)
            .then(response => {
                if (response.status === 200) {
                    setOrderResponse(response.data);
                    const { orderItems, tableNumber, specialNote, subTotal, discountPercentage, totalAfterDiscount, customer } = response.data;
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
                    setNote(specialNote);
                    setSubtotal(subTotal);
                    setDiscountPercentage(discountPercentage || 0);
                    setTotalAfterDiscount(totalAfterDiscount);
                    if (customer) {
                        setCustomerData(customer);
                        setDiscountPercentage(5);
                    }
                } else {
                    window.location.href = "/cashier?tab=orders&error=order-not-found";
                }
            })
            .catch(error => {
                window.location.href = "/cashier?tab=orders&error=order-not-found";
                console.error("Error fetching order details:", error);
            });
    }, []);

    useEffect(() => {
        const newSubtotal = orderItems.reduce((total, item) => total + item.totalPrice, 0);
        setSubtotal(newSubtotal);

        const discountAmount = (newSubtotal * discountPercentage) / 100;
        const newTotalAfterDiscount = newSubtotal - discountAmount;
        setTotalAfterDiscount(newTotalAfterDiscount);

        // Calculate change when cash amount changes
        if (paymentMethod?.value === 'cash' && cashAmount !== '') {
            const numericCashAmount = parseFloat(cashAmount);
            if (!isNaN(numericCashAmount)) {
                const change = numericCashAmount - newTotalAfterDiscount;
                setChangeAmount(change > 0 ? change : 0);
            }
        } else {
            setChangeAmount(0);
        }
    }, [orderItems, discountPercentage, cashAmount, paymentMethod]);

    const handleClearFields = () => {
        setCustomerData({
            cusName: '',
            cusMobile: '',
            cusEmail: ''
        });
    };

    const paymentMethodOptions = [
        { value: 'cash', label: 'Efectivo' },
        { value: 'card', label: 'Tarjeta' },
        { value: 'transfer', label: 'Transferencia' }
    ];

    const discountOptions = [
        { value: 0, label: '0%' },
        { value: 5, label: '5%' },
        { value: 10, label: '10%' },
        { value: 15, label: '15%' },
        { value: 20, label: '20%' },
        { value: 25, label: '25%' }
    ];

    const handleCashInput = (e) => {
        const value = e.target.value;
        // Permitir números con un solo decimal o números enteros
        if (/^\d*\.?\d{0,1}$/.test(value) || value === '') {
            setCashAmount(value);
        }
    };

    const formatNumber = (num) => {
        // Mostrar como entero si no tiene decimales, de lo contrario mostrar un decimal
        return num % 1 === 0 ? num.toString() : num.toFixed(1);
    };

    const confirmOrderCompletion = async () => {
        // Validación básica
        if (orderItems.length < 1) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe haber al menos un artículo en el pedido',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        if (!paymentMethod) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor seleccione un método de pago',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        if (paymentMethod.value === 'cash') {
            const numericCashAmount = parseFloat(cashAmount);
            if (isNaN(numericCashAmount)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Por favor ingrese un monto válido',
                    confirmButtonColor: '#3085d6',
                });
                return;
            }

            if (numericCashAmount < totalAfterDiscount) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `El monto en efectivo debe ser igual o mayor a S/. ${formatNumber(totalAfterDiscount)}`,
                    confirmButtonColor: '#3085d6',
                });
                return;
            }
        }

        const { isConfirmed } = await Swal.fire({
            title: '¿Confirmar pago?',
            html: `
                <div class="text-left">
                    <p><strong>Método de pago:</strong> ${paymentMethod.label}</p>
                    ${paymentMethod.value === 'cash' ? `
                        <p><strong>Total a pagar:</strong> S/. ${formatNumber(totalAfterDiscount)}</p>
                        <p><strong>Monto recibido:</strong> S/. ${formatNumber(parseFloat(cashAmount))}</p>
                        <p><strong>Cambio:</strong> S/. ${formatNumber(changeAmount)}</p>
                    ` : ''}
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar'
        });

        if (isConfirmed) {
            updateOrder();
        }
    };

    const updateOrder = async () => {
        try {
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
                paymentMethod: paymentMethod.value,
                paymentStatus: true,
                employeeId: currentUser.id,
                orderItems: convertedOrderItems,
                specialNote: note
            };

            const response = await axios.put(`localhost:8080/api/orders/${OrderResponse.orderId}`, orderJSON, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                if (tableNumber > 0) {
                    await axios.put(`localhost:8080/api/table/${tableNumber}/availability?availability=true`);
                }

                Swal.fire({
                    icon: 'success',
                    title: '¡Pedido completado!',
                    text: 'El pedido ha sido marcado como completado exitosamente',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    window.location.href = "/cashier?tab=orders";
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al procesar el pedido. Por favor intente nuevamente.',
                confirmButtonColor: '#3085d6',
            });
        }
    };

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

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">
            <div className="w-full">
                <div className="max-w-full px-6">
                    <div className="mx-auto justify-center md:flex md:space-x-6 xl:px-0">
                        {/* Side Bar*/}
                        <div className="h-full w-full">
                            <div className="flex justify-between">
                                <div className={`p-6 mr-1 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600 ${customerData && Object.keys(customerData).length > 0 ? 'w-1/2' : 'w-full'}`}>
                                    <div>
                                        <h4 className="font-bold">Detalles de Factura</h4>
                                        <hr className="my-1" />
                                        <br />
                                        <div className={`overflow-x-auto m-0 ${customerData && Object.keys(customerData).length > 0 ? 'w-full' : 'w-1/2'}`}>
                                            <table className="table-auto w-full">
                                                <tbody className="text-sm">
                                                    <tr>
                                                        <td className="p-1 whitespace-nowrap">
                                                            <div className="flex items-center font-bold text-gray-800 dark:text-gray-50">
                                                                <span><i className="ri-bill-line"></i></span> &nbsp;
                                                                <div className="text-right">Factura No :</div>
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
                                                                <div className="text-right">Estado :</div>
                                                            </div>
                                                        </td>
                                                        <td className="p-1 whitespace-nowrap">
                                                            <div className="text-left">
                                                                <span className={`inline-flex p-1 mr-auto items-center font-semibold text-xs text-white rounded-lg ${OrderResponse.orderStatus === "Pending" ? "bg-yellow-300" :
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
                                                                <div className="text-right">Mesa No :</div>
                                                            </div>
                                                        </td>
                                                        <td className="p-1 whitespace-nowrap">
                                                            <div className="text-left">
                                                                {tableNumber !== 0 ? (
                                                                    tableNumber.toString()
                                                                ) : (
                                                                    "No asignada"
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
                                                                {note || "Ninguna"}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {customerData && Object.keys(customerData).length > 0 && (
                                    <div className="w-1/2 ml-1 p-6 rounded-lg border bg-white mb-3 shadow-md md:mt-0 text-sm dark:bg-gray-600 dark:border-none">
                                        <div>
                                            <h4 className="font-bold">Detalles del Cliente</h4>
                                            <hr className="my-2" />
                                        </div>
                                        <div className="rounded pt-1">
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
                                                            className="appearance-none block w-full 
                                            bg-gray-200 text-gray-500 cursor-not-allowed 
                                            rounded py-2 px-4 mb-3 
                                            border border-gray-300 
                                            focus:outline-none focus:ring-0 
                                            dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
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
                                                            Teléfono
                                                        </label>
                                                        <input
                                                            className="appearance-none block w-full 
                                            bg-gray-200 text-gray-500 cursor-not-allowed 
                                            rounded py-2 px-4 mb-3 
                                            border border-gray-300 
                                            focus:outline-none focus:ring-0 
                                            dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
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
                                                        Email
                                                    </label>
                                                    <input
                                                        className="appearance-none block w-full 
                                            bg-gray-200 text-gray-500 cursor-not-allowed 
                                            rounded py-2 px-4 mb-3 
                                            border border-gray-300 
                                            focus:outline-none focus:ring-0 
                                            dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
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
                                <div className="w-1/2 mr-1 py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-28rem)] h-auto">
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
                                                        <div className="text-center font-semibold">Cant</div>
                                                    </th>
                                                    <th className="px-2 py-1">
                                                        <div className="text-right font-semibold">Total S/.</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {orderItems.length < 1 ? (
                                                    <tr>
                                                        <td colSpan="5" className="text-center text-gray-400 py-4">No se encontraron artículos.</td>
                                                    </tr>
                                                ) : (
                                                    orderItems.map((item, index) => (
                                                        <tr key={index + 1}>
                                                            <td className="px-2 py-1">
                                                                <div className="font-medium capitalize text-gray-500 dark:text-gray-50">{index + 1}</div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="font-medium capitalize text-gray-800 dark:text-gray-50">{item.foodName}</div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="text-center font-medium text-green-500">{formatNumber(item.foodPrice)}</div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="text-center dark:text-gray-50">{item.quantity}</div>
                                                            </td>
                                                            <td className="px-2 py-1">
                                                                <div className="text-right font-medium text-green-500">{formatNumber(item.totalPrice)}</div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="w-1/2 ml-1 py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md md:mt-0 dark:bg-gray-600 dark:border-none min-h-[calc(100vh-28rem)] h-auto">
                                    <div className="px-6 py-3">
                                        <hr className="mt-2 mb-3" />
                                        <div className="flex justify-between">
                                            <p className="text-md">Subtotal</p>
                                            <div>
                                                <p className="mb-1 text-md">S/. {formatNumber(subtotal)}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center justify-evenly">
                                                <p className="text-md">Descuento &nbsp;</p>
                                                <Select
                                                    options={discountOptions}
                                                    value={discountOptions.find(opt => opt.value === discountPercentage)}
                                                    onChange={(selected) => setDiscountPercentage(selected.value)}
                                                    className="basic-single"
                                                    classNamePrefix="select"
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
                                                <p className="mb-1 text-md">S/. {formatNumber(subtotal * (discountPercentage / 100))}</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-md"></p>
                                            <div>
                                                {discountPercentage === 5 && (
                                                    <p className="top-full left-0 mt-1 text-xs text-gray-500">
                                                        Descuento para miembro aplicado
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <hr className="mt-2 mb-3" />
                                        <div className="flex justify-between">
                                            <p className="text-lg font-bold">Total</p>
                                            <div>
                                                <p className="mb-1 text-lg font-bold">S/. {formatNumber(totalAfterDiscount)}</p>
                                            </div>
                                        </div>
                                        <hr className="mt-2 mb-3" />
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-md font-bold">Método de pago</p>
                                                <div className="w-1/2">
                                                    <Select
                                                        options={paymentMethodOptions}
                                                        value={paymentMethod}
                                                        onChange={(selected) => {
                                                            setPaymentMethod(selected);
                                                            if (selected.value === 'cash') {
                                                                setCashAmount(totalAfterDiscount.toFixed(1));
                                                            } else {
                                                                setCashAmount('');
                                                            }
                                                        }}
                                                        placeholder="Seleccionar método"
                                                        className="basic-single"
                                                        classNamePrefix="select"
                                                        styles={{
                                                            control: (provided, state) => ({
                                                                ...provided,
                                                                minHeight: '38px',
                                                                borderRadius: '6px',
                                                                borderColor: !paymentMethod && state.isFocused ? '#f87171' : '#d1d5db',
                                                                '&:hover': {
                                                                    borderColor: '#9ca3af'
                                                                }
                                                            })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {paymentMethod?.value === 'cash' && (
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-md font-bold">Monto en efectivo</p>
                                                        <input
                                                            className="w-1/2 p-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            type="text"
                                                            inputMode="decimal"
                                                            placeholder="Ingresa el monto"
                                                            value={cashAmount}
                                                            onChange={handleCashInput}
                                                            onBlur={(e) => {
                                                                if (e.target.value === '') {
                                                                    setCashAmount(totalAfterDiscount.toFixed(1));
                                                                } else {
                                                                    const value = parseFloat(e.target.value);
                                                                    if (!isNaN(value)) {
                                                                        setCashAmount(formatNumber(value));
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-md font-bold">Cambio</p>
                                                        <div>
                                                            <p className="mb-1 text-lg font-bold">S/. {formatNumber(changeAmount)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={confirmOrderCompletion}
                                            className="mt-6 w-full rounded-md bg-green-500 py-1.5 font-medium text-white hover:bg-green-600"
                                        >
                                            <i className="ri-restaurant-2-fill"></i> Completar orden
                                        </button>
                                        <button
                                            onClick={() => { window.location.href = "/cashier?tab=orders" }}
                                            className="mt-3 w-full rounded-md bg-blue-500 py-1.5 font-medium text-white hover:bg-blue-600"
                                        >
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