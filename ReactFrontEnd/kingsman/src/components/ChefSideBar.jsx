import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BiCoinStack } from "react-icons/bi";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser, HiClipboardCheck } from "react-icons/hi";
import { IoFastFoodOutline } from "react-icons/io5";
import { logOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { FaChartPie } from "react-icons/fa";


export default function ChefSideBar() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
        fetchOrders();
    }, [location.search]);

    const handleLogOut = async () => {

        try {
            dispatch(logOutSuccess());
        } catch (error) {
            console.log(error.message);
        }
    }

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
            console.error('Error fetching orders:', error);
        }
    };


    return (
        <Sidebar className='w-full md:w-56 h-full'>
    <Sidebar.Items>
        <Sidebar.ItemGroup>
            <div className='h-full '>
                <div className=''>
                    <Link to='/chef?tab=dashboard'>
                        <Sidebar.Item active={tab === 'dashboard'} icon={FaChartPie} as='div' >
                            Dashboard
                        </Sidebar.Item>
                    </Link>
                    <Link to='/chef?tab=inventory'>
                        <Sidebar.Item active={tab === 'inventory'} icon={BiCoinStack} as='div' >
                            Inventory
                        </Sidebar.Item>
                    </Link>
                    <Link to='/chef?tab=allFood'>
                        <Sidebar.Item active={tab === 'allFood'} icon={IoFastFoodOutline} as='div' >
                            Food Menu
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Collapse icon={HiClipboardCheck} label={`Orders -  ${orders.filter(order => order.orderStatus === 'Pending').length}`} className='w-full'>
                        <Link to='/chef?tab=allOrders'>
                            <Sidebar.Item className=' ml-0 justify-self-start' active={tab === 'allOrders'} >All Orders </Sidebar.Item>
                        </Link>
                        <Link to='/chef?tab=availableOrders'>
                            <Sidebar.Item className=' ml-0 justify-self-start' active={tab === 'availableOrders'} >Available Orders </Sidebar.Item>
                        </Link>
                        <Link to='/chef?tab=preparingOrders'>
                            <Sidebar.Item className=' ml-0 justify-self-start' active={tab === 'preparingOrders'} >Preparing Orders</Sidebar.Item>
                        </Link>
                        <Link to='/chef?tab=finishedOrders'>
                            <Sidebar.Item active={tab === 'finishedOrders'} >Finished Orders</Sidebar.Item>
                        </Link>
                        <Link to='/chef?tab=canceledOrders'>
                            <Sidebar.Item active={tab === 'canceledOrders'} >Canceled Orders</Sidebar.Item>
                        </Link>
                        
                    </Sidebar.Collapse>
                </div>
                <div className='mt-auto'>
                    <Link to='/chef?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"Chef"} labelColor='dark' as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleLogOut} >
                        Log Out
                    </Sidebar.Item>
                </div>
            </div>
        </Sidebar.ItemGroup>
    </Sidebar.Items>
</Sidebar>


    )
}
