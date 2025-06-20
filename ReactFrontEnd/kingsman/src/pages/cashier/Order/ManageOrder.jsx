import React, { useState, useEffect } from 'react';

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [selectedStatus, setSelectedStatus] = useState('Ready');
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
                return new Date(date).toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
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
    
    // Function redirect to order view page
    const redirectToOrderView = (orderId) => {
        window.location.href = `/cashier?tab=orders-view&order=${orderId}`;
    };

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5">
            <div className="w-full">
                <div className="max-w-full px-6">

                    <div className="mt-6 md:flex md:items-center md:justify-between">
                        <div className=" inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                            <button  onClick={() => setSelectedStatus('All')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${
                                selectedStatus === 'All' && 'bg-gray-100'}`}
                            >                            
                               Ver todo
                            </button>
                            <button onClick={() => setSelectedStatus('Pending')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${
                                selectedStatus === 'Pending' && 'bg-gray-100'}`}
                            >                                
                                Pendiente
                            </button>
                            <button  onClick={() => setSelectedStatus('Processing')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${
                                selectedStatus === 'Processing' && 'bg-gray-100'}`}
                            >
                                En Proceso
                            </button>
                            <button  onClick={() => setSelectedStatus('Ready')}
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${
                                selectedStatus === 'Ready' && 'bg-gray-100'}`}
                            >                                
                                Listo
                            </button>
                            <button onClick={() => setSelectedStatus('Completed')} 
                                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 sm:text-sm dark:bg-gray-800 dark:text-gray-300 ${
                                selectedStatus === 'Completed' && 'bg-gray-100'}`}
                            >                                
                                Completado
                            </button>
                        </div>
                        <div className=" w-1/2 relative flex items-center mt-4 md:mt-0">
                                <div className="relative flex-1">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <i className="ri-search-line"></i>
                                    </div>
                                    <input
                                        type="search"
                                        id="default-search"
                                        className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Buscar ID de pedido, cliente..."
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
                                        Número de móvil de cliente
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
                                        <td colSpan="9" className="px-6 py-4 text-center">No hay reportes para ver hoy. Por favor, crea una nueva orden.</td>
                                    </tr>
                                ) : (
                                    currentItems.map(order => (
                                        <tr onClick={() => redirectToOrderView(order.orderId)} key={order.orderId} className="hover:bg-gray-100 dark:hover:bg-gray-400 cursor-pointer ">
                                            <td className="px-6 py-2 text-center"><a className=' hover:text-green-500' href={`cashier?tab=orders-view&order=${order.orderId}`}>{order.orderId}</a></td>
                                            <td className="px-6 py-2 text-center">
                                                    <span className={`inline-flex px-2 py-1 items-center text-white rounded-lg text-xs ${
                                                                        order.orderStatus === "Pending" ? "bg-yellow-300" :
                                                                        order.orderStatus === "Processing" ? "bg-blue-300" :
                                                                        order.orderStatus === "Ready" ? "bg-green-300" :
                                                                        order.orderStatus === "Completed" ? "bg-green-500" :
                                                                        ""
                                                                    }`}
                                                    >{order.orderStatus}</span>
                                            </td>
                                            <td className="px-6 py-2 text-center">{order.orderItems.length}</td>
                                            <td className="px-6 py-2 text-center">{order.totalAfterDiscount.toFixed(2)}</td>
                                            <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusName : '-'}</td>
                                            <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusMobile : '-'}</td>
                                            <td className="px-6 py-2 text-center text-xs">{formatDate(order.orderDateTime)}</td>
                                            <td className="px-6 py-2">
                                                <div className=" flex items-center justify-center w-full">
                                                    { order.orderStatus == "Ready" ? (
                                                            <a href={`/cashier?tab=bill&order=${order.orderId}`} className=" px-2 py-1 text-sm text-white text-center bg-green-500 rounded-md hover:bg-green-700">
                                                                <i className="ri-arrow-right-s-fill"></i> Procesar
                                                            </a>
                                                        ):
                                                        "Processing not permitted"
                                                    }
                                                </div>
                                                
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {   filteredOrders.length != 0 &&  
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
                                    className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${
                                        currentPage === index + 1 ? 'text-white bg-green-500' : 'text-gray-700 bg-green-200 hover:bg-green-300'
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
                                Anterior <i className="ri-arrow-right-s-line"></i>
                            </button>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

