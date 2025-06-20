// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { resetPasswordStart, resetPasswordSuccess, resetPasswordFailure } from '../redux/user/userSlice';

// function ResetPassword() {
//     const [username, setUsername] = useState('');
//     const [otp, setOtp] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [email, setEmail] = useState('');
//     const [showOtpForm, setShowOtpForm] = useState(false);
//     const [showPasswordForm, setShowPasswordForm] = useState(false);
//     const [error, setError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [requirementsMet, setRequirementsMet] = useState({
//         length: false,
//         uppercase: false,
//         lowercase: false,
//         numberOrSpecialChar: false
//     });
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     //Show password visibility
//     const toggleNewPasswordVisibility = () => {
//         setShowNewPassword(!showNewPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };


//     //Getting username
//     const handleSubmitUsername = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8080/reset-password-request', { username });
//             setEmail(response.data.email);
//             alert("Se envió la contraseña de un solo uso a tu correo electrónico. Por favor, revisa tu correo electrónico..");
//             setShowOtpForm(true);
//         } catch (error) {
//             setError('Error:', error);
//             dispatch(resetPasswordFailure(error));
//         }
//     };

//     //Getting OTP
//     const handleSubmitOtp = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8080/verify-otp', {
//                 username,
//                 otp
//             });
//             if (response.data.includes("verificado exitosamente")) {
//                 setShowPasswordForm(true);
//             } else {
//                 dispatch(resetPasswordFailure('OTP no válido, inténtelo de nuevo.'));
//             }
//         } catch (error) {
//             dispatch(resetPasswordFailure(error));
//         }
//     };

//     //Getting new password
//     const handleSubmitPassword = async (e) => {
//         e.preventDefault();
//         try {
//             // Password validation logic
//             if (!validatePassword(newPassword)) {
//                 alert('La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número o carácter especial.');
//                 return;
//             }
//             if (newPassword !== confirmPassword) {
//                 alert('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
//                 return;
//             }

//             const response = await axios.post('http://localhost:8080/reset-password', {
//                 username,
//                 newPassword,
//                 confirmPassword
//             });
//             console.log('Response data:', response.data); // Log the response data to the console
//             if (response.data.includes("Restablecimiento de contraseña exitoso")) {
//                 alert('Restablecimiento de contraseña exitoso!');
//                 navigate('/login');
//             } else {
//                 dispatch(resetPasswordFailure('Error al restablecer la contraseña. Inténtalo de nuevo..'));
//             }
//         } catch (error) {
//             alert('Error:', error);
//         }
//     };

//     const validatePassword = (password) => {
//         // Al menos 6 caracteres, una mayúscula, una minúscula y un número o carácter especial
//         const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*()_+]).{6,}$/;
//         return passwordRegex.test(password);
//     };


//     const handlePasswordChange = (e) => {
//         const { value } = e.target;
//         setNewPassword(value);

//         // Password requirements validation
//         setRequirementsMet({
//             length: value.length >= 6,
//             uppercase: /[A-Z]/.test(value),
//             lowercase: /[a-z]/.test(value),
//             numberOrSpecialChar: /[\d!@#$%^&*()_+]/.test(value)
//         });
//         setPasswordError('');
//     };

//     return (
//         <div className='min-h-screen mt-20'>
//             <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center'>

//                 <div className='flex-1 flex justify-center '>

//                     {/* Username Form */}
//                     {!showOtpForm && !showPasswordForm && (
//                         <form onSubmit={handleSubmitUsername} className="flex flex-col gap-4 w-1/2 border-2 px-2">
//                             <h1 className="text-3xl font-bold text-center mt-8 mb-4">Has olvidado tu contraseña</h1>
//                             <div>
//                                 <Label value="Username" />
//                                 <TextInput type='text' placeholder="Username" id='PRusername' onChange={(e) => setUsername(e.target.value)} value={username || ''} />
//                             </div>
//                             <button type="submit" className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">Enviar OTP</button>
//                             <Link to="/login" className="text-grey-500 mt-4 font-semibold">Volver</Link> {/* Go Back link */}
//                         </form>

//                     )}

//                     {/* OTP Form */}
//                     {showOtpForm && !showPasswordForm && (
//                         <form onSubmit={handleSubmitOtp} className="flex flex-col gap-4  w-1/2 border-2 px-2">
//                             <h1 className="text-3xl font-bold text-center mt-8 mb-4">Verificar OTP </h1>
//                             <div>
//                                 <Label value="OTP" />
//                                 <TextInput type='text' placeholder="Enter OTP" id='PRotp' onChange={(e) => setOtp(e.target.value)} value={otp || ''} />
//                             </div>
//                             <button type="submit" className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded">Verificar OTP</button>
//                             <Link to="/login" className="text-grey-500 mt-4 font-semibold">Regresar</Link> {/* Go Back link */}
//                         </form>
//                     )}

//                     {/* Password Form */}
//                     {showPasswordForm && (
//                         <form onSubmit={handleSubmitPassword} className="flex flex-col gap-4 border-2 px-4">
//                             <h1 className="text-3xl font-bold text-center mt-8 mb-4">Restablecer contraseña</h1>
//                             <div>
//                                 <Label value="New Password" />
//                                 <TextInput type={showNewPassword ? 'text' : 'password'} placeholder="New Password" id='PRnewPassword' onChange={handlePasswordChange} value={newPassword || ''} />
//                                 {/* password visibility */}
//                                 <div className='flex justify-between'>
//                                     <span></span>
//                                     <Link
//                                         type='button'
//                                         onClick={toggleNewPasswordVisibility}>
//                                         {showNewPassword ? 'Hide Password' : 'Show Password'}
//                                     </Link>
//                                 </div>

//                                 <Label value="Confirm Password" />
//                                 <TextInput type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" id='PRconfirmPassword' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword || ''} />
//                                 <div className='flex justify-between'>
//                                     <span></span>
//                                     <Link
//                                         type='button'
//                                         onClick={toggleConfirmPasswordVisibility}>
//                                         {showConfirmPassword ? 'Hide Password' : 'Show Password'}
//                                     </Link>
//                                 </div>

//                             </div>
//                             <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Restablecer</button>
//                             <Link to="/login" className="text-blue-500 mt-4">Regresar</Link> {/* Go Back link */}

//                             {/* Password requirements */}
//                             <div className='flex flex-col gap-2 mt-4'>
//                                 <span className={requirementsMet.length ? 'text-green-500' : 'text-red-500'}>Al menos 6 caracteres</span>
//                                 <span className={requirementsMet.uppercase ? 'text-green-500' : 'text-red-500'}>Al menos una letra mayúscula</span>
//                                 <span className={requirementsMet.lowercase ? 'text-green-500' : 'text-red-500'}>Al menos una letra minúscula</span>
//                                 <span className={requirementsMet.numberOrSpecialChar ? 'text-green-500' : 'text-red-500'}>Al menos un número o carácter especial</span>
//                             </div>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ResetPassword;

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
                background: '#fff',
                color: '#1e293b'
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
                background: '#fff',
                color: '#1e293b'
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
                background: '#fff',
                color: '#1e293b'
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
                background: '#fff',
                color: '#1e293b'
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
                    background: '#fff',
                    color: '#1e293b'
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
                background: '#fff',
                color: '#1e293b'
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
                background: '#fff',
                color: '#1e293b'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            await MySwal.fire({
                title: 'Error',
                text: 'Las contraseñas no coinciden',
                icon: 'error',
                confirmButtonColor: '#f97316',
                background: '#fff',
                color: '#1e293b'
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
                    background: '#fff',
                    color: '#1e293b',
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
                background: '#fff',
                color: '#1e293b'
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
        <div className='min-h-screen flex items-center justify-center p-4 bg-orange-50'>
            <div className='w-full max-w-md mx-auto'>
                {/* Formulario de usuario */}
                {!showOtpForm && !showPasswordForm && (
                    <div className='bg-white shadow-lg rounded-lg p-6 border border-orange-200'>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-orange-600">
                                Recuperar Contraseña
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">
                                Ingresa tu nombre de usuario para recibir un código de verificación
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmitUsername} className="flex flex-col gap-4">
                            <div>
                                <Label value="Nombre de Usuario" className="text-gray-700" />
                                <TextInput 
                                    type="text" 
                                    placeholder="Ej: jperez" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="focus:ring-orange-500 focus:border-orange-500"
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
                                    className="text-orange-600 hover:text-orange-800 text-sm"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* Formulario de OTP */}
                {showOtpForm && !showPasswordForm && (
                    <div className='bg-white shadow-lg rounded-lg p-6 border border-orange-200'>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-orange-600">
                                Verificar Código
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">
                                Ingresa el código de verificación enviado a tu correo
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmitOtp} className="flex flex-col gap-4">
                            <div>
                                <Label value="Código de Verificación" className="text-gray-700" />
                                <TextInput 
                                    type="text" 
                                    placeholder="Ej: 123456" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)} 
                                    className="focus:ring-orange-500 focus:border-orange-500 text-center text-lg"
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
                                    className="text-orange-600 hover:text-orange-800 text-sm"
                                >
                                    ¿No recibiste el código?
                                </button>
                                
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                {/* Formulario de nueva contraseña */}
                {showPasswordForm && (
                    <div className='bg-white shadow-lg rounded-lg p-6 border border-orange-200'>
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold text-orange-600">
                                Nueva Contraseña
                            </h1>
                            <p className="text-gray-600 mt-2 text-sm">
                                Crea una nueva contraseña segura para tu cuenta
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmitPassword} className="flex flex-col gap-4">
                            <div>
                                <Label value="Nueva Contraseña" className="text-gray-700" />
                                <div className="relative">
                                    <TextInput 
                                        type={showNewPassword ? "text" : "password"} 
                                        placeholder="Ingresa tu nueva contraseña" 
                                        value={newPassword}
                                        onChange={handlePasswordChange} 
                                        className="focus:ring-orange-500 focus:border-orange-500 w-full"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => togglePasswordVisibility('new')}
                                        className="absolute right-2 top-2 text-sm text-orange-600 hover:text-orange-800"
                                    >
                                        {showNewPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <Label value="Confirmar Contraseña" className="text-gray-700" />
                                <div className="relative">
                                    <TextInput 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Repite tu nueva contraseña" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                        className="focus:ring-orange-500 focus:border-orange-500 w-full"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        className="absolute right-2 top-2 text-sm text-orange-600 hover:text-orange-800"
                                    >
                                        {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Requisitos de contraseña */}
                            <div className="bg-orange-50 p-3 rounded-lg mt-2">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
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