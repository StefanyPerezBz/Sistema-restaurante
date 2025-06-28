import React from 'react';
import PropTypes from 'prop-types';

export default function StatisticsCards({ orderCountPreviousMonth, orderCountThisMonth, todayOrderCount }) {

    const formatCount = (count) => {
        return new Intl.NumberFormat('es-PE').format(count);
    };

    return (
        <div className="grid grid-cols-1 gap-4 px-4 mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="flex items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-sm overflow-hidden shadow dark:shadow-gray-600">
                <div className="p-4 bg-green-400 dark:bg-green-600">
                    <i className="ri-calendar-check-line text-5xl text-white"></i>
                </div>
                <div className="px-4 text-gray-700 dark:text-gray-300">
                    <h3 className="text-sm tracking-wider">Pedidos de hoy</h3>
                    <p className="text-3xl">{formatCount(todayOrderCount)}</p>
                </div>
            </div>

            <div className="flex items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-sm overflow-hidden shadow dark:shadow-gray-600">
                <div className="p-4 bg-blue-700 dark:bg-blue-800">
                    <i className="ri-calendar-todo-line text-5xl h-12 w-12 text-white"></i>
                </div>
                <div className="px-4 text-gray-700 dark:text-gray-300">
                    <h3 className="text-sm tracking-wider">Pedidos este mes</h3>
                    <p className="text-3xl">{formatCount(orderCountThisMonth)}</p>
                </div>
            </div>

            <div className="flex items-center bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-sm overflow-hidden shadow dark:shadow-gray-600">
                <div className="p-4 bg-orange-400 dark:bg-orange-500">
                    <i className="ri-calendar-line text-5xl h-12 w-12 text-white"></i>
                </div>
                <div className="px-4 text-gray-700 dark:text-gray-300">
                    <h3 className="text-sm tracking-wider">Pedidos el mes pasado</h3>
                    <p className="text-3xl">{formatCount(orderCountPreviousMonth)}</p>
                </div>
            </div>
        </div>
    );
}

StatisticsCards.propTypes = {
    orderCountPreviousMonth: PropTypes.number.isRequired,
    orderCountThisMonth: PropTypes.number.isRequired,
    todayOrderCount: PropTypes.number.isRequired,
};
