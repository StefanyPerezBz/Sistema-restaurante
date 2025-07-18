

import React, { useState, useEffect } from 'react';
import { Modal, Label, TextInput, Button } from 'flowbite-react';
import axios from 'axios';
import Select from 'react-select';
import Swal from 'sweetalert2';

const UpdateEmployeeModal = ({ employee, handleClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        position: '',
        contact_number: '',
        gender: '',
        joined_date: '',
        email: '',
        address: '',
        uniform_size: '',
        emergency_contact: '',
        profilePicture: ''
    });

    const [errors, setErrors] = useState({});
    const [positions, setPositions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (employee) {
            // Formatear la fecha correctamente para el input date
            const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                first_name: employee.first_name || '',
                last_name: employee.last_name || '',
                username: employee.username || '',
                position: employee.position || '',
                contact_number: employee.contact_number || '',
                gender: employee.gender || '',
                joined_date: formatDate(employee.joined_date) || '',
                email: employee.email || '',
                address: employee.address || '',
                uniform_size: employee.uniform_size || '',
                emergency_contact: employee.emergency_contact || '',
                profilePicture: employee.profilePicture || ''
            });
        }

        // Cargar posiciones desde localStorage o valores por defecto
        const savedPositions = localStorage.getItem('positions');
        const initialPositions = savedPositions ? JSON.parse(savedPositions) : [
            { value: 'cashier', label: 'Cajero' },
            { value: 'chef', label: 'Chef' },
            { value: 'waiter', label: 'Mesero' },
            { value: 'manager', label: 'Gerente' },
            { value: 'admin', label: 'Administrador' }
        ];
        setPositions(initialPositions);
    }, [employee]);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'first_name':
            case 'last_name':
                if (!value.trim()) {
                    error = 'Este campo es requerido';
                } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/.test(value)) {
                    error = 'Solo se permiten letras y algunos caracteres especiales';
                } else if (value.length > 50) {
                    error = 'Máximo 50 caracteres';
                }
                break;
            case 'email':
                if (value && !/\S+@\S+\.\S+/.test(value)) {
                    error = 'Correo electrónico inválido';
                } else if (value && value.length > 50) {
                    error = 'Máximo 50 caracteres';
                }
                break;
            case 'contact_number':
            case 'emergency_contact':
                if (value && !/^\d{9}$/.test(value)) {
                    error = 'Debe tener 9 dígitos exactamente';
                } else if (
                    name === 'contact_number' && 
                    value && 
                    formData.emergency_contact && 
                    value === formData.emergency_contact
                ) {
                    error = 'No puede ser igual al contacto de emergencia';
                } else if (
                    name === 'emergency_contact' && 
                    value && 
                    formData.contact_number && 
                    value === formData.contact_number
                ) {
                    error = 'No puede ser igual al número de contacto';
                }
                break;
            case 'position':
                if (!value) {
                    error = 'Este campo es requerido';
                }
                break;
            case 'uniform_size':
                if (value && !['XS', 'S', 'M', 'L', 'XL'].includes(value)) {
                    error = 'Talla no válida';
                }
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Manejo especial para nombres y apellidos
        if (name === 'first_name' || name === 'last_name') {
            const processedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]/g, '');
            
            setFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));

            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, processedValue)
            }));
            return;
        }

        // Manejo para campos numéricos (teléfonos)
        if (name === 'contact_number' || name === 'emergency_contact') {
            const processedValue = value.replace(/\D/g, '').slice(0, 9);
            
            setFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));

            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, processedValue)
            }));
            return;
        }

        // Manejo estándar para otros campos
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const handleSelectChange = (name, selectedOption) => {
        const value = selectedOption ? selectedOption.value : '';
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Campos requeridos
        const requiredFields = ['first_name', 'last_name', 'position'];
        requiredFields.forEach(field => {
            newErrors[field] = validateField(field, formData[field]);
            if (newErrors[field]) isValid = false;
        });

        // Campos opcionales pero con validación
        const optionalFields = ['email', 'contact_number', 'emergency_contact', 'uniform_size'];
        optionalFields.forEach(field => {
            newErrors[field] = validateField(field, formData[field]);
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor corrige los errores en el formulario',
                icon: 'error'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Preparar datos para enviar
            const dataToSend = {
                first_name: formData.first_name.trim(),
                last_name: formData.last_name.trim(),
                position: formData.position,
                contact_number: formData.contact_number || null,
                gender: formData.gender || null,
                email: formData.email || null,
                address: formData.address || null,
                uniform_size: formData.uniform_size || null,
                emergency_contact: formData.emergency_contact || null,
                profilePicture: formData.profilePicture || null
            };

            // Solo incluir campos que han cambiado
            const changes = {};
            Object.keys(dataToSend).forEach(key => {
                if (JSON.stringify(dataToSend[key]) !== JSON.stringify(employee[key])) {
                    changes[key] = dataToSend[key];
                }
            });

            if (Object.keys(changes).length === 0) {
                Swal.fire({
                    title: 'Info',
                    text: 'No se detectaron cambios para actualizar',
                    icon: 'info'
                });
                return;
            }

            const response = await axios.put(
                `http://localhost:8080/api/employees/update/${employee.id}`,
                changes,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            Swal.fire({
                title: '¡Éxito!',
                text: 'Empleado actualizado correctamente',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            onUpdate();
            handleClose();
        } catch (error) {
            console.error('Error al actualizar empleado:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar empleado',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!employee) return null;

    return (
        <Modal show={true} size="xl" onClose={handleClose} popup>
            <Modal.Header>
                <h1 className="text-xl font-bold">Actualizar empleado</h1>
            </Modal.Header>

            <Modal.Body>
                <form className="grid grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div>
                        <Label value='Nombres' />
                        <div className="relative">
                            <TextInput
                                value={formData.first_name}
                                onChange={handleChange}
                                name="first_name"
                                color={errors.first_name ? 'failure' : ''}
                                helperText={errors.first_name && <span className="text-red-500">{errors.first_name}</span>}
                                maxLength={50}
                            />
                            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                {formData.first_name.length}/50
                            </div>
                        </div>
                    </div>

                    {/* Apellido */}
                    <div>
                        <Label value='Apellidos' />
                        <div className="relative">
                            <TextInput
                                value={formData.last_name}
                                onChange={handleChange}
                                name="last_name"
                                color={errors.last_name ? 'failure' : ''}
                                helperText={errors.last_name && <span className="text-red-500">{errors.last_name}</span>}
                                maxLength={50}
                            />
                            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                {formData.last_name.length}/50
                            </div>
                        </div>
                    </div>

                    {/* Usuario (no editable) */}
                    <div>
                        <Label value='Usuario' />
                        <TextInput
                            value={formData.username}
                            readOnly
                            className="cursor-not-allowed bg-gray-100"
                        />
                    </div>

                    {/* Fecha de incorporación (no editable) */}
                    <div>
                        <Label value='Fecha de incorporación' />
                        <TextInput
                            type='date'
                            value={formData.joined_date}
                            readOnly
                            className="cursor-not-allowed bg-gray-100"
                        />
                    </div>

                    {/* Posición */}
                    <div>
                        <Label value='Rol' />
                        <Select
                            options={positions}
                            value={positions.find(option => option.value === formData.position)}
                            onChange={(selected) => handleSelectChange('position', selected)}
                            placeholder="Seleccionar rol"
                            isSearchable
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: errors.position ? '#dc2626' : base.borderColor,
                                    minHeight: '42px'
                                })
                            }}
                        />
                        {errors.position && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.position}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label value='Correo electrónico' />
                        <div className="relative">
                            <TextInput
                                type='email'
                                value={formData.email}
                                onChange={handleChange}
                                name="email"
                                color={errors.email ? 'failure' : ''}
                                helperText={errors.email && <span className="text-red-500">{errors.email}</span>}
                                maxLength={50}
                            />
                            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                {formData.email.length}/50
                            </div>
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                        <Label value='Número de contacto' />
                        <TextInput
                            value={formData.contact_number}
                            onChange={handleChange}
                            name="contact_number"
                            color={errors.contact_number ? 'failure' : ''}
                            helperText={errors.contact_number && <span className="text-red-500">{errors.contact_number}</span>}
                            maxLength={9}
                            placeholder="987654321"
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <Label value='Dirección' />
                        <div className="relative">
                            <TextInput
                                value={formData.address}
                                onChange={handleChange}
                                name="address"
                                maxLength={50}
                            />
                            <div className="absolute right-2 bottom-2 text-xs text-gray-500">
                                {formData.address.length}/50
                            </div>
                        </div>
                    </div>

                    {/* Género */}
                    <div>
                        <Label value='Sexo' />
                        <Select
                            options={[
                                { value: 'male', label: 'Masculino' },
                                { value: 'female', label: 'Femenino' },
                                { value: 'other', label: 'Otro' }
                            ]}
                            value={[
                                { value: 'male', label: 'Masculino' },
                                { value: 'female', label: 'Femenino' },
                                { value: 'other', label: 'Otro' }
                            ].find(option => option.value === formData.gender)}
                            onChange={(selected) => handleSelectChange('gender', selected)}
                            placeholder="Seleccionar sexo"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: '42px'
                                })
                            }}
                        />
                    </div>

                    {/* Talla de uniforme */}
                    <div>
                        <Label value='Talla de uniforme' />
                        <Select
                            options={[
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
                            ].find(option => option.value === formData.uniform_size)}
                            onChange={(selected) => handleSelectChange('uniform_size', selected)}
                            placeholder="Seleccionar talla"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    minHeight: '42px'
                                })
                            }}
                        />
                        {errors.uniform_size && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.uniform_size}
                            </div>
                        )}
                    </div>

                    {/* Contacto de emergencia */}
                    <div>
                        <Label value='Contacto de emergencia' />
                        <TextInput
                            value={formData.emergency_contact}
                            onChange={handleChange}
                            name="emergency_contact"
                            color={errors.emergency_contact ? 'failure' : ''}
                            helperText={errors.emergency_contact && <span className="text-red-500">{errors.emergency_contact}</span>}
                            maxLength={9}
                            placeholder="987654321"
                        />
                    </div>
                </form>
            </Modal.Body>

            <Modal.Footer className="flex justify-end">
                <Button 
                    color="gray" 
                    onClick={handleClose}
                    className="mr-2"
                >
                    Cancelar
                </Button>
                <Button 
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                    gradientDuoTone="greenToBlue"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Actualizando...
                        </>
                    ) : 'Actualizar empleado'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateEmployeeModal;