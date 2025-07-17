import React from 'react'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ManagerSideBar from '../../components/ManagerSideBar';
import AllinventoryItem from './inventory/AllinventoryItem';
import ManagerProfile from './ManagerProfile';
import Header from '../../components/Header';
import RegisterEmployee from './manageEmployees/RegisterEmployee';
import ViewAllEmployees from './manageEmployees/ViewAllEmployees';
import AddEvent from './manageEvents/AddEvent';
import ViewAllEvents from './manageEvents/ViewAllEvents';
import ManageOrders from './order/ManageOrders';
import OrderView from './order/orderView';
import AttendanceFrManager from './attendance/AttendanceFrManager';
import MonthlyProfit from './IncomeStatement/MonthlyProfit';
import AnnualIncome from './IncomeStatement/AnnualIncome';
import ManagerDash from './ManagerDash';
import TableManage from './advanceSettings/TableManage';
import UpdateOrder from './order/UpdateOrder';
import UpdateOrderItems from './order/UpdateOrderItems';
import EmpSalaries from './salary/EmpSalaries';
import Bonuses from './salary/Bonuses';
import PayPerHour from './salary/PayPerHour';
import BillPayments from './BillPayments';
import Attendance from './attendance/Attendance';
import ViewAttendance from './attendance/ViewAttendance';

export default function Manager() {
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

        <div className='min-h-screen flex flex-col md:flex-row bg-white dark:bg-gray-900'>
            {/* Sidebar */}
            <div className='md:w-56 border-r border-gray-200 dark:border-gray-700'>
                <ManagerSideBar />
            </div>

            {/* Main content */}
            <main className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {tab === 'dashboard' && <ManagerDash />}
                {tab === 'inventory' && <AllinventoryItem />}
                {tab === 'profile' && <ManagerProfile />}
                {tab === 'new-employee' && <RegisterEmployee />}
                {tab === 'view-all-employees' && <ViewAllEmployees />}
                {tab === 'add-event' && <AddEvent />}
                {tab === 'view-all-events' && <ViewAllEvents />}
                {tab === 'manage-orders' && <ManageOrders />}
                {tab === 'view-order' && <OrderView />}
                {tab === 'update-order' && <UpdateOrder />}
                {tab === 'update-order-items' && <UpdateOrderItems />}
                {tab === 'salary' && <EmpSalaries />}
                {tab === 'earnings' && <Bonuses />}
                {tab === 'hourpayments' && <PayPerHour />}
                {tab === 'monthly-profit' && <MonthlyProfit />}
                {tab === 'annual-income' && <AnnualIncome />}
                {tab === 'table-manage' && <TableManage />}
                {tab === 'billPayments' && <BillPayments />}
                {tab === 'addAttendance' && <Attendance />}
                {tab === 'viewAttendance' && <ViewAttendance />}
                {tab === 'attendance' && <AttendanceFrManager />}

            </main>
        </div>

    )
}
