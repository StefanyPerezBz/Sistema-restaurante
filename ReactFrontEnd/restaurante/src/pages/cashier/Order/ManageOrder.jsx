import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function ManageOrder() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('name');
    const [selectedStatus, setSelectedStatus] = useState('Ready');
    const [loading, setLoading] = useState(true);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, searchQuery, searchCriteria, selectedStatus]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8080/api/orders/all-orders-general`);
            const data = await response.json();

            const formatDate = (date) => {
                return new Date(date).toLocaleDateString('es-PE', { timeZone: 'America/Lima' });
            };

            const today = formatDate(new Date());
            const todayOrders = data.filter(order => {
                const orderDate = formatDate(order.orderDateTime);
                return orderDate === today;
            });

            setOrders(todayOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar los pedidos',
                confirmButtonColor: '#3085d6',
            });
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let result = orders.filter(order => {
            if (selectedStatus !== 'All' && order.orderStatus !== selectedStatus) {
                return false;
            }

            if (searchQuery) {
                if (searchCriteria === 'id') {
                    return order.orderId.toString().includes(searchQuery);
                } else if (searchCriteria === 'name') {
                    return order.customer && order.customer.cusName.toLowerCase().includes(searchQuery.toLowerCase());
                } else if (searchCriteria === 'mobile') {
                    return order.customer && order.customer.cusMobile && order.customer.cusMobile.includes(searchQuery);
                }
            }
            return true;
        });

        setFilteredOrders(result);
        setResetPaginationToggle(!resetPaginationToggle);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = date.getHours() % 12 || 12;
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = date.getHours() < 12 ? 'AM' : 'PM';
        return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
    };

    const redirectToOrderView = (orderId) => {
        navigate(`/cashier?tab=orders-view&order=${orderId}`);
    };

    const handleProcessOrder = (orderId) => {
        Swal.fire({
            title: '¿Procesar pedido?',
            text: '¿Deseas proceder con el pago de este pedido?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, procesar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/cashier?tab=bill&order=${orderId}`);
            }
        });
    };

    const columns = [
        {
            name: '# Orden',
            selector: row => row.orderId,
            sortable: true,
            center: true,
            cell: row => (
                <span
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => redirectToOrderView(row.orderId)}
                >
                    {row.orderId}
                </span>
            )
        },
        {
            name: 'Estado',
            selector: row => row.orderStatus,
            sortable: true,
            center: true,
            cell: row => {
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

                const translated = statusMap[row.orderStatus] || row.orderStatus;
                const bgColor = colorClass[row.orderStatus] || "bg-gray-300";

                return (
                    <span className={`inline-flex px-2 py-1 items-center text-white rounded-lg text-xs ${bgColor}`}>
                        {translated}
                    </span>
                );
            }
        },

        {
            name: 'Cantidad',
            selector: row => row.orderItems.length,
            sortable: true,
            center: true
        },
        {
            name: 'Total (S/.)',
            selector: row => row.totalAfterDiscount.toFixed(2),
            sortable: true,
            center: true
        },
        {
            name: 'Cliente',
            selector: row => row.customer ? row.customer.cusName : '-',
            sortable: true,
            center: true
        },
        {
            name: 'Móvil',
            selector: row => row.customer ? row.customer.cusMobile : '-',
            sortable: true,
            center: true
        },
        {
            name: 'Fecha',
            selector: row => formatDate(row.orderDateTime),
            sortable: true,
            center: true,
            width: '160px'
        },
        {
            name: 'Acciones',
            center: true,
            cell: row => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => redirectToOrderView(row.orderId)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        <i className="ri-eye-line"></i>
                    </button>
                    {row.orderStatus === "Ready" && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleProcessOrder(row.orderId);
                            }}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Procesar
                        </button>
                    )}
                </div>
            )
        }
    ];

    const statusFilterOptions = [
        { label: 'Ver todo', value: 'All' },
        { label: 'Pendiente', value: 'Pending' },
        { label: 'En Proceso', value: 'Processing' },
        { label: 'Listo', value: 'Ready' },
        { label: 'Completado', value: 'Completed' }
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f8fafc',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                color: '#334155',
                '@media (max-width: 640px)': {
                    fontSize: '0.75rem',
                }
            },
        },
        cells: {
            style: {
                padding: '0.5rem',
                '@media (max-width: 640px)': {
                    fontSize: '0.75rem',
                    padding: '0.25rem',
                }
            },
        },
    };

    const subHeaderComponent = (
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mb-4">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                {statusFilterOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setSelectedStatus(option.value)}
                        className={`px-3 py-1 text-xs font-medium transition-colors duration-200 sm:text-sm ${selectedStatus === option.value
                                ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
                                : 'text-gray-600 dark:text-gray-300 dark:bg-gray-800'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <i className="ri-search-line text-gray-400"></i>
                    </div>
                    <input
                        type="search"
                        className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <i className="ri-close-line"></i>
                        </button>
                    )}
                </div>

                <select
                    className="p-2 text-sm bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-0 focus:border-gray-300 dark:bg-slate-600 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={searchCriteria}
                    onChange={e => setSearchCriteria(e.target.value)}
                >
                    <option value="name">Por nombre</option>
                    <option value="mobile">Por móvil</option>
                    <option value="id">Por ID</option>
                </select>
            </div>
        </div>
    );

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-500 py-5 rounded-lg shadow">
            <div className="w-full px-4 md:px-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 md:p-6">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        Gestión de Pedidos
                    </h1>

                    <div className="overflow-x-auto">
                        <DataTable
                            columns={columns}
                            data={filteredOrders}
                            progressPending={loading}
                            progressComponent={
                                <div className="py-8 flex justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            }
                            noDataComponent={
                                <div className="py-8 text-center text-gray-500 dark:text-gray-300">
                                    No hay pedidos para mostrar
                                </div>
                            }
                            customStyles={customStyles}
                            pagination
                            paginationResetDefaultPage={resetPaginationToggle}
                            paginationPerPage={10}
                            paginationRowsPerPageOptions={[10, 20, 30]}
                            paginationComponentOptions={{
                                rowsPerPageText: 'Filas por página:',
                                rangeSeparatorText: 'de',
                                noRowsPerPage: false,
                                selectAllRowsItem: false
                            }}
                            subHeader
                            subHeaderComponent={subHeaderComponent}
                            responsive
                            highlightOnHover
                            pointerOnHover
                            onRowClicked={row => redirectToOrderView(row.orderId)}
                            className="border rounded-lg overflow-hidden"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}