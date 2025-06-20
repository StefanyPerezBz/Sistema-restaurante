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
    console.log(currentUser);

    const handleLogOut = async () => {

        try {
            dispatch(logOutSuccess());
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        // Top buttons

        <Navbar>

            <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <div className='flex items-center'>
                    <img src='../src/image/logo.png' alt='logo' className='w-12 rounded-3xl' />
                </div>
            </Link>

            <div className='flex gap-3 md:order-2'>

                {/* Botón "Mi panel" */}
                {currentUser && (
                    <Link
                        to={`/${currentUser.position}?tab=dashboard`}
                        className='px-4 py-2 rounded font-medium transition-colors duration-200 
        text-white bg-orange-500 hover:bg-orange-600 
        dark:bg-orange-400 dark:hover:bg-orange-300 dark:text-black mr-5 mt-2'
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
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>

                {/* Notificaciones */}
                {currentUser ? <Notification /> : <span></span>}

                {/* Avatar y menú o botón de login */}
                {currentUser ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar
                                alt='user'
                                img={currentUser.profilePicture}
                                rounded
                            />
                        }
                    >
                        <Link to={`/${currentUser.position}?tab=profile`}>
                            <Dropdown.Item>Perfil</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogOut}>
                            Salir
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/login'>
                        <button
                            className='px-4 py-2 rounded font-medium transition-colors duration-200 
          text-white bg-orange-500 hover:bg-orange-600 
          dark:bg-orange-400 dark:hover:bg-orange-300 dark:text-black'
                        >
                            Ingresar
                        </button>
                    </Link>
                )}
            </div>


            {/* <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to='/'>
                        Inicio
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to='/about'>
                        Nosotros
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse> */}

            <Navbar.Collapse>
                <Navbar.Link as="div">
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded transition-colors duration-200 font-medium ${path === '/'
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
                        className={`px-4 py-2 rounded transition-colors duration-200 font-medium ${path === '/about'
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
