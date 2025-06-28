// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table } from "flowbite-react";
// import { Link } from 'react-router-dom';
// import UpdateEmployeeModal from './UpdateEmployeeModal';


// const ViewAllEmployees = () => {
//     const [employees, setEmployees] = useState([]);
//     const [showUpdateModal, setShowUpdateModal] = useState(false);
//     const [employeeUpdate, setEmployeeUpdate] = useState(null);
//     const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//     const [clickedImageURL, setClickedImageURL] = useState("");
//     const defaultPropic = 'https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png';

//     //search bar
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchCriteria, setSearchCriteria] = useState('');


//     //filter by job role
//     const [selectedJobRole, setSelectedJobRole] = useState('');
//     const [jobRoles, setJobRoles] = useState([]);

//     useEffect(() => {
//         const ViewAllEmployees = async () => {
//             try {
//                 let url = 'http://localhost:8080/api/user/manage-employees';
//                 if (searchQuery || selectedJobRole) {
//                     url += `?`;
//                     if (searchQuery) {
//                         url += `${searchCriteria}=${searchQuery}`;
//                     }
//                     if (searchQuery && selectedJobRole) {
//                         url += `&`;
//                     }
//                     if (selectedJobRole) {
//                         url += `position=${selectedJobRole}`;
//                     }
//                 }
//                 const response = await fetch(url);
//                 const data = await response.json();
//                 setEmployees(data);
//             }
//             catch (error) {
//                 console.log(err.message);
//             }
//         };
//         const fetchJobRoles = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8080/api/user/job-roles');
//                 setJobRoles(response.data); // Assuming the response is an array of job roles
//             }catch (error) {
//                 console.error('No se pudieron obtener los roles de trabajo:', error);
//             }
//          };
//         ViewAllEmployees();
//         fetchJobRoles();
//     }, []);

//     //Delete employee
//     const handleDelete = async (id, username) => {
//         if (window.confirm(`¿Está seguro de que desea eliminar al empleado ${username}?`)) {
//             try {
//                 await axios.delete(`http://localhost:8080/api/user/delete/${id}`);
//                 setEmployees(employees.filter(employee => employee.id !== id));
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//     }

//     //handle search
//     const handleSearch = async () => {
//         try {
//             let url = 'http://localhost:8080/api/user/manage-employees';
//             if (searchQuery || selectedJobRole) {
//                 url += `?`;
//                 if (searchQuery) {
//                     url += `${searchCriteria}=${searchQuery}`;
//                 }
//                 if (searchQuery && selectedJobRole) {
//                     url += `&`;
//                 }
//                 if (selectedJobRole) {
//                     url += `position=${selectedJobRole}`;
//                 }
//             }
//             const response = await fetch(url);
//             const data = await response.json();
//             setEmployees(data);
//             console.log(data);
//         } catch (error) {
//             console.log(error.message);
//         }
//     };


//     const handleUpdateClick = (employee) => {
//         setEmployeeUpdate(employee);
//         setShowUpdateModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowUpdateModal(false);
//         setEmployeeUpdate(null);
//     };

//     const handleImageClick = (imageUrl) => {
//       if (imageUrl && imageUrl !== defaultPropic) {
//           setClickedImageURL(imageUrl);
//           setIsImageModalOpen(true);
//       }
//     };


//      return (
//        <div className="flex flex-col w-full bg-gray-200">
//          <div className="flex items-center m-4 justify-between border-b bg-white dark:bg-gray-500 p-3 shadow-md rounded-md">
//            <h1 className="text-2xl font-bold mb-2">Detalles del empleado</h1>

//            <div className="flex items-center">
//              {/* Search Bar */}
//              <div className="flex-grow px-3 border rounded-full dark:bg-gray-600">
//                <input
//                  type="search"
//                  placeholder="Buscar empleado..."
//                  value={searchQuery}
//                  onChange={(e) => setSearchQuery(e.target.value)}
//                  className="flex-grow px-4 py-2 border-none outline-none focus:ring-0 dark:bg-gray-600 dark:text-white"
//                />
//              </div>

//              {/* Job Role filter */}
//              <div className="ml-2">
//               <select
//                 value={selectedJobRole}
//                 onChange={(e) => setSelectedJobRole(e.target.value)}
//                 className="py-2 px-4 bg-white border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//               >
//                 <option value="">Todos los roles</option>
//                 {jobRoles.map((role, index) => (
//                   <option key={index} value={role}>
//                     {role}
//                   </option>
//                 ))}
//               </select>

//             </div>

//              {/* Add Employee button */}
//              <Link
//                to="/manager?tab=new-employee"
//                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 ml-2 rounded px-4"
//              >
//                Agregar empleado
//              </Link>
//            </div>
//          </div>

//           {/* Update Employee Modal */}
//          {showUpdateModal && (
//            <UpdateEmployeeModal
//              employee={employeeUpdate}
//              handleClose={handleCloseModal}
//            />
//          )}

//          <div className='flex justify-center'>
//             {/* Image Modal */}
//             {isImageModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
//                     <div className="max-w-sm max-h-lg bg-slate-100 rounded-lg relative">
//                         <img src={clickedImageURL} alt="Profile" className="max-w-full max-h-full" />
//                         <button
//                             onClick={() => setIsImageModalOpen(false)}
//                             className="absolute top-2 right-2 text-gray-700 hover:text-red-500 focus:outline-none"
//                         >
//                             X
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>



//          {/* Table */}
//          <div className="m-4 relative overflow-x-auto shadow-md bg-white rounded-md">
//            <Table hoverable>
//              <Table.Head>
//                <Table.HeadCell className="bg-green-100"> Foto de perfil </Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Usuario </Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Nombre </Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Rol </Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Contacto</Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Correo electrónico</Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Dirección</Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Sexo</Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Fecha de incorporación </Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Talla </Table.HeadCell>
//                <Table.HeadCell className="bg-green-100"> Contacto de emergencia</Table.HeadCell>
//                <Table.HeadCell className="bg-green-100" colSpan={2}> </Table.HeadCell>
//              </Table.Head>
//              <Table.Body className="divide-y">
//                {employees
//                  .filter((employee) => {
//                    if (!searchQuery && !selectedJobRole) {
//                      return true;
//                    } else {
//                      return Object.values(employee).some(
//                        (value) =>
//                          value &&
//                          value
//                            .toString()
//                            .toLowerCase()
//                            .includes(searchQuery.toLowerCase()) &&
//                          (!selectedJobRole ||
//                            employee.position === selectedJobRole)
//                      );
//                    }
//                  })
//                  .map((employee, index) => (
//                    <Table.Row
//                      key={employee.id}
//                      className={
//                        index % 2 === 0
//                          ? "bg-gray-100 dark:bg-gray-500 dark:text-white"
//                          : "bg-gray-150 dark:bg-gray-700 dark:text-white"
//                     }>


//                     <Table.Cell
//                       onClick={() => handleImageClick(employee.profilePicture)}
//                       style={{ cursor: 'pointer' }}
//                       className="text-black dark:text-slate-200 dark:bg-gray-600"
//                     >
//                       <img
//                         src={employee.profilePicture ? employee.profilePicture : defaultPropic}
//                         className="rounded-full w-full h-full object-cover"
//                         style={{ width: '40px', height: '40px', opacity: employee.profilePicture ? 1 : 0.5 }}
//                         alt="Profile"
//                       />
//                     </Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.username} </Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{`${employee.first_name} ${employee.last_name}`} </Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.position}</Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.contact_number} </Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.email}</Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.address}</Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.gender}</Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.joined_date} </Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.uniform_size}</Table.Cell>
//                      <Table.Cell className="text-black dark:text-slate-200 dark:bg-gray-600">{employee.emergency_contact}</Table.Cell>
//                      <Table.Cell className="dark:bg-gray-600">
//                        <button onClick={() => handleUpdateClick(employee)}
//                          className={`font-medium text-blue-600 ${employee.position === "manager"? "cursor-not-allowed text-gray-400": "hover:scale-110"}`}
//                           disabled={employee.position === "manager"} >
//                             Actualizar
//                        </button>
//                      </Table.Cell>
//                      <Table.Cell className="dark:bg-gray-600">
//                        <button onClick={() => handleDelete(employee.id, employee.username)} className="font-medium text-red-800 dark:text-red-400 hover:scale-110"> Eliminar </button>
//                      </Table.Cell>
//                    </Table.Row>
//                  ))}
//              </Table.Body>
//            </Table>
//          </div>
//        </div>
//      );
// }

// export default ViewAllEmployees;

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
    const defaultPropic = 'https://upload.wikimedia.org/wikipedia/commons/6/67/User_Avatar.png';
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
                    axios.get('http://localhost:8080/api/user/manage-employees'),
                    axios.get('http://localhost:8080/api/user/job-roles')
                ]);
                setEmployees(employeesResponse.data);
                setFilteredEmployees(employeesResponse.data);
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
        if (imageUrl && imageUrl !== defaultPropic) {
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
                <div onClick={() => handleImageClick(row.profilePicture)} style={{ cursor: 'pointer' }}>
                    <img
                        src={row.profilePicture || defaultPropic}
                        className="rounded-full"
                        style={{ width: '40px', height: '40px', opacity: row.profilePicture ? 1 : 0.5 }}
                        alt="Profile"
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
            selector: row => row.gender,
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
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewAllEmployees;