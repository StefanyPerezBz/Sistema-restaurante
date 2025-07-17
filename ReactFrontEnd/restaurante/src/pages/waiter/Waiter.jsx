import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import WaiterSideBar from '../../components/WaiterSideBar'
import TakeOrder from './order/TakeOrder';
import { Toaster } from 'react-hot-toast';
import ManageOrder from './order/ManageOrder';
import UpdateOrder from './order/UpdateOrder';
import OrderView from './order/OrderView';
import WaiterDashboard from './Dashboard/WaiterDashboard';
import WaiterProfile from './WaiterProfile';
import Attendance from './attendance/Attendance';
import ViewAttendance from './attendance/ViewAttendance';

export default function Waiter() {

  const location = useLocation();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    else {
      window.location.href = '/waiter?tab=dashboard';
    }
  }, [location.search]);

  return (

    <div>
      <Toaster position="top-right" />
      <div className='min-h-screen flex flex-col md:flex-row'>
        <div className='md:w-56'>
          {/* sidebar */}
          <WaiterSideBar />
        </div>
        {tab === 'dashboard' && <WaiterDashboard />}
        {tab === 'profile' && <WaiterProfile />}

      {tab === 'addAttendance' && <Attendance/>}

      {tab === 'viewAttendance' && <ViewAttendance/>}
        {tab === 'take-order' && <TakeOrder />}
        {tab === 'manage-orders' && <ManageOrder />}
        {tab === 'update-orders' && <UpdateOrder />}
        {tab === 'order-view' && <OrderView />}
      </div>
    </div>

  )
}

