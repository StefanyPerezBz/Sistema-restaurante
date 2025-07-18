

import React, { useEffect, useState } from 'react';
import { Alert, Label, TextInput } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AddPositionModal from './AddPositionModal';
import { IoChevronBackCircleSharp } from "react-icons/io5";
import Select from 'react-select';
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';


export default function RegisterEmployee() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        position: '',
        contact_number: '',
        gender: '',
        joined_date: '',
        email: '',
        address: '',
        uniform_size: '',
        emergency_contact: ''
    });

    const [errors, setErrors] = useState({
        first_name: '',
        last_name: '',
        username: '',
        position: '',
        joined_date: '',
        email: '',
        contact_number: '',
        emergency_contact: '',
        address: ''
    });

    const [positions, setPositions] = useState([]);
    const navigate = useNavigate();

    // Cargar posiciones al iniciar
    useEffect(() => {
        const savedPositions = localStorage.getItem('positions');
        const initialPositions = savedPositions ? JSON.parse(savedPositions) : [
            { value: 'cashier', label: 'Cajero' },
            { value: 'chef', label: 'Chef' },
            { value: 'waiter', label: 'Mesero' }
        ];
        setPositions(initialPositions);

        // Generar contraseña automática
        setFormData(prev => ({
            ...prev,
            password: generatePassword()
        }));
    }, []);

    const generatePassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#&';

        const getRandomChar = (str) => str.charAt(Math.floor(Math.random() * str.length));

        let password = [
            getRandomChar(uppercase),
            getRandomChar(lowercase),
            getRandomChar(numbers + symbols)
        ];

        const allChars = uppercase + lowercase + numbers + symbols;
        for (let i = 3; i < 8; i++) {
            password.push(getRandomChar(allChars));
        }

        // Mezclar los caracteres
        return password.sort(() => Math.random() - 0.5).join('');
    };

    const validateField = (name, value) => {
        let error = '';

        if (name === 'first_name' || name === 'last_name') {
            if (!value.trim()) {
                error = 'Este campo es requerido';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                error = 'Solo se permiten letras';
            } else if (value.length > 50) {
                error = 'Máximo 50 caracteres';
            }

        } else if (name === 'username') {
            if (!value.trim()) {
                error = 'Este campo es requerido';
            } else if (value.length > 20) {
                error = 'Máximo 20 caracteres';
            } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
                error = 'Solo se permiten letras, números, puntos, guiones bajos y guiones';
            }

        } else if (name === 'position') {
            if (!value) {
                error = 'Este campo es requerido';
            }

        } else if (name === 'uniform_size') {
            if (value && !['XS', 'S', 'M', 'L', 'XL'].includes(value)) {
                error = 'Talla de uniforme inválida';
            }

        } else if (name === 'gender') {
            if (!value) {
                error = 'Este campo es requerido';
            }

        } else if (name === 'joined_date') {
            if (!value) {
                error = 'Este campo es requerido';
            } else if (new Date(value) > new Date()) {
                error = 'La fecha de incorporación no puede ser futura';
            }

        } else if (name === 'email') {
            if (value && !/\S+@\S+\.\S+/.test(value)) {
                error = 'Correo electrónico inválido';
            } else if (value.length > 50) {
                error = 'Máximo 50 caracteres';
            } else if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                error = 'Formato de correo electrónico inválido';
            }

        } else if (name === 'contact_number') {
            if (value && !/^\d{9}$/.test(value)) {
                error = 'Debe tener 9 dígitos';
            } else if (value && value === formData.emergency_contact) {
                error = 'El número de contacto no puede ser el mismo que el contacto de emergencia';
            }

        } else if (name === 'emergency_contact') {
            if (value && !/^\d{9}$/.test(value)) {
                error = 'Debe tener 9 dígitos';
            } else if (value && value === formData.contact_number) {
                error = 'El contacto de emergencia no puede ser el mismo que el número de contacto';
            }

        } else if (name === 'address') {
            if (value) {
                if (/^\d+$/.test(value)) {
                    error = 'No puede ser solo números';
                } else if (value.length > 200) {
                    error = 'Máximo 200 caracteres';
                } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(value)) {
                    error = 'Caracteres inválidos en la dirección';
                }
            }
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target || {};

        // Limitar caracteres según el campo
        let processedValue = value;
        if (name === 'contact_number' || name === 'emergency_contact') {
            processedValue = value.replace(/\D/g, '').slice(0, 9);
        } else if (name === 'first_name' || name === 'last_name') {
            processedValue = value.slice(0, 50);
        } else if (name === 'username') {
            processedValue = value.slice(0, 20);
        } else if (name === 'email') {
            processedValue = value.slice(0, 100);
        } else if (name === 'address') {
            processedValue = value.slice(0, 200);
        }

        const error = validateField(name, processedValue);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handlePositionChange = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            position: selectedOption.value
        }));

        setErrors(prev => ({
            ...prev,
            position: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos requeridos
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (['contact_number', 'emergency_contact', 'address'].includes(key)) return;
            newErrors[key] = validateField(key, formData[key]);
        });

        setErrors(newErrors);

        // Verificar si hay errores
        if (Object.values(newErrors).some(error => error)) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor corrige los errores en el formulario',
                icon: 'error'
            });
            return;
        }

        try {
            // Encriptar contraseña
            const hashedPassword = bcrypt.hashSync(formData.password, 10);

            const response = await axios.post(`http://localhost:8080/register`, {
                ...formData,
                password: hashedPassword
            });

            Swal.fire({
                title: 'Éxito',
                text: `Empleado registrado con contraseña: ${formData.password}`,
                icon: 'success'
            });

            navigate('/manager?tab=view-all-employees');
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.response?.data || 'Error al registrar empleado',
                icon: 'error'
            });
        }
    };

    return (
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row w-full'>
            <Link to="/manager?tab=view-all-employees">
                <IoChevronBackCircleSharp size={32} className='flex justify-start' />
            </Link>

            <div className='flex-1 flex justify-center'>
                <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
                    <h1 className='flex justify-center font-bold'>Agregar nuevo empleado</h1>
                    <hr />

                    <div className="grid grid-cols-2 gap-4">
                        {/* Campos del formulario */}
                        <div>
                            <Label value='Nombres*' />
                            <div className="relative">
                                <TextInput
                                    type='text'
                                    placeholder='Nombres'
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    name="first_name"
                                    color={errors.first_name ? 'failure' : ''}
                                    helperText={errors.first_name && <span className="text-red-500">{errors.first_name}</span>}
                                    maxLength="50"
                                />
                                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                    {formData.first_name.length}/50
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label value='Apellidos*' />
                            <div className="relative">
                                <TextInput
                                    type='text'
                                    placeholder='Apellidos'
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    name="last_name"
                                    color={errors.last_name ? 'failure' : ''}
                                    helperText={errors.last_name && <span className="text-red-500">{errors.last_name}</span>}
                                    maxLength="50"
                                />
                                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                    {formData.last_name.length}/50
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label value='Rol*' />
                            <Select
                                options={positions}
                                value={positions.find(option => option.value === formData.position)}
                                onChange={handlePositionChange}
                                placeholder="Seleccionar rol"
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable
                                noOptionsMessage={() => "No hay opciones disponibles"}
                            />
                            {errors.position && <div className="text-red-500 text-sm">{errors.position}</div>}
                        </div>

                        <div>
                            <Label value='Usuario*' />
                            <div className="relative">
                                <TextInput
                                    type='text'
                                    placeholder='Usuario'
                                    value={formData.username}
                                    onChange={handleChange}
                                    name="username"
                                    color={errors.username ? 'failure' : ''}
                                    helperText={errors.username && <span className="text-red-500">{errors.username}</span>}
                                    maxLength="20"
                                />
                                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                    {formData.username.length}/20
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label value='Correo electrónico' />
                            <div className="relative">
                                <TextInput
                                    type='email'
                                    placeholder='Correo electrónico'
                                    value={formData.email}
                                    onChange={handleChange}
                                    name="email"
                                    color={errors.email ? 'failure' : ''}
                                    helperText={errors.email && <span className="text-red-500">{errors.email}</span>}
                                    maxLength="50"
                                />
                                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                    {formData.email.length}/100
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label value='Número de contacto' />
                            <TextInput
                                type='text'
                                placeholder='Número de contacto'
                                value={formData.contact_number}
                                onChange={handleChange}
                                name="contact_number"
                                color={errors.contact_number ? 'failure' : ''}
                                helperText={errors.contact_number && <span className="text-red-500">{errors.contact_number}</span>}
                                maxLength="9"
                            />
                        </div>

                        <div>
                            <Label value='Dirección' />
                            <div className="relative">
                                <TextInput
                                    type='text'
                                    placeholder='Dirección'
                                    value={formData.address}
                                    onChange={handleChange}
                                    name="address"
                                    color={errors.address ? 'failure' : ''}
                                    helperText={errors.address && <span className="text-red-500">{errors.address}</span>}
                                    maxLength="200"
                                />
                                <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                    {formData.address.length}/200
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label value='Sexo' />
                            <Select
                                options={[
                                    { value: '', label: 'Seleccionar sexo' },
                                    { value: 'male', label: 'Masculino' },
                                    { value: 'female', label: 'Femenino' },
                                    { value: 'other', label: 'Otro' }
                                ]}
                                value={[
                                    { value: 'male', label: 'Masculino' },
                                    { value: 'female', label: 'Femenino' },
                                    { value: 'other', label: 'Otro' }
                                ].find(option => option.value === formData.gender) || { value: '', label: 'Seleccionar sexo' }}
                                onChange={(selected) => handleChange({ target: { name: 'gender', value: selected ? selected.value : '' } })}
                                className="basic-single"
                                classNamePrefix="select"
                                required
                            />
                            {errors.gender && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.gender}
                                </div>
                            )}
                        </div>

                        <div>
                            <Label value='Fecha de incorporación*' />
                            <TextInput
                                type='date'
                                value={formData.joined_date}
                                onChange={handleChange}
                                name="joined_date"
                                color={errors.joined_date ? 'failure' : ''}
                                helperText={errors.joined_date && <span className="text-red-500">{errors.joined_date}</span>}
                            />
                        </div>

                        <div>
                            <Label value='Talla de uniforme' />
                            <Select
                                options={[
                                    { value: '', label: 'Seleccionar talla' },
                                    { value: 'XS', label: 'XS' },
                                    { value: 'S', label: 'S' },
                                    { value: 'M', label: 'M' },
                                    { value: 'L', label: 'L' },
                                    { value: 'XL', label: 'XL' }
                                ]}
                                value={[
                                    { value: 'XS', label: 'XS' },
                                    { value: 'S', label: 'S' },
                                    { value: 'M', label: 'M' },
                                    { value: 'L', label: 'L' },
                                    { value: 'XL', label: 'XL' }
                                ].find(option => option.value === formData.uniform_size) || { value: '', label: 'Seleccionar talla' }}
                                onChange={(selected) => handleChange({ target: { name: 'uniform_size', value: selected ? selected.value : '' } })}
                                className="basic-single"
                                classNamePrefix="select"
                            />
                        </div>

                        <div>
                            <Label value='Contacto de emergencia' />
                            <TextInput
                                type='text'
                                placeholder='Contacto de emergencia'
                                value={formData.emergency_contact}
                                onChange={handleChange}
                                name="emergency_contact"
                                color={errors.emergency_contact ? 'failure' : ''}
                                helperText={errors.emergency_contact && <span className="text-red-500">{errors.emergency_contact}</span>}
                                maxLength="9"
                            />
                        </div>

                        <div>
                            <Label value='Contraseña' />
                            <TextInput
                                type='text'
                                value={formData.password}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded w-full">
                            Registrar empleado
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}