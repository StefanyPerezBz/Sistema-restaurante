import ShowFeedback from './ShowFeedback';
import React, { useState, useEffect } from 'react';
import { Textarea, Button, Alert } from "flowbite-react";
import { Rating } from '@mui/material';
import { TextInput } from "flowbite-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function UserFeedback() {
    const [name, setName] = useState('');
    const [feedback, setFeedback] = useState('');
    const [rate, setRate] = useState(3);
    const [submitting, setSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [nameError, setNameError] = useState('');
    const MAX_NAME_LENGTH = 50;

    // Validar nombre (solo letras y espacios)
    const validateName = (input) => {
        // Expresión regular que solo permite letras (incluyendo acentos) y espacios
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/;
        return regex.test(input);
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (value.length > MAX_NAME_LENGTH) {
            setNameError(`Máximo ${MAX_NAME_LENGTH} caracteres`);
            return;
        }
        
        if (value === '' || validateName(value)) {
            setName(value);
            setNameError('');
        } else {
            setNameError('Solo se permiten letras y espacios');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación final antes de enviar
        if (!validateName(name)) {
            MySwal.fire({
                title: 'Nombre inválido',
                text: 'Por favor ingresa solo letras y espacios en el nombre',
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }

        const feedbackData = {
            name: name.trim(),
            feedback: feedback,
            rate: rate
        };

        setSubmitting(true);

        try {
            const response = await fetch('http://localhost:8080/addFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            setName('');
            setFeedback('');
            setRate(3);

            if (response.ok) {
                MySwal.fire({
                    title: '¡Gracias!',
                    text: 'Tu feedback ha sido enviado con éxito.',
                    icon: 'success',
                    confirmButtonText: 'Cerrar',
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                    confirmButtonColor: '#3b82f6'
                });
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 3000);
            } else {
                MySwal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar tu feedback. Por favor intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Entendido',
                    background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                    confirmButtonColor: '#3b82f6'
                });
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            MySwal.fire({
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.',
                icon: 'error',
                confirmButtonText: 'Entendido',
                background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                confirmButtonColor: '#3b82f6'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center mt-0 dark:bg-gray-900 min-h-screen">
            <div className="flex flex-col lg:flex-row w-full max-w-7xl">
                {/* Left side for ShowFeedback */}
                <div className="w-full lg:w-1/3 p-5">
                    <ShowFeedback />
                </div>
                
                {/* Right side for Feedback */}
                <div className="w-full lg:w-2/3 p-5">
                    <div className="sticky top-5">
                        <form 
                            onSubmit={handleSubmit} 
                            className="p-5 bg-slate-300 dark:bg-gray-800 border-black dark:border-gray-700 rounded-lg shadow-lg"
                        >
                            <div className="mb-8 flex justify-between">
                                <h1 className="text-xl font-bold dark:text-white">Los Patos</h1>
                                <h1 className="text-xl font-bold dark:text-white">Tu comentario</h1>
                            </div>
                            
                            <hr className="border-gray-400 dark:border-gray-600 mb-6" />
                            
                            <div className="mb-7">
                                <p className="text-lg mb-2 dark:text-gray-300">
                                    Nos gustaría recibir tus comentarios para mejorar nuestro servicio.
                                </p>
                                
                                <div className="mb-4">
                                    <div className="relative">
                                        <TextInput
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={handleNameChange}
                                            placeholder="Tu nombre y apellidos"
                                            required
                                            shadow
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
                                        />
                                        <div className="flex justify-between mt-1">
                                            {nameError && (
                                                <span className="text-sm text-red-600 dark:text-red-400">
                                                    {nameError}
                                                </span>
                                            )}
                                            <span className={`text-sm ml-auto ${name.length > MAX_NAME_LENGTH ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {name.length}/{MAX_NAME_LENGTH}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center items-center mb-4">
                                    <Rating
                                        name="rate"
                                        value={rate}
                                        precision={0.5}
                                        sx={{ 
                                            fontSize: '32px',
                                            '& .MuiRating-iconEmpty': {
                                                color: document.documentElement.classList.contains('dark') 
                                                    ? '#4b5563' 
                                                    : '#e5e7eb'
                                            },
                                            '& .MuiRating-iconFilled': {
                                                color: '#f59e0b'
                                            },
                                            '& .MuiRating-iconHover': {
                                                color: '#d97706'
                                            }
                                        }}
                                        onChange={(event, newValue) => {
                                            setRate(newValue);
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <hr className="border-gray-400 dark:border-gray-600 mb-6" />
                            
                            <div className="mb-4">
                                <div className="mb-2">
                                    <label htmlFor="comment" className="text-lg dark:text-gray-300">Tu comentario</label>
                                </div>
                                
                                <Textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Deja una opinión..."
                                    required
                                    rows={7}
                                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                                />
                            </div>
                            
                            <div className="mb-4 flex justify-end">
                                <Button 
                                    type="submit" 
                                    color="blue" 
                                    pill 
                                    disabled={submitting || nameError || name.length > MAX_NAME_LENGTH}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                >
                                    {submitting ? 'Enviando...' : 'Enviar comentario'}
                                </Button>
                            </div>
                            
                            <div className='flex justify-center'>
                                {showAlert && (
                                    <Alert 
                                        color="success" 
                                        rounded
                                        className="dark:bg-green-800 dark:text-white"
                                    >
                                        <span className="font-medium">¡Éxito!</span> Comentario enviado correctamente.
                                    </Alert>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}