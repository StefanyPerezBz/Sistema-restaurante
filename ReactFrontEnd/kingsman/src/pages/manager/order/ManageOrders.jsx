import React, { useState, useEffect } from 'react';
import DeleteOrderModal from './deleteOrderModal';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orders');
            const data = await response.json();
            setOrders(data);
            console.log(data)
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    const filteredOrders = orders.filter(order => {
        // Check if the order status matches the selected status
        if (selectedStatus !== 'All' && order.orderStatus !== selectedStatus) {
            return false;
        }

        // Check if search query is provided
        if (searchQuery !== "") {
            if (searchCriteria === 'id') {
                return order.orderId.toString().includes(searchQuery);
            } else if (searchCriteria === 'name') {
                return order.customer && order.customer.cusName.toLowerCase().includes(searchQuery.toLowerCase());
            } else if (searchCriteria === 'mobile') {
                return order.customer && order.customer.cusMobile && order.customer.cusMobile.includes(searchQuery);
            } else if (searchCriteria === 'date') {
                const orderDate = new Date(order.orderDateTime);
                const searchDate = new Date(searchQuery);
                return orderDate.toDateString() === searchDate.toDateString();
            }
        } else {
            return true; // If no search query provided, include all orders
        }
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours() % 12 || 12; // Convert 0 to 12
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${year}-${month}-${day} ${hours}.${minutes} ${period}`;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const toggleDeleteModal = (order, event) => {
        // Stop event propagation
        if (event) {
            event.stopPropagation();
        }
        setSelectedOrder(order);
        setIsDeleteModalOpen(prevState => !prevState);
    };


    const handleDeleteOrder = async (order) => {

        const orderId = order.orderId
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'DELETE'
            });

            if (response.status === 204 || response.ok) {

                await axios.put(`http://localhost:8080/api/table/${order.tableNumber}/availability?availability=true`);

                toast('Orden eliminada!', {
                    icon: <i className="ri-file-excel-fill text-red-700"></i>,
                });
                setOrders(orders.filter(order => order.orderId !== orderId));
                setIsDeleteModalOpen(false);
            } else {
                toast.error("Hubo un error. \n Póngase en contacto con el soporte del sistema.", { duration: 6000 });
                console.error('No se pudo eliminar el pedido:', response);
            }
        } catch (error) {
            toast.error("Hubo un error. \n Póngase en contacto con el soporte del sistema.", { duration: 6000 });
            console.error('Error al eliminar el pedido:', error);
        }
    };

    // Function redirect to order view page
    const redirectToOrderView = (orderId) => {
        window.location.href = `/manager?tab=view-order&order=${orderId}`;
    };

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">
            <div className="w-full">
                <div className="max-w-full px-6">

                    <div className="mt-6 md:flex md:items-center md:justify-between">
                        <div className=" inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                            <button onClick={() => setSelectedStatus('All')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${selectedStatus === 'All' && 'bg-gray-100'}`}
                            >
                                Ver todo
                            </button>
                            <button onClick={() => setSelectedStatus('Pending')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${selectedStatus === 'Pending' && 'bg-gray-100'}`}
                            >
                                Pendiente
                            </button>
                            <button onClick={() => setSelectedStatus('Processing')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${selectedStatus === 'Processing' && 'bg-gray-100'}`}
                            >

                                En preparación
                            </button>
                            <button onClick={() => setSelectedStatus('Ready')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${selectedStatus === 'Ready' && 'bg-gray-100'}`}
                            >
                                Listo
                            </button>
                            <button onClick={() => setSelectedStatus('Completed')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${selectedStatus === 'Completed' && 'bg-gray-100'}`}
                            >
                                Completado
                            </button>
                            <button onClick={() => setSelectedStatus('Canceled')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${selectedStatus === 'Canceled' && 'bg-gray-100'}`}
                            >
                                Cancelado
                            </button>
                        </div>
                        <div className=" w-1/2 relative flex items-center mt-4 md:mt-0">
                            <div className="relative flex-1">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <i className="ri-search-line"></i>
                                </div>
                                <input
                                    type={searchCriteria == "date" ? "date" : "search"}
                                    id="default-search"
                                    className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder="Buscar ID de pedido, Cliente..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                />
                                <button
                                    onClick={() => setSearchQuery('')}
                                    type="button"
                                    className="text-white absolute right-1.5 bottom-1.5 bg-orange-500 hover:bg-orange-600 selection:border-none focus:outline-none font-medium rounded-lg text-sm px-2 py-1 dark:bg-orange-500 dark:hover:bg-orange-700"
                                >
                                    Vaciar
                                </button>
                            </div>
                            <div>
                                <select
                                    id="search-criteria"
                                    className=" p-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    value={searchCriteria}
                                    onChange={e => setSearchCriteria(e.target.value)}
                                >
                                    <option value="name">Por nombre</option>
                                    <option value="mobile">Por móvil</option>
                                    <option value="id">Por ID de pedido</option>
                                    <option value="date">Por fecha de pedido</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md my-5">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-gray-100 text-gray-900  dark:bg-gray-700 dark:text-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        # de orden
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Items
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium  text-center">
                                        Total (S/.)
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Nombre del cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Móvil del cliente
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Por
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Fecha y hora
                                    </th>
                                    <th scope="col" className="px-6 py-4 font-medium text-center">
                                        Acción
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100 dark:bg-gray-600 dark:text-gray-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-center">No hay informes para mostrar hoy. Por favor, cree un pedido.</td>
                                    </tr>
                                ) : (
                                    currentItems.map(order => (
                                        <tr onClick={() => redirectToOrderView(order.orderId)} key={order.orderId} className="hover:bg-gray-100 dark:hover:bg-gray-400 cursor-pointer ">
                                            <td className="px-6 py-2 text-center"><a className=' hover:text-green-500' href={`cashier?tab=orders-view&order=${order.orderId}`}>{order.orderId}</a></td>
                                            <td className="px-6 py-2 text-center">
                                                <span className={`inline-flex px-2 py-1 items-center text-white rounded-lg text-xs ${order.orderStatus === "Pending" ? "bg-yellow-300" :
                                                        order.orderStatus === "Processing" ? "bg-blue-300" :
                                                            order.orderStatus === "Ready" ? "bg-green-300" :
                                                                order.orderStatus === "Completed" ? "bg-green-500" :
                                                                    order.orderStatus === "Canceled" ? "bg-red-500" :
                                                                        ""
                                                    }`}
                                                >{order.orderStatus}</span>
                                            </td>
                                            <td className="px-6 py-2 text-center">{order.orderItems.length}</td>
                                            <td className="px-6 py-2 text-center">{order.totalAfterDiscount.toFixed(2)}</td>
                                            <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusName : '-'}</td>
                                            <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusMobile : '-'}</td>
                                            <td className="px-6 py-2 text-center">{order.employeeFirstName} {order.employeeLastName}</td>
                                            <td className="px-6 py-2 text-center text-xs">{formatDate(order.orderDateTime)}</td>
                                            <td className="px-6 py-2">
                                                <div className=" flex items-center justify-center w-full">
                                                    <a href={`/manager?tab=update-order&order=${order.orderId}`} className=" px-2 py-1 text-sm text-white text-center bg-amber-500 rounded-md hover:bg-amber-600">
                                                        <i className="ri-edit-fill"></i> Editar
                                                    </a>
                                                    &nbsp;
                                                    <a onClick={(event) => toggleDeleteModal(order, event)} className=" px-2 py-1 text-sm text-white text-center bg-red-500 rounded-md hover:bg-red-700">
                                                        <i className="ri-delete-bin-2-fill"></i> Eliminar
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="mx-1 px-4 py-2 text-sm font-medium text-gray-700 bg-green-200 rounded-md hover:bg-green-300 focus:outline-none"
                        >
                            <i className="ri-arrow-left-s-line"></i> Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => {
                            // Display numbers if currentPage is more than 3 pages from the first or last page
                            if (
                                index === 1 && currentPage > 3 ||
                                index === totalPages - 2 && currentPage < totalPages - 2
                            ) {
                                return <span key={index}>...</span>;
                            }

                            // Display page numbers
                            if (
                                index === 0 ||
                                index === totalPages - 1 ||
                                (index >= currentPage - 2 && index <= currentPage + 2)
                            ) {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === index + 1 ? 'text-white bg-green-500' : 'text-gray-700 bg-green-200 hover:bg-green-300'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            }

                            return null;
                        })}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="mx-1 px-4 py-2 text-sm font-medium text-gray-700 bg-green-200 rounded-md hover:bg-green-300 focus:outline-none"
                        >
                            Siguiente <i className="ri-arrow-right-s-line"></i>
                        </button>
                    </div>
                </div>
            </div>

            <DeleteOrderModal
                isOpen={isDeleteModalOpen}
                onToggle={toggleDeleteModal}
                onDelete={() => handleDeleteOrder(selectedOrder)}
            />
        </div>
    );
}

