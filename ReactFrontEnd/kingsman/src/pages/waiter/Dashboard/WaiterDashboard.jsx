import React, { useEffect, useState } from 'react';
import StatisticsCards from './StatisticsCards';
import OrderChart from './OrderChart';
import { useSelector } from 'react-redux';

export default function WaiterDashboard() {
  const { currentUser } = useSelector((state) => state.user);

  const [statistics, setStatistics] = useState({
    dailyOrderCounts: {},
    orderCountPreviousMonth: 0,
    orderCountThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/orders/statistics?employeeId=${currentUser?.id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id) fetchStatistics();
  }, [currentUser?.id]);

  // Extract today's date in Sri Lanka time zone
  const sriLankaDate = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Format the date string to YYYY-MM-DD
  const [year, month, day] = sriLankaDate.split('-');
  const formattedDate = `${year}-${month}-${day}`;

  // Extract 14-day order data
  const dailyOrderCounts = statistics.dailyOrderCounts || {};
  const dates = Object.keys(dailyOrderCounts).sort().reverse().slice(0, 14);
  const orders = dates.map(date => dailyOrderCounts[date]);
  const todayOrderCount = dailyOrderCounts[formattedDate] || 0;

  return (
    <div className='w-full p-4'>
      {loading ? (
        <div className='flex flex-col items-center justify-center'>
          <div role="status" className="flex flex items-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-green-600 motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
            </div>
            <div className='text-gray-600 mx-2'>Cargando estadísticas...</div>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4 sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16">
            <h1 className="text-left text-xl font-bold dark:text-white">Dashboard</h1>
          </div>

          <StatisticsCards
            orderCountPreviousMonth={statistics.orderCountPreviousMonth || 0}
            orderCountThisMonth={statistics.orderCountThisMonth || 0}
            todayOrderCount={todayOrderCount}
          />

          <div className="mt-4 bg-white border rounded-sm shadow sm:mx-6 md:mx-8 lg:mx-12 xl:mx-16 dark:bg-gray-900">
            <OrderChart dailyOrderCounts={dailyOrderCounts} />
          </div>
        </>
      )}
    </div>
  );
}
