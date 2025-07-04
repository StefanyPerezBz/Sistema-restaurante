import React from 'react'
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaChartPie } from "react-icons/fa";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { logOutSuccess } from '../redux/user/userSlice';
import { RiUserShared2Fill } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";



export default function CashierSideBar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    const handleLogOut = async () => {
        try {
            dispatch(logOutSuccess());
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/cashier?tab=dashboard'>
                        <Sidebar.Item active={tab === 'dashboard'} icon={FaChartPie} as='div'>
                            Inicio
                        </Sidebar.Item>
                    </Link>
                    
                    <Sidebar.Collapse label='Asistencia' icon={HiUser}>
                        <Link to='/cashier?tab=addAttendance'>
                            <Sidebar.Item active={tab === 'addAttendance'} icon={RiUserShared2Fill } as='div'> Agregar </Sidebar.Item>
                        </Link>
                        <Link to='/cashier?tab=viewAttendance'>
                            <Sidebar.Item active={tab === 'viewAttendance'} icon={HiOutlineUsers } as='div'> Ver </Sidebar.Item>
                        </Link>

                    </Sidebar.Collapse>

                    <Link to='/cashier?tab=orders'>
                        <Sidebar.Item active={tab === 'orders'} icon={MdOutlineRestaurantMenu} as='div'>
                            Órdenes
                        </Sidebar.Item>
                    </Link>
                    <Link to='/cashier?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Cajero"} labelColor='red' as='div'>
                            Perfil
                        </Sidebar.Item>
                    </Link>

                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogOut} >
                        Salir
                    </Sidebar.Item>


                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
