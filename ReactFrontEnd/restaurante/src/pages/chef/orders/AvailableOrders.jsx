

import React from 'react';
import { Accordion, Button, Label, Navbar, Badge } from "flowbite-react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';

export default function AvailableOrders() {
    const [orders, setOrders] = useState([]);
    const [pending, setPending] = useState(true);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'accordion'
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        // Filter orders to only show Pending status
        const availableOrders = orders.filter(order => order.orderStatus === 'Pending');
        setFilteredOrders(availableOrders);
    }, [orders]);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchOrders = async () => {
        try {
            setPending(true);
            const response = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/orders/created-date`, {
                params: {
                    createdDate: getTodayDate()
                }
            });
            setOrders(response.data);
            setPending(false);
        } catch (error) {
            console.error('Error al recuperar pedidos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los pedidos',
                confirmButtonColor: '#3085d6'
            });
            setPending(false);
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        const actionText = {
            'Processing': 'preparar',
            'Canceled': 'cancelar'
        }[status];

        const result = await Swal.fire({
            title: `¿Estás seguro de ${actionText} este pedido?`,
            text: `El estado cambiará a "${status}"`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`${import.meta.env.REACT_APP_API_URL}/api/orders/status-update/${orderId}/${status}`);
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: `Pedido marcado como ${status}`,
                    confirmButtonColor: '#3085d6'
                });
                fetchOrders();
            } catch (error) {
                console.error(`Error al actualizar el estado del pedido a ${status}:`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se pudo ${actionText} el pedido`,
                    confirmButtonColor: '#3085d6'
                });
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Canceled': { color: "failure", text: "Cancelado" },
            'Ready': { color: "success", text: "Terminado" },
            'Processing': { color: "purple", text: "Preparando" },
            'Pending': { color: "warning", text: "Pendiente" }
        };
        const { color, text } = statusMap[status] || { color: "gray", text: status };
        return <Badge color={color} className="whitespace-nowrap">{text}</Badge>;
    };

    const columns = [
        {
            name: 'ID Pedido',
            selector: row => `#${row.orderId}`,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Mesa',
            selector: row => row.tableNumber,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Mesero',
            selector: row => row.firstName,
            sortable: true
        },
        {
            name: 'Artículo',
            selector: row => row.foodName,
            sortable: true
        },
        {
            name: 'Cliente',
            selector: row => row.cusName,
            sortable: true
        },
        {
            name: 'Nota Especial',
            cell: row => (
                <span className={row.specialNote ? 'text-red-500' : 'text-gray-400'}>
                    {row.specialNote || 'Ninguna'}
                </span>
            )
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="flex space-x-2">
                    <Button color="purple" size="sm" onClick={() => handleStatusUpdate(row.orderId, 'Processing')}>
                        Preparar
                    </Button>
                    <Button color="failure" size="sm" onClick={() => handleStatusUpdate(row.orderId, 'Canceled')}>
                        Cancelar
                    </Button>
                </div>
            ),
            width: '200px'
        }
    ];

    const customStyles = {
        rows: {
            style: {
                minHeight: '72px',
            },
        },
        headCells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: '#f9fafb',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    return (
        <div className='w-full min-h-screen bg-gray-100 p-4'>
            <div className='mb-5 rounded-xl shadow-md'>
                <Navbar fluid rounded>
                    <Navbar.Collapse className="flex flex-wrap justify-center md:justify-start">
                        <Link to="/chef?tab=allOrders" className="m-1">
                            <Button color="success" className='bg-green-500' pill outline>
                                Todo: {orders.length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=availableOrders" className="m-1">
                            <Button color="warning" pill active>
                                Pendientes: {filteredOrders.length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=preparingOrders" className="m-1">
                            <Button color="purple" pill outline>
                                En preparación: {orders.filter(order => order.orderStatus === 'Processing').length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=finishedOrders" className="m-1">
                            <Button color="success" pill outline>
                                Terminados: {orders.filter(order => order.orderStatus === 'Ready').length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=canceledOrders" className="m-1">
                            <Button color="failure" pill outline>
                                Cancelados: {orders.filter(order => order.orderStatus === 'Canceled').length}
                            </Button>
                        </Link>
                        <div className="m-1">
                            <Button 
                                color={viewMode === 'table' ? 'blue' : 'gray'} 
                                pill 
                                onClick={() => setViewMode(viewMode === 'table' ? 'accordion' : 'table')}
                            >
                                {viewMode === 'table' ? 'Ver en Acordeón' : 'Ver en Tabla'}
                            </Button>
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </div>

            <Label className='text-2xl font-bold mb-4'>Pedidos disponibles - {new Date().toLocaleDateString()}</Label>
            
            {viewMode === 'table' ? (
                <div className="bg-white shadow-md rounded-2xl p-4 overflow-x-auto">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No hay pedidos disponibles</p>
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredOrders}
                            customStyles={customStyles}
                            progressPending={pending}
                            pagination
                            responsive
                            highlightOnHover
                            noDataComponent={<div className="py-4">No hay pedidos disponibles</div>}
                        />
                    )}
                </div>
            ) : (
                <div className='ml-5 mr-5 w-auto bg-white shadow-md rounded-2xl mt-5'>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No hay pedidos disponibles</p>
                        </div>
                    ) : (
                        <Accordion collapseAll>
                            {filteredOrders.map(order => (
                                <Accordion.Panel key={order.orderId}>
                                    <Accordion.Title>
                                        <div className="flex justify-between">
                                            <div className='mr-10'>
                                                {getStatusBadge(order.orderStatus)}
                                            </div>
                                            <div className='space-x-16 w-full'>
                                                <Label>Número de orden #{order.orderId}</Label>
                                                <Label>Número de mesa: {order.tableNumber}</Label>
                                                <Label>Mesero: {order.firstName}</Label>
                                                <Label>Item: {order.foodName}</Label>
                                            </div>
                                        </div>
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className='flex flex-row justify-between'>
                                            <div className='basis-2/5'>
                                                <Label className="mb-4">Nombre del cliente: {order.cusName}</Label>
                                            </div>
                                            <div className='basis-2/5'>
                                                <Label className="ml-5">
                                                    <label className='text-red-500'>Nota especial: </label>
                                                    {order.specialNote || 'Ninguna'}
                                                </Label>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button color="purple" className='m-4 bg-purple-500' onClick={() => handleStatusUpdate(order.orderId, 'Processing')}>
                                                    Preparar
                                                </Button>
                                                <Button color="failure" className='m-4 bg-red-600' onClick={() => handleStatusUpdate(order.orderId, 'Canceled')}>
                                                    Cancelar
                                                </Button>
                                            </div>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                            ))}
                        </Accordion>
                    )}
                </div>
            )}
        </div>
    );
}