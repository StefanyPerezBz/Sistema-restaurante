import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice'
import { logOutSuccess } from '../redux/user/userSlice'
import { Label } from 'flowbite-react'
import Notification from './Notification'

export default function Header() {
    const path = useLocation().pathname;
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    
    // Imagen por defecto si no hay foto de perfil
    const defaultProfilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

    // Construir la URL correcta para la imagen de perfil
    const getProfilePicture = () => {
        if (!currentUser?.profilePicture) return defaultProfilePic;
        
        // Si es una URL completa (empieza con http)
        if (currentUser.profilePicture.startsWith('http')) {
            return currentUser.profilePicture;
        }
        
        // Si es un nombre de archivo subido al servidor
        return `http://localhost:8080/api/food/image/${currentUser.profilePicture}`;
    };

    const handleLogOut = async () => {
        try {
            dispatch(logOutSuccess());
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Navbar className="border-b-2">
            {/* Logo */}
            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <div className='flex items-center'>
                    <img 
                        src='../src/image/logo.jpg' 
                        alt='logo' 
                        className='w-12 h-12 rounded-full object-cover' 
                    />
                </div>
            </Link>

            <div className='flex gap-3 md:order-2 items-center'>
                {/* Botón "Mi panel" */}
                {currentUser && (
                    <Link
                        to={`/${currentUser.position}?tab=dashboard`}
                        className='px-4 py-2 rounded font-medium transition-colors duration-200 
                        text-white bg-orange-500 hover:bg-orange-600 
                        dark:bg-orange-400 dark:hover:bg-orange-300 dark:text-black mr-5'
                    >
                        Mi panel
                    </Link>
                )}

                {/* Botón de cambio de tema */}
                <Button
                    className='w-12 h-10 hidden sm:inline'
                    color='gray'
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'light' ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
                </Button>

                {/* Notificaciones */}
                {currentUser && <Notification />}

                {/* Avatar y menú o botón de login */}
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt="Foto de perfil"
                                img={getProfilePicture()}
                                rounded
                                className="w-10 h-10"
                                bordered
                                size="md"
                                onError={(e) => {
                                    e.currentTarget.src = defaultProfilePic;
                                }}
                            />
                        }
                    >
                        <Dropdown.Header>
                            <span className="block text-sm font-semibold">
                                {currentUser.first_name || currentUser.username}
                            </span>
                            <span className="block text-sm font-medium truncate">
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={`/${currentUser.position}?tab=profile`}>
                            <Dropdown.Item>Perfil</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogOut}>
                            Cerrar sesión
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/login'>
                        <Button
                            color="orange"
                            pill
                            className='px-4 py-2 font-medium'
                        >
                            Ingresar
                        </Button>
                    </Link>
                )}
            </div>

            {/* Menú de navegación */}
            <Navbar.Collapse>
                <Navbar.Link as="div">
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded transition-colors duration-200 font-medium ${
                            path === '/'
                                ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                                : 'text-gray-700 hover:bg-orange-100 hover:text-orange-500 dark:text-gray-300 dark:hover:bg-orange-200 dark:hover:text-orange-600'
                        }`}
                    >
                        Inicio
                    </Link>
                </Navbar.Link>

                <Navbar.Link as="div">
                    <Link
                        to="/about"
                        className={`px-4 py-2 rounded transition-colors duration-200 font-medium ${
                            path === '/about'
                                ? 'bg-orange-500 text-white dark:bg-orange-400 dark:text-black'
                                : 'text-gray-700 hover:bg-orange-100 hover:text-orange-500 dark:text-gray-300 dark:hover:bg-orange-200 dark:hover:text-orange-600'
                        }`}
                    >
                        Nosotros
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}