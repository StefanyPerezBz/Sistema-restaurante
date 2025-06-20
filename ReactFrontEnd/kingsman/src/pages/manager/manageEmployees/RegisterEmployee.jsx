import React, { useEffect, useState } from 'react';
import { Alert, Label, TextInput } from 'flowbite-react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AddPositionModal from './AddPositionModal';
import { IoChevronBackCircleSharp } from "react-icons/io5";

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
    const [errorMessage, setErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [contactErrorMessage, setContactErrorMessage] = useState('');
    const [EmergencyContactErrorMessage, setEmergencyContactErrorMessage] = useState('');
    const [showAddPositionModal, setShowAddPositionModal] = useState(false);
    const [positions, setPositions] = useState(() => {
        // Retrieve positions from local storage or use default positions
        const savedPositions = localStorage.getItem('positions');
        return savedPositions ? JSON.parse(savedPositions) : ['Cashier', 'Chef', 'Waiter'];
    });

    const navigate = useNavigate();

    const generatePassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&';
        const length = 6;
        let newPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            newPassword += characters.charAt(randomIndex);
        }
        return newPassword;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = '';

        //validate contacts
        if (name === 'contact_number' || name === 'emergency_contact') {
            if ( value !== '' && !/^\d+$/.test(value)) {
                // errorMessage('Please enter only numbers for mobile number');
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
                    // errorMessage('Emergency contact number should not exceed 10 digits');
                    errorMessage('');
                }else if (value.length < 10) {
                    setEmergencyContactErrorMessage('El número de móvil no debe tener menos de 10 dígitos');
                }else{
                    setEmergencyContactErrorMessage('');
                }
            }
        //validate names
        } else if (name === 'first_name' || name === 'last_name') {
            if ( value !== '' && !/^[a-zA-Z]+$/.test(value)) {
                // errorMessage('Please enter only letters for first name and last name');
                errorMessage('');
            }
        //validate email
        }else if (name === 'email') {
            if (!/\S+@\S+\.\S+/.test(value)) {
            setEmailErrorMessage('Por favor, introduce una dirección de correo electrónico válida');
            }else {
                setEmailErrorMessage('');
            }
        }  
    
        // For position input field
         if (value === 'Add New') {
            setShowAddPositionModal(true);
        } else {
            setShowAddPositionModal(false);
        }
            // For other input fields
            setFormData({
                ...formData,
                [name]: value,
            });
            setErrorMessage(errorMessage); 
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // handleResetForm();

        try {
            const response = await axios.post('http://localhost:8080/register', formData);
            console.log(response.data);
            const generatedPassword = formData.password; // Accessing the auto-generated password from form data
            const successMessage = `Registrado exitosamente con contraseña: ${generatedPassword}`;
            setErrorMessage(successMessage);

            // navigate('/manager?tab=view-all-employees');
        } catch (error) {
            if (error.response) {
                // Extract the error message from the response data and display it
                setErrorMessage(error.response.data);
            } else if (error.request) {
                // This usually indicates a network error or the server did not respond
                console.log(error.request);
                setErrorMessage('Se produjo un error de red. Inténtelo de nuevo más tarde..');
            } else {
                // Something happened in setting up the request that triggered an error
                console.log('Error', error.message);
                setErrorMessage('Registro fallido');
            };
        }
    };
    useEffect(() => {
        setFormData({
            ...formData,
            password: generatePassword()
        });
    }, []);

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

    return (
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row w-full '>
            <Link to="/manager?tab=view-all-employees">
                <IoChevronBackCircleSharp size={32} className='flex justify-start' />
            </Link>
            <div className='flex-1 flex justify-center'>
                <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit}>
                    <h1 className='flex justify-center font-bold'> Agregar nuevo empleado</h1> <hr></hr>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label value='First Name*' />
                            <TextInput type='text' placeholder='Nombres' id='FirstName' value={formData.first_name} onChange={handleChange} name="first_name" required />
                        </div>
                        <div>
                            <Label value='Last Name*' />
                            <TextInput type='text' placeholder='Apellidos' id='LastName' value={formData.last_name} onChange={handleChange} name="last_name" required/>
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
                            <Label value='Username*' />
                            <TextInput type='text' placeholder='Usuario' id='Username' value={formData.username} onChange={handleChange} name="username" required />
                        </div>

                        <div>
                            <Label value='Email*' />
                            <TextInput type='text' placeholder='Correo electrónico' id='Email' value={formData.email} onChange={handleChange} name="email"  required/>
                            {emailErrorMessage && <div className="text-red-500 text-sm ">{emailErrorMessage}</div>}
                        </div>
                        <div>
                            <Label value='Contact Number' />
                            <TextInput type='text' placeholder='Número de contacto' id='Contact' value={formData.contact_number} onChange={handleChange} name="contact_number" />
                            {contactErrorMessage && <div className="text-red-500 text-sm">{contactErrorMessage}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label value='Address' />
                            <TextInput type='text' placeholder='Dirección' id='Address' value={formData.address} onChange={handleChange} name="address"/>
                        </div>
                        <div>
                            <Label value='Gender' /> <br/>
                            <select id='Gender' value={formData.gender} onChange={handleChange} name='gender' className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 '>
                                <option value=''>Seleccionar sexo</option>
                                <option value='male'>Masculino</option>
                                <option value='female'>Femenino</option>
                                <option value='other'>Otro</option>
                            </select>
                        </div>                    
                        <div>
                            <Label value='Joined Date*' />
                            <TextInput type='date' placeholder='Fecha de incorporación' id='JoinedDate' className='text-gray-400' value={formData.joined_date} onChange={handleChange} name="joined_date" required/>
                        </div> 
                        <div>
                            <Label value='Uniform Size' /> <br/>
                            <select id='UniformSize' value={formData.uniform_size} name='uniform_size' onChange={handleChange} className='w-full px-3 py-2 border rounded-md dark:bg-gray-700' >
                                <option value=''>Seleccionar talla</option>
                                <option value='Extra Small'> XS </option>
                                <option value='Small'> S </option>
                                <option value='Medium'> M </option>
                                <option value='Large'> L </option>
                                <option value='Extra Large'> XL </option>
                            </select>
                        </div>
                        <div>
                            <Label value='Emergency Contact' />
                            <TextInput type='text' placeholder='Contacto de emergencia' id='EmergencyContact' value={formData.emergency_contact} onChange={handleChange} name="emergency_contact" />
                            {EmergencyContactErrorMessage && <div className="text-red-500 text-sm ">{EmergencyContactErrorMessage}</div>}
                        </div>
                         
                        <div>
                            <Label value='Password' />
                            <TextInput type='text' placeholder='Contraseña' id='Password' value={formData.password} />
                        </div>
                    </div>

                    <div className="flex justify-between">
                        {/* <button type="reset" className="bg-slate-500 hover:bg-slate-700 text-white font-bold py-2 mr-2 rounded w-full md:w-1/2 " id="clearbtn" onClick={handleResetForm}> Clear </button> */}
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 ml-2 rounded w-full "> Registrar empleado </button>
                    </div>

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

                </form>
            </div>
        </div>
    );
}
