import React,  { useState } from 'react';
import { Modal, Label, TextInput, Button, Alert } from 'flowbite-react';
import axios from 'axios';
import AddPositionModal from './AddPositionModal';

const allowedPositions = ['Waiter', 'Chef', 'Cashier'];

const UpdateEmployeeModal = ({ employee, handleClose }) => {
    if (!employee) {
        return null; // Handle case where employee prop is not yet available
    }

   const [formData, setFormData] = useState({
        username: employee.username || '',
        position: employee.position || '',
        email: employee.email || '',
        contact_number: employee.contact_number || '',
        address: employee.address || '',
        gender: employee.gender || '',
        uniform_size: employee.uniform_size || '',
        emergency_contact: employee.emergency_contact || ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [contactErrorMessage, setContactErrorMessage] = useState('');
    const [emergencyContactErrorMessage, setEmergencyContactErrorMessage] = useState('');
    const [showAddPositionModal, setShowAddPositionModal] = useState(false);
     const [positions, setPositions] = useState(() => {
        // Retrieve positions from local storage or use default positions
        const savedPositions = localStorage.getItem('positions');
        return savedPositions ? JSON.parse(savedPositions) : ['Cashier', 'Chef', 'Waiter', 'Kitchen Helper'];
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';

        // Validate input based on field name
        if (name === 'contact_number' || name === 'emergency_contact') {
            if ( value !== '' && !/^\d+$/.test(value)) {
                errorMessage('');
            }else if (name === 'contact_number'){
                if(value.length > 10) {
                    errorMessage('');
                }else if (value.length < 10) {
                    setContactErrorMessage('El número de móvil no debe tener menos de 10 dígitos');
                }else{
                    setContactErrorMessage('');
                }
            }else if (name === 'emergency_contact') {
                if(value.length > 10) {
                    errorMessage('');
                }else if (value.length < 10) {
                    setEmergencyContactErrorMessage('El número de teléfono móvil no debe tener menos de 10 dígitos');
                }else{
                    setEmergencyContactErrorMessage('');
                }
            }
        } else if (name === 'email') {
            if (!/\S+@\S+\.\S+/.test(value)) {
                setEmailErrorMessage('Por favor, introduce una dirección de correo electrónico válida');
            } else {
                setEmailErrorMessage('');
            }
        }

         if (value === 'Add New') {
            setShowAddPositionModal(true);
        } else {
            setShowAddPositionModal(false);
        }

        setFormData({ ...formData, [name]: value });
        setErrorMessage(errorMessage);
        console.log(formData);
    };

    const handleAddPosition = (newPosition) => {
        const updatedPositions = [...positions, newPosition];
        setPositions(updatedPositions);
        localStorage.setItem('positions', JSON.stringify(updatedPositions)); // Save positions to local storage
    };

    const handleShowAddPositionModal = () => {
            setShowAddPositionModal(true);
    };

    const handleCloseAddPositionModal = () => {
        setShowAddPositionModal(false);
    };


    const handleUpdateEmployee = async () => {
        try {
            const updatedEmployee = {
                ...employee,
                ...formData
            };

            await axios.put(`http://localhost:8080/api/user/updateEmployee/${employee.id}`, updatedEmployee);

            // Assuming successful update, you might want to handle UI changes or show a message
            console.log('Empleado actualizado exitosamente');
            handleClose(); // Close the modal after successful update
        } catch (error) {
            console.error('No se pudo actualizar el empleado', error);
            // Handle error state or display an error message
        }
    };

   
    return (
         <Modal show={true} size="md" onClose={handleClose} popup className="flex items-center justify-center">
            {/* Modal Content */}
            <Modal.Header>
                <h1 className="text-3xl font-bold mb-4 text-center">Actualizar empleado</h1>
            </Modal.Header>
            <Modal.Body>
                <form className="grid grid-cols-2 gap-4">
                    <div>
                        <Label value='First Name' />
                        <TextInput type='text' id='FirstName' value={employee.first_name || ''} name="first_name" readOnly />
                    </div>
                    <div>
                        <Label value='Last Name' />
                        <TextInput type='text' id='LastName' value={employee.last_name || ''}  name="last_name" readOnly  />
                    </div>
                    <div>
                        <Label value='Username*' />
                        <TextInput type='text' placeholder='Username' id='Username' value={formData.username || ''} onChange={handleChange} name="username" required disabled={!allowedPositions.includes(formData.position)}/>
                    </div>
            
                   <div>
                            <Label value='Position*' /> <br/>
                            <select id='Position' value={formData.position} onChange={handleChange} name='position' className='w-full' required>
                                <option value='' >Seleccionar rol</option>
                                {positions.map((position, index) => (
                                    <option key={index} value={position}>
                                        {position}
                                    </option>
                                ))}
                                <option value='Add New' >Agregar nuevo rol</option>
                            </select>
                        </div>
                        
                    <div>
                        <Label value='Email*' />
                        <TextInput type='text' placeholder='Email' id='Email' value={formData.email} onChange={handleChange} name="email" required />
                        {emailErrorMessage && <span className="text-red-500 text-sm">{emailErrorMessage}</span>}
                    </div>
                    <div>
                        <Label value='Contact Number' />
                        <TextInput type='text' placeholder="Contact Number" id='Contact' value={formData.contact_number} onChange={handleChange} name="contact_number" />
                        {contactErrorMessage && <span className="text-red-500 text-sm">{contactErrorMessage}</span>}
                    </div>
                    <div>
                        <Label value='Address' />
                        <TextInput type='text' placeholder='Address' id='Address' value={formData.address} onChange={handleChange} name="address" />
                    </div>
                    <div>
                        <Label value='Gender' />
                        <select id='Gender' value={formData.gender} name='gender' className='w-full px-3 py-2 border rounded-md dark:bg-gray-700' readOnly>
                            <option value=''>Seleccionar sexo</option>
                            <option value='male'>Masculino</option>
                            <option value='female'>Femenino</option>
                            <option value='other'>Otro</option>
                        </select>
                    </div>
                    <div>
                        <Label value='Joined Date' />
                        <TextInput type='date' id='JoinedDate' value={employee.joined_date} name="joined_date" readOnly />
                    </div>
                    <div>
                        <Label value='Uniform Size' />
                        <select id='UniformSize' value={formData.uniform_size} name='uniform_size' onChange={handleChange} className='w-full px-3 py-2 border rounded-md dark:bg-gray-700' >
                            <option value=''>Seleccionar talla</option>
                            <option value='XS'>XS</option>
                            <option value='S'>S</option>
                            <option value='M'>M</option>
                            <option value='L'>L</option>
                            <option value='XL'>XL</option>
                        </select>
                    </div>
                    <div>
                        <Label value='Emergency Contact' />
                        <TextInput type='text' placeholder='Emergency Contact' id='EmergencyContact' value={formData.emergency_contact} onChange={handleChange} name="emergency_contact" />
                        {emergencyContactErrorMessage && <span className="text-red-500 text-sm">{emergencyContactErrorMessage}</span>}
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button onClick={handleClose} className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 mr-2 rounded w-full">Close</Button> */}
                <Button onClick={handleUpdateEmployee} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 ml-2 rounded w-full">Actualizar empleado</Button>
            </Modal.Footer>

            {errorMessage && (
                    <Alert className='mt-5' color='failure'>
                        {errorMessage}
                    </Alert>
                    )}

                     {/* Render AddPositionModal */}
                    {showAddPositionModal && (
                        <AddPositionModal
                            isOpen={handleShowAddPositionModal}
                            onClose={handleCloseAddPositionModal}
                            onAddPosition={handleAddPosition}
                        />
                    )}

        </Modal>
    );
};

export default UpdateEmployeeModal;
