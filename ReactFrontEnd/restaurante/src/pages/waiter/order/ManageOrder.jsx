import React, { useState, useEffect } from 'react';
import CancelOrderModal from './cancelOrderModal';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(14);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orders/all-orders-general');
            const data = await response.json();

            // Function to format date in YYYY-MM-DD format
            const formatDate = (date) => {
                return new Date(date).toLocaleDateString('en-US', { timeZone: 'America/Lima' });
            };

            // Get today's date in Sri Lanka 
            const today = formatDate(new Date());

            // Filter orders for today
            const todayOrders = data.filter(order => {
                // Convert order date to Sri Lanka timezone
                const orderDate = formatDate(order.orderDateTime);
                return orderDate === today;
            });
            // Set the filtered orders
            setOrders(todayOrders);
        } catch (error) {
            console.error('Error al recuperar pedidos:', error);
        }
    };

    const handleCancelOrder = async (order) => {

        // console.log(order);
        const orderId = order.orderId;
        try {
            const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/api/orders/status-update/${orderId}/Canceled`, {
                method: 'PUT'
            });
            if (response.status === 204 || response.ok) {

                if (order.tableNumber > 0) {

                    const tableResponse = await axios.put(`${import.meta.env.REACT_APP_API_URL}/api/table/${order.tableNumber}/availability?availability=true`);

                    if (tableResponse.status == 200) {
                        toast.success('Pedido cancelado y mesa liberada exitosamente!', {
                            icon: <i className="ri-file-excel-fill text-red-700"></i>,
                        });
                    } else {
                        toast.error("No se pudo actualizar la disponibilidad de la mesa. Contacte con el soporte del sistema..", { duration: 6000 });
                        console.error('No se pudo actualizar la disponibilidad de la mesa:', tableResponse);
                    }
                } else {
                    toast.success('Order cancelled successfully!', {
                        icon: <i className="ri-file-excel-fill text-red-700"></i>,
                    });
                }



                setOrders(orders.filter(order => order.orderId !== orderId));
                setIsCancelModalOpen(false);
            } else {
                toast.error("Hubo un error. \n Póngase en contacto con el soporte del sistema.", { duration: 6000 });
                console.error('No se pudo eliminar el pedido:', response);
            }
        } catch (error) {
            toast.error("Hubo un error. \n Póngase en contacto con el soporte del sistema.", { duration: 6000 });
            console.error('Error al eliminar el pedido:', error);
        }
    };

    const filteredOrders = orders.filter(order => {
        if (searchQuery !== "") {
            if (searchCriteria === 'id') {
                return order.orderId.toString().includes(searchQuery);
            } else if (searchCriteria === 'name') {
                return order.customer && order.customer.cusName.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (searchCriteria === 'mobile') {
                return order.customer && order.customer.cusMobile && order.customer.cusMobile.includes(searchQuery);
            } else if (searchCriteria === 'status') {
                return order.orderStatus.toLowerCase().includes(searchQuery.toLowerCase());
            }
        } else {
            return true;
        }
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours() % 12 || 12; // Convert 0 to 12
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
    };

    const toggleCancelModal = (order, event) => {
        // Stop event propagation
        if (event) {
            event.stopPropagation();
        }
        setSelectedOrder(order);
        setIsCancelModalOpen(prevState => !prevState);
    };


    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Function redirect to order view page
    const redirectToOrderView = (orderId) => {
        window.location.href = `/waiter?tab=order-view&order=${orderId}`;
    };

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">
            <div className="w-full">
                <div className="max-w-full px-6">
                    <div className="w-full">
                        <div >
                            <div className='w-full flex'>
                                <div className="relative flex-1">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <i className="ri-search-line"></i>
                                    </div>
                                    <input
                                        type="search"
                                        id="default-search"
                                        className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Buscar ID de pedido, Cliente..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                    />
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        type="button"
                                        className="text-white absolute right-2.5 bottom-2.5 bg-orange-500 hover:bg-orange-600 selection:border-none focus:outline-none font-medium rounded-lg text-sm px-4 py-2 dark:bg-orange-500 dark:hover:bg-orange-700"
                                    >
                                        Vaciar
                                    </button>
                                </div>
                                <div>
                                    <select
                                        id="search-criteria"
                                        className=" p-4 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        value={searchCriteria}
                                        onChange={e => setSearchCriteria(e.target.value)}
                                    >
                                        <option value="name">Por nombre</option>
                                        <option value="mobile">Por móvil</option>
                                        <option value="id">Por ID de pedido</option>
                                        <option value="status">Por estado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md my-5">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-100 text-gray-900  dark:bg-gray-700 dark:text-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Número de pedido
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Número de mesa
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Cantidad
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Total
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Nombre del cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Móvil del cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Fecha
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100 dark:bg-gray-600 dark:text-gray-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center">No hay registros para mostrar</td>
                                    </tr>
                                ) : (
                                    currentItems.map(order => (
                                        <tr onClick={() => redirectToOrderView(order.orderId)} key={order.orderId} className="hover:bg-gray-100 dark:hover:bg-gray-400 cursor-pointer">
                                            <td className="px-6 py-2 text-center"><a className=' hover:text-green-500' href={`/waiter?tab=order-view&order=${order.orderId}`}>{order.orderId}</a></td>
                                            <td className="px-6 py-2 text-center">
                                                {(() => {
                                                    const statusMap = {
                                                        "Pending": "Pendiente",
                                                        "Processing": "En preparación",
                                                        "Ready": "Listo para entregar",
                                                        "Completed": "Terminado",
                                                        "Canceled": "Cancelado"
                                                    };

                                                    const colorClass = {
                                                        "Pending": "bg-yellow-300",
                                                        "Processing": "bg-blue-300",
                                                        "Ready": "bg-green-300",
                                                        "Completed": "bg-green-500",
                                                        "Canceled": "bg-red-400"
                                                    };

                                                    const translated = statusMap[order.orderStatus] || order.orderStatus;
                                                    const bgColor = colorClass[order.orderStatus] || "bg-gray-300";

                                                    return (
                                                        <span className={`inline-flex px-2 py-1 items-center text-white rounded-lg text-xs ${bgColor}`}>
                                                            {translated}
                                                        </span>
                                                    );
                                                })()}
                                            </td>

                                            <td className="px-6 py-2 text-center">{order.tableNumber == 0 ? "-" : order.tableNumber}</td>
                                            <td className="px-6 py-2 text-center">{order.orderItems.length}</td>
                                            <td className="px-6 py-2 text-center">{order.totalAfterDiscount.toFixed(2)}</td>
                                            <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusName : '-'}</td>
                                            <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusMobile : '-'}</td>
                                            <td className="px-6 py-2 text-center text-xs">{formatDate(order.orderDateTime)}</td>
                                            <td className="px-6 py-2">
                                                {order.orderStatus != "Pending" ? (
                                                    <div>
                                                        <p className="w-full text-center">Acción restringida</p>
                                                    </div>
                                                ) : (

                                                    <div className=" flex items-center justify-center w-full">
                                                        <a href={`/waiter?tab=update-orders&order=${order.orderId}`} className=" px-2 py-1 text-sm text-white text-center bg-amber-500 rounded-lg hover:bg-amber-600">
                                                            <i className="ri-edit-fill"></i> Editar
                                                        </a>
                                                        &nbsp;
                                                        <button onClick={(event) => toggleCancelModal(order, event)} className=" px-2 py-1 text-sm text-white text-center bg-red-500 rounded-lg hover:bg-red-700">
                                                            <i className="ri-file-excel-fill"></i> Cancelar
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredOrders.length != 0 &&
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                className="mx-1 px-4 py-2 text-sm font-medium text-gray-700 bg-green-200 rounded-md hover:bg-green-300 focus:outline-none"
                            >
                                <i className="ri-arrow-left-s-line"></i> Siguiente
                            </button>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === index + 1 ? 'text-white bg-green-500' : 'text-gray-700 bg-green-200 hover:bg-green-300'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="mx-1 px-4 py-2 text-sm font-medium text-gray-700 bg-green-200 rounded-md hover:bg-green-300 focus:outline-none"
                            >
                                Antes <i className="ri-arrow-right-s-line"></i>
                            </button>
                        </div>
                    }
                </div>
            </div>
            <CancelOrderModal
                isOpen={isCancelModalOpen}
                onToggle={toggleCancelModal}
                onDelete={() => handleCancelOrder(selectedOrder)}
            />

        </div>
    );
}
