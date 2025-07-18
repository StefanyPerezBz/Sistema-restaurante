import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import UpdateEmployeeModal from './UpdateEmployeeModal';
import Swal from 'sweetalert2';
import { FaSearch, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Select from 'react-select';

const ViewAllEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [employeeUpdate, setEmployeeUpdate] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [clickedImageURL, setClickedImageURL] = useState("");
    const defaultProfilePic = '/public/default-profile.jpg'; // Ruta a tu imagen por defecto
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedJobRole, setSelectedJobRole] = useState('');
    const [jobRoles, setJobRoles] = useState([]);
    const [pending, setPending] = useState(true);
    const [refresh, setRefresh] = useState(false);

    // Diccionario de traducción de roles
    const roleTranslations = {
        'cashier': 'Cajero',
        'waiter': 'Mesero',
        'chef': 'Chef',
        'cleaner': 'Limpieza',
        'bartender': 'Bartender',
        'supervisor': 'Supervisor',
        'assistant': 'Asistente',
        'security': 'Seguridad',
        'manager': 'Gerente'
    };

    // Función para traducir roles
    const translateRole = (role) => roleTranslations[role] || role;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setPending(true);
                const [employeesResponse, jobRolesResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/user/manage-employees`),
                    axios.get(`http://localhost:8080/api/user/job-roles`)
                ]);
                
                // Procesar empleados para asegurar que tengan una imagen válida
                const processedEmployees = employeesResponse.data.map(employee => ({
                    ...employee,
                    profilePicture: employee.profilePicture 
                        ? `http://localhost:8080/api/food/image/${employee.profilePicture}`
                        : defaultProfilePic
                }));
                
                setEmployees(processedEmployees);
                setFilteredEmployees(processedEmployees);
                
                // Mapeamos los roles para react-select
                const rolesOptions = jobRolesResponse.data.map(role => ({
                    value: role,
                    label: translateRole(role)
                }));
                setJobRoles(rolesOptions);
                setPending(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudieron cargar los datos de empleados',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                setPending(false);
            }
        };
        fetchData();
    }, [refresh]);

    useEffect(() => {
        const result = employees.filter(employee => {
            // Filtro por rol de trabajo
            const roleMatch = selectedJobRole === '' || employee.position === selectedJobRole;

            // Filtro por búsqueda
            const searchMatch =
                searchQuery === '' ||
                Object.values(employee).some(
                    value =>
                        value &&
                        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                );

            return roleMatch && searchMatch;
        });
        setFilteredEmployees(result);
    }, [searchQuery, selectedJobRole, employees]);

    const handleDelete = async (id, username) => {
        Swal.fire({
            title: '¿Está seguro?',
            text: `¿Desea eliminar al empleado ${username}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/user/delete/${id}`);
                    setRefresh(!refresh);
                    Swal.fire(
                        'Eliminado!',
                        'El empleado ha sido eliminado.',
                        'success'
                    );
                } catch (error) {
                    console.error(error);
                    Swal.fire(
                        'Error',
                        'No se pudo eliminar el empleado',
                        'error'
                    );
                }
            }
        });
    }

    const handleUpdateClick = (employee) => {
        setEmployeeUpdate(employee);
        setShowUpdateModal(true);
    };

    const handleCloseModal = () => {
        setShowUpdateModal(false);
        setEmployeeUpdate(null);
    };

    const handleImageClick = (imageUrl) => {
        if (imageUrl && imageUrl !== defaultProfilePic) {
            setClickedImageURL(imageUrl);
            setIsImageModalOpen(true);
        }
    };

    const handleRoleChange = (selectedOption) => {
        setSelectedJobRole(selectedOption ? selectedOption.value : '');
    };

    const columns = [
        {
            name: 'Foto',
            cell: row => (
                <div 
                    onClick={() => handleImageClick(row.profilePicture)} 
                    style={{ cursor: row.profilePicture !== defaultProfilePic ? 'pointer' : 'default' }}
                >
                    <img
                        src={row.profilePicture}
                        className="rounded-full"
                        style={{ 
                            width: '40px', 
                            height: '40px', 
                            objectFit: 'cover',
                            border: '2px solid #e2e8f0',
                            opacity: row.profilePicture !== defaultProfilePic ? 1 : 0.7
                        }}
                        alt="Profile"
                        onError={(e) => {
                            e.target.src = defaultProfilePic;
                            e.target.style.opacity = 0.7;
                        }}
                    />
                </div>
            ),
            width: '80px',
            ignoreRowClick: true
        },
        {
            name: 'Usuario',
            selector: row => row.username,
            sortable: true,
            wrap: true
        },
        {
            name: 'Nombre',
            selector: row => `${row.first_name} ${row.last_name}`,
            sortable: true,
            wrap: true
        },
        {
            name: 'Rol',
            selector: row => translateRole(row.position),
            sortable: true,
            wrap: true
        },
        {
            name: 'Contacto',
            selector: row => row.contact_number,
            wrap: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            wrap: true
        },
        {
            name: 'Dirección',
            selector: row => row.address,
            wrap: true
        },
        {
            name: 'Sexo',
            selector: row => row.gender === 'male' ? 'Masculino' :
                row.gender === 'female' ? 'Femenino' :
                    'Otro',
            wrap: true
        },
        {
            name: 'Fecha Ingreso',
            selector: row => new Date(row.joined_date).toLocaleDateString('es-PE'),
            wrap: true
        },
        {
            name: 'Talla',
            selector: row => row.uniform_size,
            wrap: true
        },
        {
            name: 'Contacto Emergencia',
            selector: row => row.emergency_contact,
            wrap: true
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="flex space-x-3 items-center">
                    <button
                        onClick={() => handleUpdateClick(row)}
                        className={`flex items-center space-x-1 text-blue-600 hover:text-blue-800 ${row.position === "manager" ? "text-gray-400 cursor-not-allowed" : ""
                            }`}
                        disabled={row.position === "manager"}
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row.username)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                        disabled={row.position === "manager"}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '150px'
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f8fafc',
                fontWeight: 'bold',
                fontSize: '14px',
            },
        },
        cells: {
            style: {
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
            },
        },
    };

    // Estilos personalizados para react-select
    const selectStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: '42px',
            borderRadius: '0.375rem',
            borderColor: '#d1d5db',
            '&:hover': {
                borderColor: '#9ca3af'
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#3b82f6' : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
            '&:hover': {
                backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
            }
        })
    };

    return (
        <div className="flex flex-col w-full p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Detalles del empleado</h1>

                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="search"
                            placeholder="Buscar empleado..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="w-full md:w-48">
                        <Select
                            options={[{ value: '', label: 'Todos los roles' }, ...jobRoles]}
                            value={selectedJobRole ? { value: selectedJobRole, label: translateRole(selectedJobRole) } : { value: '', label: 'Todos los roles' }}
                            onChange={handleRoleChange}
                            placeholder="Filtrar por rol"
                            styles={selectStyles}
                            isSearchable
                            noOptionsMessage={() => "No hay roles disponibles"}
                        />
                    </div>

                    <Link
                        to="/manager?tab=new-employee"
                        className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                    >
                        <FaUserPlus className="mr-2" />
                        Agregar
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-md shadow overflow-hidden">
                <DataTable
                    columns={columns}
                    data={filteredEmployees}
                    customStyles={customStyles}
                    progressPending={pending}
                    responsive
                    pagination
                    highlightOnHover
                    noDataComponent={
                        <div className="p-4 text-center text-gray-500">
                            No se encontraron empleados
                        </div>
                    }
                    fixedHeader
                    fixedHeaderScrollHeight="calc(100vh - 200px)"
                />
            </div>

            {showUpdateModal && (
                <UpdateEmployeeModal
                    employee={employeeUpdate}
                    handleClose={handleCloseModal}
                    onUpdate={() => {
                        setRefresh(!refresh);
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Empleado actualizado correctamente',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        });
                    }}
                />
            )}

            {isImageModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg max-w-md max-h-full">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Foto de perfil</h3>
                            <button
                                onClick={() => setIsImageModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        <img
                            src={clickedImageURL}
                            alt="Profile"
                            className="max-w-full max-h-[70vh] object-contain"
                            onError={(e) => {
                                e.target.src = defaultProfilePic;
                                setIsImageModalOpen(false);
                                Swal.fire({
                                    title: 'Error',
                                    text: 'No se pudo cargar la imagen del perfil',
                                    icon: 'error',
                                    confirmButtonText: 'Aceptar'
                                });
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewAllEmployees;