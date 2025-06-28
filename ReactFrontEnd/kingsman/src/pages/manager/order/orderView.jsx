import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import OrderPDF from '../../cashier/Order/OrderPDF';

const OrderView = () => {
    const [showPDF, setShowPDF] = useState(false);
    const [OrderResponse, setOrderResponse] = useState({});
    const [customerData, setCustomerData] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [tableNumber, setTableNumber] = useState(0);
    const [note, setNote] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderIDFromUrl = urlParams.get('order');

        if (!orderIDFromUrl) {
            setError("No se proporcionó ID de pedido");
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se proporcionó ID de pedido',
                confirmButtonColor: '#3085d6',
            }).then(() => {
                navigate("/manager?tab=manage-orders");
            });
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/orders/${orderIDFromUrl}`);

                if (response.status === 200) {
                    const { orderItems, tableNumber, specialNote, subTotal, discountPercentage, totalAfterDiscount, customer } = response.data;

                    const convertedOrderItems = orderItems.map(item => ({
                        orderItemId: item.orderItemId,
                        foodId: item.foodItemId,
                        foodName: item.foodItemName,
                        foodPrice: item.foodPrice,
                        quantity: item.quantity,
                        totalPrice: item.quantity * item.foodPrice,
                    }));

                    setOrderResponse(response.data);
                    setOrderItems(convertedOrderItems);
                    setTableNumber(tableNumber);
                    setNote(specialNote || "Sin notas especiales");
                    
                    // Establecer los valores directamente del servidor
                    setSubtotal(subTotal);
                    setDiscountPercentage(discountPercentage || 0);
                    setDiscountValue((subTotal * (discountPercentage || 0)) / 100);
                    setTotalAfterDiscount(totalAfterDiscount);

                    if (customer) {
                        setCustomerData(customer);
                        // Solo establecer descuento de 5% si no hay descuento definido
                        if (!discountPercentage) {
                            setDiscountPercentage(5);
                            setDiscountValue((subTotal * 5) / 100);
                        }
                    }
                } else {
                    setError("Pedido no encontrado");
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Pedido no encontrado',
                        confirmButtonColor: '#3085d6',
                    }).then(() => {
                        navigate("/manager?tab=manage-orders");
                    });
                }
            } catch (error) {
                console.error("Error al obtener los detalles del pedido:", error);
                setError("Error al cargar los detalles del pedido");
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar los detalles del pedido',
                    confirmButtonColor: '#3085d6',
                }).then(() => {
                    navigate("/manager?tab=manage-orders");
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [navigate]);

    useEffect(() => {
        // Solo recalcular si hay cambios en los items o descuento
        if (orderItems.length > 0) {
            const newSubtotal = orderItems.reduce((total, item) => total + (item.foodPrice * item.quantity), 0);
            const newDiscountValue = (newSubtotal * discountPercentage) / 100;
            const newTotal = newSubtotal - newDiscountValue;
            
            setSubtotal(newSubtotal);
            setDiscountValue(newDiscountValue);
            setTotalAfterDiscount(newTotal);
        }
    }, [orderItems, discountPercentage]);

    const convertDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours() % 12 || 12;
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
    };

    const handleTogglePDF = () => {
        setShowPDF(!showPDF);
    };

    const handleEditOrder = () => {
        if (OrderResponse.orderId) {
            navigate(`/manager?tab=update-order&order=${OrderResponse.orderId}`);
        }
    };

    const handleBack = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Quieres regresar al listado de pedidos?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, regresar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/manager?tab=manage-orders");
            }
        });
    };

    if (loading) {
        return (
            <div className="w-full bg-white dark:bg-gray-700 py-5 flex justify-center items-center h-screen rounded-lg shadow">
                <div className="text-xl font-semibold">Cargando detalles del pedido...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white dark:bg-gray-700 py-5 flex justify-center items-center h-screen rounded-lg shadow">
                <div className="text-xl font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow py-5 min-h-screen">
            <div className="w-full px-2 md:px-6">
                <div className="mx-auto justify-center">
                    <div className="h-full w-full">
                        <h1 className="mb-2 text-left text-lg md:text-xl font-bold dark:text-white px-2">
                            #{OrderResponse.orderId} &nbsp; | &nbsp;
                            <span className={`inline-flex px-2 py-1 mr-auto items-center font-semibold text-sm md:text-base text-white rounded-lg ${OrderResponse.orderStatus === "Pending" ? "bg-yellow-300" :
                                    OrderResponse.orderStatus === "Processing" ? "bg-blue-300" :
                                        OrderResponse.orderStatus === "Ready" ? "bg-green-300" :
                                            OrderResponse.orderStatus === "Completed" ? "bg-green-500" :
                                                OrderResponse.orderStatus === "Canceled" ? "bg-red-500" :
                                                    "bg-gray-300"
                                }`}>
                                &nbsp;{OrderResponse.orderStatus}&nbsp;
                            </span>
                            &nbsp;|&nbsp;
                            {convertDate(OrderResponse.orderDateTime)}
                            &nbsp;|&nbsp;
                            Por {OrderResponse.employeeFirstName} {OrderResponse.employeeLastName}
                        </h1>

                        {/* Sección de detalles del cliente */}
                        <div className="p-4 md:p-6 rounded-lg border bg-white mb-3 shadow-md dark:bg-gray-600 dark:border-none">
                            <div>
                                <h4 className="font-bold">Detalles del cliente</h4>
                                <hr className="my-2" />
                            </div>
                            <div className="rounded pt-1">
                                <div className="w-full flex flex-col md:flex-row mb-2">
                                    <div className="w-full md:w-1/3 mb-2 md:mb-0 md:mr-2">
                                        <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                                            Nombre
                                        </label>
                                        <input
                                            className="appearance-none block w-full 
                                            bg-gray-200 text-gray-500 cursor-not-allowed 
                                            rounded py-2 px-4 mb-3 
                                            border border-gray-300 
                                            focus:outline-none focus:ring-0 
                                            dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                            type="text"
                                            value={customerData.cusName || 'No especificado'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 mb-2 md:mb-0 md:mx-2">
                                        <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                                            Móvil
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                            type="text"
                                            value={customerData.cusMobile || 'No especificado'}
                                            readOnly
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3 mb-2 md:mb-0 md:ml-2">
                                        <label className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2">
                                            Correo electrónico
                                        </label>
                                        <input
                                            className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                            type="email"
                                            value={customerData.cusEmail || 'No especificado'}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección de items del pedido */}
                        <div className="py-2 flex flex-col justify-between rounded-lg border bg-white mb-6 shadow-md dark:bg-gray-600 dark:border-none min-h-[calc(100vh-21rem)] h-auto">
                            <div className="overflow-x-auto px-2 md:px-6 py-2">
                                <table className="w-full table-auto min-w-[600px]">
                                    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-400 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-2 py-1">
                                                <div className="text-left font-semibold">#</div>
                                            </th>
                                            <th className="px-2 py-1">
                                                <div className="text-left font-semibold">Nombre</div>
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
                                                <td colSpan="5" className="text-center text-gray-400 py-4">
                                                    No se encontraron artículos en este pedido.
                                                </td>
                                            </tr>
                                        ) : (
                                            orderItems.map((item, index) => (
                                                <tr key={`${item.foodId}-${index}`}>
                                                    <td className="px-2 py-1">
                                                        <div className="font-medium capitalize text-gray-800 dark:text-gray-50">{index + 1}</div>
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
                                                        <div className="text-right font-medium text-green-500">{(item.foodPrice * item.quantity).toFixed(2)}</div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumen del pedido */}
                            <div className="px-4 md:px-6 py-3">
                                <hr className="mt-1 mb-3" />
                                <div className="flex justify-between">
                                    <p className="text-sm md:text-md">Subtotal</p>
                                    <div>
                                        <p className="mb-1 text-sm md:text-md">S/. {subtotal.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm md:text-md">Descuento {discountPercentage}%</p>
                                    <div>
                                        <p className="mb-1 text-sm md:text-md">S/. {discountValue.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm md:text-md"></p>
                                    <div>
                                        {customerData.cusId && discountPercentage === 5 && (
                                            <p className="top-full left-0 mt-1 text-xs text-gray-500 dark:text-gray-300">
                                                Descuento de miembro aplicado (Beneficio por estar registrado)
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <hr className="mt-2 mb-3" />
                                <div className="flex justify-between">
                                    <p className="text-md md:text-lg font-bold">Total</p>
                                    <div>
                                        <p className="mb-1 text-md md:text-lg font-bold">S/. {totalAfterDiscount.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row w-full justify-evenly my-2">
                                    <div className="w-full md:w-1/2 mb-2 md:mb-0 md:mr-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Mesa:
                                        </label>
                                        <input
                                            type="text"
                                            className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                            readOnly
                                            value={tableNumber || "No asignada"}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 md:ml-2">
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Nota:
                                        </label>
                                        <textarea
                                            rows={1}
                                            className="appearance-none block w-full bg-gray-200 text-gray-500 cursor-not-allowed rounded py-2 px-4 mb-3 border border-gray-300 focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                            readOnly
                                            value={note}
                                        />
                                    </div>
                                </div>

                                {showPDF && (
                                    <div className='flex items-center justify-end w-full overflow-hidden px-1 mb-2'>
                                        <OrderPDF order={OrderResponse} />
                                    </div>
                                )}

                                <div className='flex flex-col md:flex-row items-center justify-between w-full overflow-hidden gap-2 mt-4'>
                                    <button
                                        onClick={handleBack}
                                        className="w-full md:w-auto flex-grow flex items-center justify-center px-3 py-2 bg-cyan-500 text-white font-semibold rounded hover:bg-cyan-600"
                                    >
                                        <i className="ri-arrow-left-s-line"></i>
                                        <span className="ml-1">Regresar</span>
                                    </button>

                                    {!showPDF && (
                                        <button
                                            onClick={handleTogglePDF}
                                            className="w-full md:w-auto flex-grow flex items-center justify-center px-3 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                                        >
                                            Generar PDF
                                        </button>
                                    )}

                                    <button
                                        onClick={handleEditOrder}
                                        className="w-full md:w-auto flex-grow flex items-center justify-center px-3 py-2 bg-amber-500 text-white font-semibold rounded hover:bg-amber-600"
                                    >
                                        <i className="ri-edit-fill"></i>
                                        <span className="ml-1">Editar orden</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderView;