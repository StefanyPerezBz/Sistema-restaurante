import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiCoinStack } from "react-icons/bi";
import { Sidebar, SidebarCollapse } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { BsPersonFillCheck } from "react-icons/bs";
import { logOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { BsFillPeopleFill } from "react-icons/bs";
import { MdEvent } from "react-icons/md";
import { FaMoneyBillTrendUp,FaMoneyBill,FaMoneyBillTransfer } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { MdOutlineTableBar } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";


export default function ManagerSideBar() {
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
                <Link to='/manager?tab=dashboard'>
                        <Sidebar.Item active={tab === 'dashboard'}icon={FaChartPie} as='div' >
                            Inicio
                        </Sidebar.Item>
                    </Link>
                    <Link to='/manager?tab=inventory'>
                        <Sidebar.Item active={tab === 'inventory'} icon={BiCoinStack} as='div' >
                            Inventario
                        </Sidebar.Item>
                    </Link>
                    <Link to='/manager?tab=attendance'>
                        <Sidebar.Item active={tab === 'attendance'} icon={BsPersonFillCheck} as='div'>
                            Asistencia
                        </Sidebar.Item>
                    </Link>
                     

                    <Sidebar.Collapse label='Salario' icon={FaMoneyBillTrendUp}>
                        <Link to='/manager?tab=salary'>
                            <Sidebar.Item active={tab === 'monthly-salary'} icon={FaMoneyBill} as='div'> Salario mensual </Sidebar.Item>
                        </Link>
                        <Link to='/manager?tab=earnings'>
                            <Sidebar.Item active={tab === 'earnings'} icon={FaMoneyBillTransfer} as='div'>B y D </Sidebar.Item>
                        </Link>
                        <Link to='/manager?tab=hourpayments'>
                            <Sidebar.Item active={tab === 'hour-payments'} icon={FaMoneyBillTransfer} as='div'>Pago por horas </Sidebar.Item>
                        </Link>

                    </Sidebar.Collapse>    



                    
                    <Link to='/manager?tab=view-all-employees'>
                        <Sidebar.Item active={tab === 'view-all-employees'} icon={BsFillPeopleFill} as='div'>
                            Empleados
                        </Sidebar.Item>
                    </Link>
                    <Link to='/manager?tab=view-all-events'>
                        <Sidebar.Item active={tab === 'view-all-events'} icon={MdEvent} as='div'>
                            Eventos
                        </Sidebar.Item>
                    </Link>

                    <Link to='/manager?tab=manage-orders'>
                        <Sidebar.Item active={tab === 'manage-orders'} icon={MdRestaurantMenu} as='div'>
                           Gestionar pedidos
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Collapse label='Reportes' icon={FaMoneyBillTrendUp}>
                        <Link to='/manager?tab=monthly-profit'>
                            <Sidebar.Item active={tab === 'monthly-profit'} icon={FaMoneyBillTrendUp} as='div'> Resporte mensual </Sidebar.Item>
                        </Link>
                        <Link to='/manager?tab=annual-income'>
                            <Sidebar.Item active={tab === 'annual-income'} icon={FaMoneyBillTrendUp} as='div'>  Reporte anual </Sidebar.Item>
                        </Link>

                    </Sidebar.Collapse>
                    <Sidebar.Collapse label='Mesas' icon={IoSettings}>
                        <Link to='/manager?tab=table-manage'>
                            <Sidebar.Item active={tab === 'table-manage'} icon={MdOutlineTableBar} as='div'> Gestionar mesas </Sidebar.Item>
                        </Link>
                    </Sidebar.Collapse>
                    
                    <Link to = '/manager?tab=billPayments'>
                        <Sidebar.Item active={tab === 'billPayments'} icon={MdOutlineRestaurantMenu} as='div'> Gestión de tareas </Sidebar.Item>
                    </Link>

                    <Link to='/manager?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Gerente"} labelColor='success' as='div'>
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
