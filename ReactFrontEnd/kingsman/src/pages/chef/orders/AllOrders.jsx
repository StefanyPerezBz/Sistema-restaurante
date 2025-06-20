import React from 'react'
import { Button, Navbar, Accordion, Label, Badge } from "flowbite-react";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { or } from 'firebase/firestore';

export default function AllOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Get today's date
    const today = new Date();

    // Format the date as YYYY-MM-DD
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(today.getDate()).padStart(2, '0');

    // Construct the date string in YYYY-MM-DD format
    const createdDate = `${year}-${month}-${day}`;
    console.log(createdDate);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders/created-date', {
                params: {
                    createdDate: createdDate
                }
            });
            setOrders(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error al recuperar pedidos:', error);
        }
    };

    

    const updateStatusProcessing = async (orderId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/status-update/${orderId}/Processing`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
        }
        fetchOrders();
    }

    const updateStatusCancel = async (orderId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/status-update/${orderId}/Canceled`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
        }
        fetchOrders();
    }

    const updateStatusReady = async (orderID) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/status-update/${orderId}/Ready`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
        }
        fetchOrders();

    }




    return (
        // Top buttons 
        <div className='w-full h-screen bg-gray-100'>
            <div className='m-5 rounded-xl shadow-md'>
                <Navbar fluid rounded>
                    <Navbar.Collapse>
                        <Link to="/chef?tab=allOrders" >
                            <Button color="success" className=' bg-green-500' pill active>
                                Todo : {orders.length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=availableOrders" >
                            <Button color="warning" pill outline >
                                Pedidos disponibles : {orders.filter(order => order.orderStatus === 'Pending').length}

                            </Button>
                        </Link>
                        <Link to="/chef?tab=preparingOrders" >
                            <Button color="purple" pill outline >
                                    Pedidos en preparación : {orders.filter(order => order.orderStatus === 'Processing').length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=finishedOrders">
                            <Button color="success" pill outline >
                                Pedidos finalizados : {orders.filter(order => order.orderStatus === 'Ready').length}
                            </Button>
                        </Link>
                        <Link to="/chef?tab=canceledOrders">
                            <Button color="failure" pill outline>
                                Pedidos cancelados : {orders.filter(order => order.orderStatus === 'Canceled').length}
                            </Button>
                        </Link>
                    </Navbar.Collapse>
                </Navbar>
            </div>

            {/* All Orders */}
            <Label className='text-2xl font-bold m-5'>Todos los pedidos</Label>
            <div className='ml-5 mr-5 w-auto bg-white shadow-md rounded-2xl mt-5'>
                <Accordion collapseAll>
                    {orders.map(order => (
                        <Accordion.Panel key={order.orderId}>
                            <Accordion.Title>
                                <div className=" flex  justify-between w-full ">
                                    <div className={`mr-10 ${order.orderStatus === "Canceled" ? ('mr-8') : order.orderStatus === "Processing" ? ('mr-8') : ('mr-10')}`} >
                                        <Badge size='l' color={order.orderStatus === 'Canceled' ? "failure" :
                                            order.orderStatus === 'Ready' ? "success" : order.orderStatus === 'Processing' ? "purple" : "warning"}>

                                            {order.orderStatus === 'Canceled' ? "Canceled" :
                                                order.orderStatus === 'Ready' ? "Finished" :
                                                    order.orderStatus === 'Processing' ? "Preparing" : "Pending"}
                                        </Badge>
                                    </div>
                                    <div className='space-x-16 '>
                                        <Label >ID de pedido #{order.orderId}</Label>
                                        <Label >Número de mesa: {order.tableNumber}</Label>
                                        <Label >Mesero: {order.firstName}</Label>
                                        <Label >Nombre del artículo : {order.foodName}</Label>


                                    </div>

                                </div>

                            </Accordion.Title>
                            <Accordion.Content>
                                <div className='flex flex-row  justify-between'>
                                    <div className=' basis-2/5'>
                                        <Label className="mb-4"> Nombre del cliente : {order.cusName}   </Label>
                                    </div>
                                    <div className=' basis-2/5'>
                                        <Label className="ml-5"> <label className=' text-red-500'>Nota especial: </label>{order.specialNote} </Label>
                                    </div>



                                    {order.orderStatus === 'Canceled' ? (
                                        <Badge size='l' color="failure" className=''>Cancelado</Badge>
                                    ) : order.orderStatus === 'Ready' ? (
                                        <Badge size='l' color="success" className=''>Terminado</Badge>
                                    ) : order.orderStatus === 'Processing' ? (
                                        <Button color="success" className='m-4  bg-green-500' onClick={() => updateStatusReady(order.orderId)}>
                                            Terminar
                                        </Button>

                                    ) :
                                        (

                                            <>
                                                <Button color="purple" className='m-4 bg-purple-500' onClick={() => updateStatusProcessing(order.orderId)}>
                                                    Preparar
                                                </Button>
                                                <Button color="failure" className='m-4  bg-red-600' onClick={() => updateStatusCancel(order.orderId)}>
                                                    Cancelar
                                                </Button>
                                            </>

                                        )}

                                </div>

                            </Accordion.Content>
                        </Accordion.Panel>
                    ))}
                </Accordion>
            </div>
        </div>

    )
}
