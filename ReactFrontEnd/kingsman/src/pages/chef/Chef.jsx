import React from 'react'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ChefProfile from './ChefProfile';
import ManageInventory from './inventory/ManageInventory';
import ChefSideBar from '../../components/ChefSideBar';
import AvailableOrders from './orders/AvailableOrders';
import FinishedOrders from './orders/FinishedOrders';
import CancelOrders from './orders/CancelOrders';
import AllOrders from './orders/AllOrders';
import FoodMenu from './foodManagement/FoodMenu';
import AllFood from './foodManagement/AllFood';
import PreparingOrders from './orders/PreparingOrders';
import ChefDashboard from './ChefDashboard';


export default function Chef() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);

            
        }
    }, [location.search]);
    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-56'>
                {/* sidebar */}
                <ChefSideBar/>
            </div>

                {/* Inventory */}
                {tab === 'inventory' && <ManageInventory/>}
                {/* profile */}
                {tab === 'profile' && <ChefProfile/>}
                {/* availableOrders */}
                {tab === 'availableOrders' && <AvailableOrders/>}
                {/* finishedOrders */}
                {tab === 'finishedOrders' && <FinishedOrders/>}
                {/* canceledOrders */}
                {tab === 'canceledOrders' && <CancelOrders/>}
                {/* All Orders */}
                {tab === 'allOrders' && <AllOrders/>}
                {/* Food Menu */}
                {/* {tab === 'foodMenu' && <FoodMenu/>} */}
                {/* all food */}
                {tab === 'allFood' && <AllFood/>}
                {/* preparing orders */}
                {tab === 'preparingOrders' && <PreparingOrders/>}
                {/* dashboard */}
                {tab === 'dashboard' && <ChefDashboard/>}

                

        </div>
    )
}
