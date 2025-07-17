
import React, { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [originalOrders, setOriginalOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusOptions = [
        { value: 'All', label: 'Ver todo' },
        { value: 'Pending', label: 'Pendiente' },
        { value: 'Processing', label: 'En preparación' },
        { value: 'Ready', label: 'Listo' },
        { value: 'Completed', label: 'Completado' },
        { value: 'Canceled', label: 'Cancelado' }
    ];

    // Search criteria options for Select2
    const searchCriteriaOptions = [
        { value: 'name', label: 'Por nombre' },
        { value: 'mobile', label: 'Por móvil' },
        { value: 'id', label: 'Por ID de pedido' },
        { value: 'date', label: 'Por fecha de pedido' }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/orders');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setOrders(data);
            setOriginalOrders(data); 
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.message);
            setIsLoading(false);
            showErrorAlert('Error al cargar pedidos', error.message);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (selectedStatus !== 'All' && order.orderStatus !== selectedStatus) {
                return false;
            }

            if (searchQuery.trim() !== "") {
                if (searchCriteria === 'id') {
                    return order.orderId.toString().includes(searchQuery);
                } else if (searchCriteria === 'name') {
                    return order.customer && order.customer.cusName.toLowerCase().includes(searchQuery.toLowerCase());
                } else if (searchCriteria === 'mobile') {
                    return order.customer && order.customer.cusMobile && order.customer.cusMobile.includes(searchQuery);
                } else if (searchCriteria === 'date') {
                    try {
                        const orderDate = new Date(order.orderDateTime);
                        const searchDate = new Date(searchQuery);
                        return orderDate.toDateString() === searchDate.toDateString();
                    } catch (e) {
                        return false;
                    }
                }
            }
            return true; 
        });
    }, [orders, searchQuery, searchCriteria, selectedStatus]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = date.getHours() % 12 || 12;
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const period = date.getHours() < 12 ? 'AM' : 'PM';
            return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
        } catch (e) {
            return 'Fecha inválida';
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const showDeleteConfirmation = (order) => {
        MySwal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar el pedido #${order.orderId}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteOrder(order);
            }
        });
    };

    const handleDeleteOrder = async (order) => {
        const orderId = order.orderId;
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'DELETE'
            });

            if (response.status === 204 || response.ok) {
                await axios.put(`http://localhost:8080/api/table/${order.tableNumber}/availability?availability=true`);

                MySwal.fire({
                    title: '¡Eliminado!',
                    text: `El pedido #${orderId} ha sido eliminado.`,
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

                setOrders(prev => prev.filter(o => o.orderId !== orderId));
                setOriginalOrders(prev => prev.filter(o => o.orderId !== orderId));
            } else {
                showErrorAlert('Error al eliminar', 'No se pudo eliminar el pedido. Por favor, intente nuevamente.');
                console.error('No se pudo eliminar el pedido:', response);
            }
        } catch (error) {
            showErrorAlert('Error al eliminar', error.message);
            console.error('Error al eliminar el pedido:', error);
        }
    };

    const showErrorAlert = (title, text) => {
        MySwal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    };

    const redirectToOrderView = (orderId, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        window.location.href = `/manager?tab=view-order&order=${orderId}`;
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSearchCriteria('name');
        setSelectedStatus('All');
        setCurrentPage(1);
        setOrders(originalOrders);

        MySwal.fire({
            title: 'Filtros reiniciados',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption.value);
        setCurrentPage(1); 
    };

    const handleSearchCriteriaChange = (selectedOption) => {
        setSearchCriteria(selectedOption.value);
        setSearchQuery(''); 
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisibleButtons = 5;

        buttons.push(
            <button
                key={1}
                onClick={() => handlePageChange(1)}
                className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === 1 ? 'text-white bg-green-500' : 'text-gray-700 bg-green-200 hover:bg-green-300'}`}
            >
                1
            </button>
        );

        if (totalPages > 1) {
            if (currentPage > maxVisibleButtons - 1) {
                buttons.push(<span key="start-ellipsis" className="mx-1 px-2 py-2">...</span>);
            }

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= maxVisibleButtons - 1) {
                endPage = maxVisibleButtons;
            } else if (currentPage >= totalPages - (maxVisibleButtons - 2)) {
                startPage = totalPages - (maxVisibleButtons - 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                if (i > 1 && i < totalPages) {
                    buttons.push(
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === i ? 'text-white bg-green-500' : 'text-gray-700 bg-green-200 hover:bg-green-300'}`}
                        >
                            {i}
                        </button>
                    );
                }
            }

            // Show ellipsis if current page is more than 3 pages from the end
            if (currentPage < totalPages - (maxVisibleButtons - 2)) {
                buttons.push(<span key="end-ellipsis" className="mx-1 px-2 py-2">...</span>);
            }

            // Always show last page if there's more than one page
            if (totalPages > 1) {
                buttons.push(
                    <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === totalPages ? 'text-white bg-green-500' : 'text-gray-700 bg-green-200 hover:bg-green-300'}`}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return buttons;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-500";
            case "Processing": return "bg-blue-500";
            case "Ready": return "bg-green-500";
            case "Completed": return "bg-green-500";
            case "Canceled": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="w-full bg-white dark:bg-gray-700 rounded-lg shadow py-5">
            <div className="w-full">
                <div className="max-w-full px-6">
                    <div className="mt-6 md:flex md:items-center md:justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-48">
                                <Select
                                    options={statusOptions}
                                    value={statusOptions.find(option => option.value === selectedStatus)}
                                    onChange={handleStatusChange}
                                    components={animatedComponents}
                                    classNamePrefix="select"
                                    placeholder="Filtrar por estado"
                                    isSearchable={false}
                                />
                            </div>

                            <button
                                onClick={resetFilters}
                                className="px-3 py-2 text-xs font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                            >
                                <i className="ri-refresh-line mr-1"></i> Reiniciar
                            </button>
                        </div>

                        <div className="w-1/2 relative flex items-center mt-4 md:mt-0">
                            <div className="relative flex-1">
                                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                    <i className="ri-search-line"></i>
                                </div>
                                <input
                                    type={searchCriteria === "date" ? "date" : "search"}
                                    id="default-search"
                                    className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    placeholder={`Buscar ${searchCriteria === 'id' ? 'ID de pedido' :
                                        searchCriteria === 'name' ? 'nombre de cliente' :
                                            searchCriteria === 'mobile' ? 'móvil de cliente' :
                                                'fecha de pedido'}...`}
                                    value={searchQuery}
                                    onChange={e => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        type="button"
                                        className="text-white absolute right-1.5 bottom-1.5 bg-orange-500 hover:bg-orange-600 selection:border-none focus:outline-none font-medium rounded-lg text-sm px-2 py-1 dark:bg-orange-500 dark:hover:bg-orange-700"
                                    >
                                        <i className="ri-close-line"></i>
                                    </button>
                                )}
                            </div>
                            <div className="w-40 ml-2">
                                <Select
                                    options={searchCriteriaOptions}
                                    value={searchCriteriaOptions.find(option => option.value === searchCriteria)}
                                    onChange={handleSearchCriteriaChange}
                                    components={animatedComponents}
                                    classNamePrefix="select"
                                    placeholder="Buscar por"
                                    isSearchable={false}
                                />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                            Error al cargar los pedidos: {error}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md my-5">
                                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                    <thead className="bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-4 font-medium text-center"># de orden</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Estado</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Cantidad</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Total (S/.)</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Nombre del cliente</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Móvil del cliente</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Por</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Fecha y hora</th>
                                            <th scope="col" className="px-6 py-4 font-medium text-center">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border-t border-gray-100 dark:bg-gray-600 dark:text-gray-50">
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="9" className="px-6 py-4 text-center">
                                                    No se encontraron pedidos con los filtros actuales.
                                                </td>
                                            </tr>
                                        ) : (
                                            currentItems.map(order => (
                                                <tr
                                                    key={order.orderId}
                                                    className="hover:bg-gray-100 dark:hover:bg-gray-400 cursor-pointer"
                                                    onClick={(e) => {
                                                        
                                                        if (!e.target.closest('button, a')) {
                                                            redirectToOrderView(order.orderId, e);
                                                        }
                                                    }}
                                                >
                                                    <td className="px-6 py-2 text-center">
                                                        <a
                                                            href={`/manager?tab=view-order&order=${order.orderId}`}
                                                            className="hover:text-green-500 font-medium"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            {order.orderId}
                                                        </a>
                                                    </td>
                                                    <td className="px-6 py-2 text-center">
                                                        <span className={`inline-flex px-2 py-1 items-center text-white rounded-lg text-xs ${getStatusColor(order.orderStatus)}`}>
                                                            {statusOptions.find(opt => opt.value === order.orderStatus)?.label || order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-2 text-center">{order.orderItems.length}</td>
                                                    <td className="px-6 py-2 text-center">{order.totalAfterDiscount?.toFixed(2) || '0.00'}</td>
                                                    <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusName : '-'}</td>
                                                    <td className="px-6 py-2 text-center">{order.customer ? order.customer.cusMobile : '-'}</td>
                                                    <td className="px-6 py-2 text-center">
                                                        {order.employeeFirstName} {order.employeeLastName}
                                                    </td>
                                                    <td className="px-6 py-2 text-center text-xs">
                                                        {formatDate(order.orderDateTime)}
                                                    </td>
                                                    <td className="px-6 py-2">
                                                        <div className="flex items-center justify-center space-x-2 w-full">
                                                            <a
                                                                href={`/manager?tab=update-order&order=${order.orderId}`}
                                                                className="px-2 py-1 text-sm text-white text-center bg-amber-500 rounded-lg hover:bg-amber-600"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <i className="ri-edit-fill"></i>
                                                            </a>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    showDeleteConfirmation(order);
                                                                }}
                                                                className="px-2 py-1 text-sm text-white text-center bg-red-500 rounded-lg hover:bg-red-700"
                                                            >
                                                                <i className="ri-delete-bin-2-fill"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {filteredOrders.length > 0 && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === 1 ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-gray-700 bg-green-200 hover:bg-green-300'}`}
                                    >
                                        <i className="ri-arrow-left-s-line"></i> Anterior
                                    </button>

                                    {renderPaginationButtons()}

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`mx-1 px-4 py-2 text-sm font-medium rounded-md focus:outline-none ${currentPage === totalPages ? 'text-gray-400 bg-gray-200 cursor-not-allowed' : 'text-gray-700 bg-green-200 hover:bg-green-300'}`}
                                    >
                                        Siguiente <i className="ri-arrow-right-s-line"></i>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}