
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiOutlineUsers } from "react-icons/hi";
import { FaChartPie } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { BiSolidFoodMenu } from "react-icons/bi";
import { RiUserShared2Fill } from "react-icons/ri";
import { logOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';


export default function WaiterSideBar() {
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
        <Sidebar className='w-full h-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/waiter?tab=dashboard'>
                        <Sidebar.Item active={tab === 'dashboard'} icon={FaChartPie} as='div' >
                            Inicio
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Collapse label='Asistencia' icon={HiUser}>
                        <Link to='/waiter?tab=addAttendance'>
                            <Sidebar.Item active={tab === 'addAttendance'} icon={RiUserShared2Fill} as='div'> Agregar </Sidebar.Item>
                        </Link>
                        <Link to='/waiter?tab=viewAttendance'>
                            <Sidebar.Item active={tab === 'viewAttendance'} icon={HiOutlineUsers} as='div'> Ver </Sidebar.Item>
                        </Link>

                    </Sidebar.Collapse>
                    <Link to='/waiter?tab=take-order'>
                        <Sidebar.Item active={tab === 'take-order'} icon={MdRestaurantMenu} as='div' >
                            Tomar pedidos
                        </Sidebar.Item>
                    </Link>
                    <Link to='/waiter?tab=manage-orders'>
                        <Sidebar.Item active={tab === 'manage-orders'} icon={BiSolidFoodMenu} labelColor='dark' as='div'>
                            Gestionar pedidos
                        </Sidebar.Item>
                    </Link>

                    <Link to='/waiter?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Mesero"} labelColor='yellow' as='div'>
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
