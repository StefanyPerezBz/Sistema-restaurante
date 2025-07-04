

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetPasswordStart, resetPasswordSuccess, resetPasswordFailure } from '../redux/user/userSlice';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function ResetPassword() {
    const [username, setUsername] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOtpForm, setShowOtpForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [error, setError] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [requirementsMet, setRequirementsMet] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        numberOrSpecialChar: false
    });
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Mostrar/ocultar contraseña
    const togglePasswordVisibility = (field) => {
        if (field === 'new') setShowNewPassword(!showNewPassword);
        if (field === 'confirm') setShowConfirmPassword(!showConfirmPassword);
    };

    // Enviar solicitud de OTP
    const handleSubmitUsername = async (e) => {
        e.preventDefault();
        if (!username) {
            await MySwal.fire({
                title: 'Campo requerido',
                text: 'Por favor ingrese un nombre de usuario',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/reset-password-request', { username });
            
            await MySwal.fire({
                title: 'Código enviado',
                html: `Se ha enviado un código de verificación al correo asociado a <b>${username}</b>.<br><br>
                      <small>Si no lo ves en tu bandeja principal, revisa la carpeta de spam.</small>`,
                icon: 'success',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            
            setShowOtpForm(true);
        } catch (error) {
            console.error('Error al enviar OTP:', error.response?.data || error.message);
            
            await MySwal.fire({
                title: 'Error',
                html: `No se pudo enviar el código de verificación.<br><br>
                      <small>${error.response?.data?.message || 'Verifica que el usuario exista y tenga un correo asociado.'}</small>`,
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            
            dispatch(resetPasswordFailure(error));
        } finally {
            setLoading(false);
        }
    };

    // Verificar OTP
    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        if (!otp) {
            await MySwal.fire({
                title: 'Código requerido',
                text: 'Por favor ingrese el código de verificación',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/verify-otp', { 
                username,
                otp 
            });
            
            if (response.data && (response.data.includes("verificado exitosamente") || response.data.success)) {
                await MySwal.fire({
                    title: '¡Verificado!',
                    text: 'Código validado correctamente',
                    icon: 'success',
                    confirmButtonColor: '#f97316',
                    background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                    color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
                });
                setShowPasswordForm(true);
            } else {
                throw new Error(response.data?.message || 'Código de verificación no válido');
            }
        } catch (error) {
            console.error('Error al verificar OTP:', error.response?.data || error.message);
            
            await MySwal.fire({
                title: 'Error',
                text: error.response?.data?.message || error.message || 'Código de verificación incorrecto',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            
            dispatch(resetPasswordFailure(error));
        } finally {
            setLoading(false);
        }
    };

    // Establecer nueva contraseña - Versión corregida
    const handleSubmitPassword = async (e) => {
        e.preventDefault();
        
        if (!validatePassword(newPassword)) {
            await MySwal.fire({
                title: 'Contraseña insegura',
                html: 'La contraseña debe cumplir con:<ul class="text-left mt-2">' +
                      '<li>Mínimo 6 caracteres</li>' +
                      '<li>Al menos 1 mayúscula</li>' +
                      '<li>Al menos 1 minúscula</li>' +
                      '<li>Al menos 1 número/símbolo</li></ul>',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            await MySwal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8080/reset-password', {
                username,
                newPassword,
                confirmPassword
            });
            
            // Verificación más flexible de la respuesta
            const successMessages = [
                "Restablecimiento de contraseña exitoso",
                "Contraseña actualizada correctamente",
                "success",
                "Password updated successfully"
            ];
            
            const isSuccess = response.data && 
                (successMessages.some(msg => 
                    (typeof response.data === 'string' && response.data.includes(msg)) ||
                    (response.data.message && response.data.message.includes(msg)) ||
                    response.data.success
                ));

            if (isSuccess) {
                await MySwal.fire({
                    title: '¡Éxito!',
                    html: `
                        <div class="text-center">
                            <svg class="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <p class="text-lg font-medium">Contraseña actualizada correctamente</p>
                            <p class="text-sm mt-2">Serás redirigido al login</p>
                        </div>
                    `,
                    showConfirmButton: false,
                    timer: 2000,
                    background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                    color: localStorage.theme === 'dark' ? '#fff' : '#1e293b',
                    didClose: () => {
                        // Resetear estados y redirigir después de cerrar el alert
                        setUsername('');
                        setOtp('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setShowOtpForm(false);
                        setShowPasswordForm(false);
                        navigate('/login');
                    }
                });
            } else {
                throw new Error(response.data?.message || 'La respuesta del servidor no indica éxito');
            }
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            await MySwal.fire({
                title: 'Error',
                html: `
                    <div class="text-center">
                        <svg class="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        <p class="text-lg font-medium">Error al actualizar la contraseña</p>
                        <p class="text-sm mt-2">${error.response?.data?.message || error.message || 'Por favor inténtalo de nuevo'}</p>
                    </div>
                `,
                confirmButtonColor: '#f97316',
                background: localStorage.theme === 'dark' ? '#1f2937' : '#fff',
                color: localStorage.theme === 'dark' ? '#fff' : '#1e293b'
            });
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*()_+]).{6,}$/;
        return passwordRegex.test(password);
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setNewPassword(value);

        setRequirementsMet({
            length: value.length >= 6,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            numberOrSpecialChar: /[\d!@#$%^&*()_+]/.test(value)
        });
    };

    return (
        <div className='min-h-screen flex items-center justify-center p-4 bg-orange-50 dark:bg-gray-900'>
            <div className='w-full max-w-md mx-auto'>
                {/* Formulario de usuario */}
                {!showOtpForm && !showPasswordForm && (
                    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-orange-200 dark:border-gray-700'>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                Recuperar Contraseña
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                                Ingresa tu nombre de usuario para recibir un código de verificación
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmitUsername} className="flex flex-col gap-4">
                            <div>
                                <Label value="Nombre de Usuario" className="text-gray-700 dark:text-gray-300" />
                                <TextInput 
                                    type="text" 
                                    placeholder="Ej: jperez" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                    required
                                />
                            </div>
                            
                            <Button 
                                gradientDuoTone="orangeToRed" 
                                type="submit" 
                                disabled={loading}
                                className="w-full mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Enviando código...
                                    </>
                                ) : 'Enviar Código'}
                            </Button>
                            
                            <div className="text-center mt-3">
                                <Link 
                                    to="/login" 
                                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* Formulario de OTP */}
                {showOtpForm && !showPasswordForm && (
                    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-orange-200 dark:border-gray-700'>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                Verificar Código
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                                Ingresa el código de verificación enviado a tu correo
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmitOtp} className="flex flex-col gap-4">
                            <div>
                                <Label value="Código de Verificación" className="text-gray-700 dark:text-gray-300" />
                                <TextInput 
                                    type="text" 
                                    placeholder="Ej: 123456" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)} 
                                    className="focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-center text-lg"
                                    required
                                />
                            </div>
                            
                            <Button 
                                gradientDuoTone="orangeToRed" 
                                type="submit" 
                                disabled={loading || !otp}
                                className="w-full mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Verificando...
                                    </>
                                ) : 'Verificar Código'}
                            </Button>
                            
                            <div className="flex justify-between mt-3">
                                <button
                                    type="button"
                                    onClick={handleSubmitUsername}
                                    disabled={loading}
                                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm"
                                >
                                    ¿No recibiste el código?
                                </button>
                                
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* Formulario de nueva contraseña */}
                {showPasswordForm && (
                    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-orange-200 dark:border-gray-700'>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                Nueva Contraseña
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                                Crea una nueva contraseña segura para tu cuenta
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmitPassword} className="flex flex-col gap-4">
                            <div>
                                <Label value="Nueva Contraseña" className="text-gray-700 dark:text-gray-300" />
                                <div className="relative">
                                    <TextInput 
                                        type={showNewPassword ? "text" : "password"} 
                                        placeholder="Ingresa tu nueva contraseña" 
                                        value={newPassword}
                                        onChange={handlePasswordChange} 
                                        className="focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-2 top-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                                    >
                                        {showNewPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <Label value="Confirmar Contraseña" className="text-gray-700 dark:text-gray-300" />
                                <div className="relative">
                                    <TextInput 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Repite tu nueva contraseña" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        className="focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white w-full"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-2 top-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                                    >
                                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Requisitos de contraseña */}
                            <div className="bg-orange-50 dark:bg-gray-700 p-3 rounded-lg mt-2">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    La contraseña debe contener:
                                </h3>
                                <ul className="space-y-1 text-sm">
                                    <li className={requirementsMet.length ? 'text-green-500' : 'text-red-500'}>
                                        {requirementsMet.length ? '✓ ' : '✗ '}Mínimo 6 caracteres
                                    </li>
                                    <li className={requirementsMet.uppercase ? 'text-green-500' : 'text-red-500'}>
                                        {requirementsMet.uppercase ? '✓ ' : '✗ '}Al menos 1 mayúscula
                                    </li>
                                    <li className={requirementsMet.lowercase ? 'text-green-500' : 'text-red-500'}>
                                        {requirementsMet.lowercase ? '✓ ' : '✗ '}Al menos 1 minúscula
                                    </li>
                                    <li className={requirementsMet.numberOrSpecialChar ? 'text-green-500' : 'text-red-500'}>
                                        {requirementsMet.numberOrSpecialChar ? '✓ ' : '✗ '}Al menos 1 número/símbolo
                                    </li>
                                </ul>
                            </div>
                            
                            <Button 
                                gradientDuoTone="orangeToRed" 
                                type="submit" 
                                disabled={loading || 
                                    !(requirementsMet.length && 
                                      requirementsMet.uppercase && 
                                      requirementsMet.lowercase && 
                                      requirementsMet.numberOrSpecialChar) ||
                                    newPassword !== confirmPassword}
                                className="w-full mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="mr-2" />
                                        Actualizando...
                                    </>
                                ) : 'Actualizar Contraseña'}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;