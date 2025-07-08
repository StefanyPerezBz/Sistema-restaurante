

import React from 'react';
import logo from '../image/logo.jpg';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logInStart, logInSuccess, logInFailure } from '../redux/user/userSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function Login() {
    const [formData, setFormData] = useState({});
    const { loading, error: errorMessage } = useSelector(state => state.user);
    const { currentUser } = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [employee, setEmployee] = useState('');
    const [redirecting, setRedirecting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        // Validación de longitud para username (max 10 caracteres)
        if (e.target.id === 'username' && e.target.value.length > 10) {
            MySwal.fire({
                title: 'Nombre de usuario muy largo',
                text: 'El nombre de usuario no puede tener más de 10 caracteres',
                icon: 'warning',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b',
                confirmButtonText: 'Entendido'
            });
            return;
        }
        
        // Validación de longitud para password (max 18 caracteres)
        if (e.target.id === 'password' && e.target.value.length > 18) {
            MySwal.fire({
                title: 'Contraseña muy larga',
                text: 'La contraseña no puede tener más de 18 caracteres',
                icon: 'warning',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b',
                confirmButtonText: 'Entendido'
            });
            return;
        }
        
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (redirecting) return;

        if (!formData.username || !formData.password) {
            setError("Por favor ingrese el nombre de usuario y la contraseña!");
            return;
        }

        if (formData.username.length > 10) {
            setError("El nombre de usuario no puede exceder los 10 caracteres");
            return;
        }

        if (formData.password.length > 18) {
            setError("La contraseña no puede exceder los 18 caracteres");
            return;
        }

        try {
            setRedirecting(true);
            dispatch(logInStart());
            const response = await axios.post(`http://localhost:8080/api/user/login`, formData);
            const data = response.data;
            setEmployee(data);

            if (data.success == false) {
                dispatch(logInFailure(data.message));
                setError(data.message);
                setRedirecting(false);
                return;
            }

            if (response.status === 200) {
                dispatch(logInSuccess(data));
                
                // Mostrar alerta de éxito
                await MySwal.fire({
                    title: '¡Inicio de sesión exitoso!',
                    text: `Bienvenido ${data.username}`,
                    icon: 'success',
                    confirmButtonColor: '#f97316',
                    background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                    color: localStorage.theme === 'dark' ? '#fff' : '#1e293b',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Determinar redirección según el puesto
                let redirectPath = '/';
                switch (data.position) {
                    case 'manager':
                        redirectPath = '/manager?tab=dashboard';
                        break;
                    case 'cashier':
                        redirectPath = '/cashier?tab=dashboard';
                        break;
                    case 'chef':
                        redirectPath = '/chef?tab=dashboard';
                        break;
                    case 'waiter':
                        redirectPath = '/waiter?tab=dashboard';
                        break;
                    default:
                        redirectPath = '/';
                }

                navigate(redirectPath);
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error',
                text: 'Nombre de usuario o contraseña no válidos',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b',
                confirmButtonText: 'Entendido'
            });
            setError("Nombre de usuario o contraseña no válidos");
            setFormData({});
            setRedirecting(false);
        }
    };
    
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='min-h-screen bg-orange-50 dark:bg-gray-900 flex items-center justify-center p-4'>
            <div className='flex p-6 max-w-3xl w-full mx-auto flex-col md:flex-row md:items-center shadow-lg bg-white dark:bg-gray-800 rounded-lg'>
                {/* left side */}
                <div className='flex-1 flex justify-center'>
                    <img src={logo} alt='logo' className='w-64 h-64 md:w-80 md:h-80' />
                </div>

                {/* right side */}
                <div className='flex-1'>
                    <h2 className='text-2xl font-bold text-orange-600 dark:text-orange-400 mb-6 text-center md:text-left'>Iniciar Sesión</h2>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Usuario' className='text-gray-700 dark:text-gray-300' />
                            <TextInput 
                                type='text' 
                                placeholder='Usuario (máx. 10 caracteres)' 
                                id='username' 
                                onChange={handleChange} 
                                value={formData.username || ''}
                                maxLength={10}
                                className='focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                            />
                        </div>

                        <div>
                            <Label value='Contraseña' className='text-gray-700 dark:text-gray-300' />
                            <TextInput 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder='Contraseña (máx. 18 caracteres)' 
                                id='password' 
                                onChange={handleChange} 
                                value={formData.password || ''}
                                maxLength={18}
                                className='focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
                            />
                            {/* password visibility */}
                            <div className='flex justify-between mt-1'>
                                <span></span>
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 focus:outline-none'>
                                    {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                </button>
                            </div>
                        </div>
                        
                        <Button 
                            gradientDuoTone='orangeToRed' 
                            type='submit' 
                            className='mt-4 bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white dark:bg-orange-600 dark:hover:bg-orange-700'
                            disabled={loading || redirecting}
                        >
                            {
                                loading ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='pl-3'> Cargando ...</span>
                                    </>
                                ) : 'Iniciar Sesión'
                            }
                        </Button>
                        <Link 
                            to='/ResetPassword' 
                            className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm text-center md:text-left"
                        >
                            ¿Has olvidado tu contraseña?
                        </Link>
                    </form>
                    {
                        error && (
                            <Alert className='mt-5' color='failure'>
                                {error}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    );
}