import React, { useEffect, useState, useCallback } from 'react';
import { Dropdown } from 'flowbite-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Notification() {
    const { currentUser } = useSelector((state) => state.user);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAll, setShowAll] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(() => {
        axios.get(`localhost:8080/api/notifications/forWho/${currentUser.position}`)
            .then(response => {
                const sortedNotifications = response.data.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setNotifications(sortedNotifications);
                
                const unread = sortedNotifications.filter(
                    n => !n.read && (n.forWhoUser === currentUser.username || !n.forWhoUser)
                ).length;
                setUnreadCount(unread);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, [currentUser.position, currentUser.username]);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = useCallback((id) => {
        axios.put(`http://localhost:8080/api/notifications/${id}/read`)
            .then(() => {
                setNotifications(prev => prev.map(n => 
                    n.id === id ? { ...n, read: true } : n
                ));
                setUnreadCount(prev => prev - 1);
            })
            .catch(console.error);
    }, []);

    const markAllAsRead = useCallback(() => {
        const unreadIds = notifications
            .filter(n => !n.read && (n.forWhoUser === currentUser.username || !n.forWhoUser))
            .map(n => n.id);

        if (unreadIds.length === 0) return;

        axios.put(`http://localhost:8080/api/notifications/markMultipleRead`, {
            notificationIds: unreadIds
        })
        .then(() => {
            setNotifications(prev => prev.map(n => 
                unreadIds.includes(n.id) ? { ...n, read: true } : n
            ));
            setUnreadCount(0);
        })
        .catch(console.error);
    }, [notifications, currentUser.username]);

    const getLinkForNotification = (notification) => {
        const { title, orderId, feedbackId } = notification;
        
        switch(currentUser.position) {
            case 'chef':
                if (title.includes('Orden')) return orderId ? `/chef/order/${orderId}` : '/chef?tab=allOrders';
                break;
                
            case 'manager':
                if (title === 'Uso del inventario') return '/manager?tab=inventory';
                if (title === 'Comentario') return feedbackId ? `/feedback/${feedbackId}` : '/feedback';
                if (title === 'Orden Completa') return '/manager/reports';
                if (title === 'Bajo inventario') return '/manager?tab=inventory';
                break;
                
            case 'waiter':
                if (title.includes('Orden')) return orderId ? `/waiter/order/${orderId}` : '/waiter?tab=manage-orders';
                if (title === 'Mesa Asignada') return '/waiter?tab=tables';
                break;
                
            case 'cashier':
                if (title.includes('Orden')) return '/cashier?tab=orders';
                if (title === 'Pago completado') return '/cashier?tab=history';
                break;
                
            default:
                return '#';
        }
        
        return '#';
    };

    const groupNotificationsByDate = (notifs) => {
        const grouped = {
            hoy: [],
            ayer: [],
            anteriores: []
        };
        
        notifs.forEach(notification => {
            const date = parseISO(notification.createdAt);
            
            if (isToday(date)) {
                grouped.hoy.push(notification);
            } else if (isYesterday(date)) {
                grouped.ayer.push(notification);
            } else {
                grouped.anteriores.push(notification);
            }
        });
        
        return grouped;
    };

    const formatDate = (dateString) => {
        return format(parseISO(dateString), 'PPpp', { locale: es });
    };

    const userNotifications = notifications.filter(
        n => !n.forWhoUser || n.forWhoUser === currentUser.username
    );

    const displayedNotifications = showAll ? userNotifications : userNotifications.slice(0, 5);
    const { hoy, ayer, anteriores } = groupNotificationsByDate(displayedNotifications);

    if (loading) {
        return (
            <div className="w-12 h-10 hidden sm:inline my-auto flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-sm">Error al cargar notificaciones</div>;
    }

    return (
        <Dropdown
            arrowIcon={false}
            inline
            placement="bottom-end"
            className="w-96 z-50"
            label={
                <div className="w-12 h-10 hidden sm:inline my-auto relative">
                    <button 
                        className="py-4 px-1 relative border-2 border-transparent text-gray-800 dark:text-gray-200 rounded-full hover:text-gray-400 dark:hover:text-gray-400 focus:outline-none focus:text-gray-500 dark:focus:text-gray-300 transition duration-150 ease-in-out" 
                        aria-label="Notifications"
                    >
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.64 5.36 6 7.93 6 11v3.159c0 .538-.214 1.053-.595 1.436L4 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                        </svg>
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 inline-block w-5 h-5 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                </div>
            }
        >
            <Dropdown.Header className="flex justify-between items-center border-b pb-2 dark:border-gray-600">
                <span className="font-bold dark:text-white">Notificaciones</span>
            </Dropdown.Header>
            
            {displayedNotifications.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                    {hoy.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs font-semibold text-gray-500 px-4 py-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">Hoy</div>
                            {hoy.map((notification) => (
                                <NotificationItem 
                                    key={notification.id}
                                    notification={notification}
                                    markAsRead={markAsRead}
                                    getLink={getLinkForNotification}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                    
                    {ayer.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs font-semibold text-gray-500 px-4 py-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">Ayer</div>
                            {ayer.map((notification) => (
                                <NotificationItem 
                                    key={notification.id}
                                    notification={notification}
                                    markAsRead={markAsRead}
                                    getLink={getLinkForNotification}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                    
                    {anteriores.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs font-semibold text-gray-500 px-4 py-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">Anteriores</div>
                            {anteriores.map((notification) => (
                                <NotificationItem 
                                    key={notification.id}
                                    notification={notification}
                                    markAsRead={markAsRead}
                                    getLink={getLinkForNotification}
                                    formatDate={formatDate}
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <Dropdown.Item className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hay notificaciones nuevas
                </Dropdown.Item>
            )}
            
            {userNotifications.length > 5 && (
                <div className="border-t border-gray-100 dark:border-gray-600">
                    <button 
                        onClick={() => setShowAll(!showAll)} 
                        className="w-full text-center text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 py-2"
                    >
                        {showAll ? 'Mostrar menos' : `Ver todas (${userNotifications.length})`}
                    </button>
                </div>
            )}
        </Dropdown>
    );
}

const NotificationItem = ({ notification, markAsRead, getLink, formatDate }) => {
    const handleClick = () => {
        markAsRead(notification.id);
    };

    return (
        <Link 
            to={getLink(notification)} 
            onClick={handleClick}
            className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <Dropdown.Item className={`py-3 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                        <span className="font-semibold text-sm dark:text-white">{notification.title}</span>
                        {!notification.read && (
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-2"></span>
                        )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                    <time className="text-xs text-gray-400 dark:text-gray-400 mt-1">
                        {formatDate(notification.createdAt)}
                    </time>
                </div>
            </Dropdown.Item>
        </Link>
    );
};