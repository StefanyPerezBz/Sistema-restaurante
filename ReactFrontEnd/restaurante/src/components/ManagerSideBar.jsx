import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiCoinStack } from "react-icons/bi";
import { Sidebar, SidebarCollapse } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiOutlineUsers } from "react-icons/hi";
import { BsPersonFillCheck } from "react-icons/bs";
import { logOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { BsFillPeopleFill } from "react-icons/bs";
import { MdEvent } from "react-icons/md";
import { FaMoneyBillTrendUp, FaMoneyBill, FaMoneyBillTransfer } from "react-icons/fa6";
import { MdRestaurantMenu } from "react-icons/md";
import { FaChartPie } from "react-icons/fa";
import { MdOutlineTableBar } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { RiUserShared2Fill } from "react-icons/ri";


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
        // <Sidebar className='w-full md:w-56 bg-white dark:bg-gray-800' aria-label="Sidebar">
        //     <Sidebar.Items>
        //         <Sidebar.ItemGroup>
        //         <Link to='/manager?tab=dashboard'>
        //                 <Sidebar.Item 
        //                 active={tab === 'dashboard'}
        //                 icon={FaChartPie} 
        //                 as='div' >
        //                     Inicio
        //                 </Sidebar.Item>
        //             </Link>
        //             <Link to='/manager?tab=inventory'>
        //                 <Sidebar.Item active={tab === 'inventory'} icon={BiCoinStack} as='div' >
        //                     Inventario
        //                 </Sidebar.Item>
        //             </Link>
        //             <Link to='/manager?tab=attendance'>
        //                 <Sidebar.Item active={tab === 'attendance'} icon={BsPersonFillCheck} as='div'>
        //                     Asistencia
        //                 </Sidebar.Item>
        //             </Link>


        //             <Sidebar.Collapse label='Salario' icon={FaMoneyBillTrendUp}>
        //                 <Link to='/manager?tab=salary'>
        //                     <Sidebar.Item active={tab === 'monthly-salary'} icon={FaMoneyBill} as='div'> Salario mensual </Sidebar.Item>
        //                 </Link>
        //                 <Link to='/manager?tab=earnings'>
        //                     <Sidebar.Item active={tab === 'earnings'} icon={FaMoneyBillTransfer} as='div'>B y D </Sidebar.Item>
        //                 </Link>
        //                 <Link to='/manager?tab=hourpayments'>
        //                     <Sidebar.Item active={tab === 'hour-payments'} icon={FaMoneyBillTransfer} as='div'>Pago por horas </Sidebar.Item>
        //                 </Link>

        //             </Sidebar.Collapse>    


        //             <Link to='/manager?tab=view-all-employees'>
        //                 <Sidebar.Item active={tab === 'view-all-employees'} icon={BsFillPeopleFill} as='div'>
        //                     Empleados
        //                 </Sidebar.Item>
        //             </Link>
        //             <Link to='/manager?tab=view-all-events'>
        //                 <Sidebar.Item active={tab === 'view-all-events'} icon={MdEvent} as='div'>
        //                     Eventos
        //                 </Sidebar.Item>
        //             </Link>

        //             <Link to='/manager?tab=manage-orders'>
        //                 <Sidebar.Item active={tab === 'manage-orders'} icon={MdRestaurantMenu} as='div'>
        //                    Gestionar pedidos
        //                 </Sidebar.Item>
        //             </Link>
        //             <Sidebar.Collapse label='Reportes' icon={FaMoneyBillTrendUp}>
        //                 <Link to='/manager?tab=monthly-profit'>
        //                     <Sidebar.Item active={tab === 'monthly-profit'} icon={FaMoneyBillTrendUp} as='div'> Resporte mensual </Sidebar.Item>
        //                 </Link>
        //                 <Link to='/manager?tab=annual-income'>
        //                     <Sidebar.Item active={tab === 'annual-income'} icon={FaMoneyBillTrendUp} as='div'>  Reporte anual </Sidebar.Item>
        //                 </Link>

        //             </Sidebar.Collapse>
        //             <Sidebar.Collapse label='Mesas' icon={IoSettings}>
        //                 <Link to='/manager?tab=table-manage'>
        //                     <Sidebar.Item active={tab === 'table-manage'} icon={MdOutlineTableBar} as='div'> Gestionar mesas </Sidebar.Item>
        //                 </Link>
        //             </Sidebar.Collapse>

        //             <Link to = '/manager?tab=billPayments'>
        //                 <Sidebar.Item active={tab === 'billPayments'} icon={MdOutlineRestaurantMenu} as='div'> Gestión de tareas </Sidebar.Item>
        //             </Link>

        //             <Link to='/manager?tab=profile'>
        //                 <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Gerente"} labelColor='success' as='div'>
        //                     Perfil
        //                 </Sidebar.Item>
        //             </Link>

        //             <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogOut} >
        //                 Salir
        //             </Sidebar.Item>

        //         </Sidebar.ItemGroup>
        //     </Sidebar.Items>
        // </Sidebar>

      <Sidebar className='w-full md:w-56 bg-white dark:bg-neutral-900 border-r border-gray-200 dark:border-gray-700' aria-label="Sidebar">
    <Sidebar.Items>
        <Sidebar.ItemGroup>
            {/* Inicio */}
            <Link to='/manager?tab=dashboard'>
                <Sidebar.Item
                    active={tab === 'dashboard'}
                    icon={() => <FaChartPie className={`${tab === 'dashboard' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    as='div'
                    className={`${tab === 'dashboard'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Inicio
                </Sidebar.Item>
            </Link>

            {/* Inventario */}
            <Link to='/manager?tab=inventory'>
                <Sidebar.Item
                    active={tab === 'inventory'}
                    icon={() => <BiCoinStack className={`${tab === 'inventory' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    as='div'
                    className={`${tab === 'inventory'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Inventario
                </Sidebar.Item>
            </Link>

            {/* Asistencia */}
            <Sidebar.Collapse 
                label='Asistencia' 
                icon={HiUser}
                open={['addAttendance', 'viewAttendance', 'attendance'].includes(tab)}
            >
                <Link to='/manager?tab=addAttendance'>
                    <Sidebar.Item
                        active={tab === 'addAttendance'}
                        icon={() => (
                            <RiUserShared2Fill className={`${tab === 'addAttendance' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />
                        )}
                        as="div"
                        className={`${tab === 'addAttendance'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Registrar
                    </Sidebar.Item>
                </Link>

                <Link to='/manager?tab=viewAttendance'>
                    <Sidebar.Item
                        active={tab === 'viewAttendance'}
                        icon={() => (
                            <HiOutlineUsers className={`${tab === 'viewAttendance' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />
                        )}
                        as="div"
                        className={`${tab === 'viewAttendance'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Ausentes
                    </Sidebar.Item>
                </Link>

                <Link to='/manager?tab=attendance'>
                    <Sidebar.Item
                        active={tab === 'attendance'}
                        icon={() => <BsPersonFillCheck className={`${tab === 'attendance' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'attendance'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Registro
                    </Sidebar.Item>
                </Link>
            </Sidebar.Collapse>

            {/* Salario */}
            <Sidebar.Collapse 
                label='Salario' 
                icon={() => <FaMoneyBillTrendUp className='text-gray-700 dark:text-orange-400' />}
                open={['salary', 'earnings', 'hourpayments'].includes(tab)}
            >
                <Link to='/manager?tab=salary'>
                    <Sidebar.Item
                        active={tab === 'salary'}
                        icon={() => <FaMoneyBill className={`${tab === 'salary' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'salary'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Salario mensual
                    </Sidebar.Item>
                </Link>
                <Link to='/manager?tab=earnings'>
                    <Sidebar.Item
                        active={tab === 'earnings'}
                        icon={() => <FaMoneyBillTransfer className={`${tab === 'earnings' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'earnings'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        B y D
                    </Sidebar.Item>
                </Link>
                <Link to='/manager?tab=hourpayments'>
                    <Sidebar.Item
                        active={tab === 'hourpayments'}
                        icon={() => <FaMoneyBillTransfer className={`${tab === 'hourpayments' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'hourpayments'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Pago por horas
                    </Sidebar.Item>
                </Link>
            </Sidebar.Collapse>

            {/* Empleados */}
            <Link to='/manager?tab=view-all-employees'>
                <Sidebar.Item
                    active={tab === 'view-all-employees'}
                    icon={() => <BsFillPeopleFill className={`${tab === 'view-all-employees' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    as='div'
                    className={`${tab === 'view-all-employees'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Empleados
                </Sidebar.Item>
            </Link>

            {/* Eventos */}
            <Link to='/manager?tab=view-all-events'>
                <Sidebar.Item
                    active={tab === 'view-all-events'}
                    icon={() => <MdEvent className={`${tab === 'view-all-events' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    as='div'
                    className={`${tab === 'view-all-events'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Eventos
                </Sidebar.Item>
            </Link>

            {/* Pedidos */}
            <Link to='/manager?tab=manage-orders'>
                <Sidebar.Item
                    active={tab === 'manage-orders'}
                    icon={() => <MdRestaurantMenu className={`${tab === 'manage-orders' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    as='div'
                    className={`${tab === 'manage-orders'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Pedidos
                </Sidebar.Item>
            </Link>

            {/* Reportes */}
            <Sidebar.Collapse 
                label='Reportes' 
                icon={() => <FaMoneyBillTrendUp className='text-gray-700 dark:text-orange-400' />}
                open={['monthly-profit', 'annual-income'].includes(tab)}
            >
                <Link to='/manager?tab=monthly-profit'>
                    <Sidebar.Item
                        active={tab === 'monthly-profit'}
                        icon={() => <FaMoneyBillTrendUp className={`${tab === 'monthly-profit' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'monthly-profit'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Reporte mensual
                    </Sidebar.Item>
                </Link>
                <Link to='/manager?tab=annual-income'>
                    <Sidebar.Item
                        active={tab === 'annual-income'}
                        icon={() => <FaMoneyBillTrendUp className={`${tab === 'annual-income' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'annual-income'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Reporte anual
                    </Sidebar.Item>
                </Link>
            </Sidebar.Collapse>

            {/* Mesas */}
            <Sidebar.Collapse 
                label='Mesas' 
                icon={() => <IoSettings className='text-gray-700 dark:text-orange-400' />}
                open={tab === 'table-manage'}
            >
                <Link to='/manager?tab=table-manage'>
                    <Sidebar.Item
                        active={tab === 'table-manage'}
                        icon={() => <MdOutlineTableBar className={`${tab === 'table-manage' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                        as='div'
                        className={`${tab === 'table-manage'
                            ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                            : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                            } transition-colors`}
                    >
                        Listado
                    </Sidebar.Item>
                </Link>
            </Sidebar.Collapse>

            {/* Pagos */}
            <Link to='/manager?tab=billPayments'>
                <Sidebar.Item
                    active={tab === 'billPayments'}
                    icon={() => <FaMoneyBillTransfer className={`${tab === 'billPayments' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    as='div'
                    className={`${tab === 'billPayments'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Pagos
                </Sidebar.Item>
            </Link>

            {/* Perfil */}
            <Link to='/manager?tab=profile'>
                <Sidebar.Item
                    active={tab === 'profile'}
                    icon={() => <HiUser className={`${tab === 'profile' ? 'text-orange-600' : 'text-gray-700'} dark:text-orange-400`} />}
                    label="Gerente"
                    labelColor='success'
                    as='div'
                    className={`${tab === 'profile'
                        ? 'bg-orange-100 text-orange-600 border-l-4 border-orange-500 dark:bg-orange-900 dark:text-orange-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:hover:bg-neutral-800 dark:text-orange-400'
                        } transition-colors`}
                >
                    Perfil
                </Sidebar.Item>
            </Link>

            {/* Salir */}
            <Sidebar.Item
                icon={() => <HiArrowSmRight className="text-red-600 dark:text-red-400" />}
                className='cursor-pointer hover:bg-red-50 dark:hover:bg-red-800 transition-colors text-red-600 dark:text-red-400'
                onClick={handleLogOut}
            >
                Salir
            </Sidebar.Item>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
</Sidebar>

    )
}
