import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiCoinStack } from "react-icons/bi";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiClipboardCheck, HiOutlineUsers } from "react-icons/hi";
import { IoFastFoodOutline } from "react-icons/io5";
import { RiUserShared2Fill } from "react-icons/ri";
import { logOutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaChartPie } from "react-icons/fa";

export default function ChefSideBar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
        if (currentUser) {
            fetchOrders();
        }
    }, [location.search, currentUser]);

    const handleLogOut = async () => {
        try {
            dispatch(logOutSuccess());
        } catch (error) {
            console.log(error.message);
        }
    }

    // Get today's date
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const createdDate = `${year}-${month}-${day}`;

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orders/created-date`, {
                params: { createdDate }
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <Sidebar className='w-full md:w-56 h-full'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <div className='h-full'>
                        <div className=''>
                            <Link to='/chef?tab=dashboard'>
                                <Sidebar.Item active={tab === 'dashboard'} icon={FaChartPie} as='div'>
                                    Inicio
                                </Sidebar.Item>
                            </Link>
                            <Link to='/chef?tab=inventory'>
                                <Sidebar.Item active={tab === 'inventory'} icon={BiCoinStack} as='div'>
                                    Inventario
                                </Sidebar.Item>
                            </Link>
                            <Link to='/chef?tab=allFood'>
                                <Sidebar.Item active={tab === 'allFood'} icon={IoFastFoodOutline} as='div'>
                                    Menú
                                </Sidebar.Item>
                            </Link>
                            <Sidebar.Collapse 
                                icon={HiClipboardCheck} 
                                label={`Órdenes - ${orders.filter(order =>
                                    ["Pending", "Processing", "Canceled", "Ready", "Completed"].includes(order.orderStatus)
                                ).length}`} 
                                className='w-full'
                            >
                                <Link to='/chef?tab=allOrders'>
                                    <Sidebar.Item className='ml-0 justify-self-start' active={tab === 'allOrders'}>Todas las órdenes</Sidebar.Item>
                                </Link>
                                <Link to='/chef?tab=availableOrders'>
                                    <Sidebar.Item className='ml-0 justify-self-start' active={tab === 'availableOrders'}>Órdenes disponibles</Sidebar.Item>
                                </Link>
                                <Link to='/chef?tab=preparingOrders'>
                                    <Sidebar.Item className='ml-0 justify-self-start' active={tab === 'preparingOrders'}>Órdenes en preparación</Sidebar.Item>
                                </Link>
                                <Link to='/chef?tab=finishedOrders'>
                                    <Sidebar.Item active={tab === 'finishedOrders'}>Órdenes finalizadas</Sidebar.Item>
                                </Link>
                                <Link to='/chef?tab=canceledOrders'>
                                    <Sidebar.Item active={tab === 'canceledOrders'}>Órdenes canceladas</Sidebar.Item>
                                </Link>
                            </Sidebar.Collapse>
                        </div>
                        <Sidebar.Collapse label='Asistencia' icon={HiUser}>
                            <Link to='/chef?tab=addAttendance'>
                                <Sidebar.Item active={tab === 'addAttendance'} icon={RiUserShared2Fill} as='div'>Agregar</Sidebar.Item>
                            </Link>
                            <Link to='/chef?tab=viewAttendance'>
                                <Sidebar.Item active={tab === 'viewAttendance'} icon={HiOutlineUsers} as='div'>Ver</Sidebar.Item>
                            </Link>
                        </Sidebar.Collapse>
                        <div className='mt-auto'>
                            <Link to='/chef?tab=profile'>
                                <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Chef"} labelColor='dark' as='div'>
                                    Perfil
                                </Sidebar.Item>
                            </Link>
                            <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogOut}>
                                Salir
                            </Sidebar.Item>
                        </div>
                    </div>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}