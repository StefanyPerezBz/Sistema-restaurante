import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextInput, Label } from "flowbite-react";
import { ToggleSwitch } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import EditFoodItem from './EditFoodItem';
import AddFoodItem from './AddFoodItem';
import { FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

// Estilos para hacer la tabla responsive
const TableContainer = styled.div`
  @media (max-width: 768px) {
    .rdt_TableHead {
      display: none;
    }
    .rdt_TableBody {
      .rdt_TableRow {
        display: block;
        margin-bottom: 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1rem;
        
        .rdt_TableCell {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
          
          &:before {
            content: attr(data-label);
            font-weight: bold;
            margin-right: 1rem;
          }
          
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
`;

export default function AllFood() {
    const [foods, setFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);
    const [addFoodPopup, setAddFoodPopup] = useState(false);
    const [searchFood, setSearchFood] = useState('');
    const [selectedCat, setSelectedCat] = useState('All');
    const [pending, setPending] = useState(true);

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        filterFoods();
    }, [foods, searchFood, selectedCat]);

    const fetchFoods = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/food/all');
            setFoods(response.data);
            setPending(false);
        } catch (error) {
            console.error('Error al buscar alimentos:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudieron cargar los alimentos',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            setPending(false);
        }
    };

    const filterFoods = () => {
        const filtered = foods.filter(food =>
            food.foodName.toLowerCase().includes(searchFood.toLowerCase()) &&
            (food.foodCategory === selectedCat || selectedCat === 'All')
        );
        setFilteredFoods(filtered);
    };

    const handleAvailability = async (foodId) => {
        try {
            await axios.put(`http://localhost:8080/api/food/update-availability/${foodId}`);
            Swal.fire({
                title: '¡Éxito!',
                text: 'Disponibilidad actualizada',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
            fetchFoods();
        } catch (error) {
            console.error('Error al actualizar la disponibilidad:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la disponibilidad',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }

    const handleUpdateClick = (foodId) => {
        setIsEditPopupOpen(true);
        setItemToEdit(foodId);
    }

    const handleDeleteItem = async (foodId) => {
        const foodToDelete = foods.find(food => food.foodId === foodId);

        Swal.fire({
            title: '¿Estás seguro?',
            text: `Vas a eliminar "${foodToDelete.foodName}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/food/delete/${foodId}`);
                    Swal.fire(
                        '¡Eliminado!',
                        'El alimento ha sido eliminado.',
                        'success'
                    );
                    fetchFoods();
                } catch (error) {
                    console.error('Error al eliminar comida:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo eliminar el alimento',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            }
        });
    }

    const cancelEdit = () => {
        setIsEditPopupOpen(false);
        setItemToEdit(null);
    }

    const handleUpdateSubmit = (updatedItem) => {
        fetchFoods();
        setIsEditPopupOpen(false);
        Swal.fire({
            title: '¡Éxito!',
            text: 'Alimento actualizado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }

    const handleAddFood = () => {
        setAddFoodPopup(true);
    }

    const cancelAddFood = () => {
        fetchFoods();
        setAddFoodPopup(false);
    }

    const handleCategorySelect = (category) => {
        setSelectedCat(category);
    }

    // Columnas para la DataTable
    const columns = [
        {
            name: '#',
            selector: row => row.foodId,
            sortable: true,
            width: '70px'
        },
        {
            name: 'Nombre',
            selector: row => row.foodName,
            sortable: true,
            wrap: true
        },
        {
            name: 'Imagen',
            cell: row => (
                <img
                    src={`http://localhost:8080/api/food/image/${row.foodImageURL}`}
                    alt={row.foodName}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                />
            ),
            width: '70px' 
        },
        {
            name: 'Categoría',
            selector: row => row.foodCategory,
            sortable: true,
            wrap: true
        },
        {
            name: 'Precio',
            selector: row => `S/. ${row.foodPrice}`,
            sortable: true,
            width: '100px'
        },
        {
            name: 'Disponibilidad',
            cell: row => (
                <ToggleSwitch
                    checked={row.available}
                    color='success'
                    onChange={() => handleAvailability(row.foodId)}
                />
            ),
            width: '150px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="flex space-x-2">
                    <FaEdit
                        onClick={() => handleUpdateClick(row.foodId)}
                        className='text-blue-500 hover:text-blue-700 cursor-pointer text-sm'
                        title="Editar"
                    />
                    <FaTrash
                        onClick={() => handleDeleteItem(row.foodId)}
                        className='text-red-500 hover:text-red-700 cursor-pointer text-sm'
                        title="Eliminar"
                    />
                </div>
            ),
            width: '100px'
        }
    ];

    // Estilos personalizados para la tabla
    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#f0fdf4', // verde claro
                fontWeight: 'bold',
            },
        },
        cells: {
            style: {
                padding: '10px',
            },
        },
    };

    return (
        <div className="h-screen drop-shadow-md mr-3 bg-gray-100 dark:bg-slate-500 w-full">
            <div className='mt-3'>
                <Label className='m-4 mt-5 text-2xl font-semibold text-gray-900 dark:text-white p-2'>Menú de comida</Label>
            </div>

            <div className='flex justify-between m-4 bg-white rounded-lg shadow-md dark:bg-slate-600'>
                <div className='p-2 flex flex-wrap items-center'>
                    <div className='m-3'><FaSearch className="text-gray-400 mx-3" /></div>
                    <TextInput
                        placeholder='Buscar por nombre'
                        onChange={(event) => setSearchFood(event.target.value)}
                        className='w-64 m-1'
                    />
                    <div className='mt-2 ml-5'>
                        <Label>Categoría:</Label>
                    </div>
                    <div className='ml-2'>
                        <Dropdown color='dark' outline dismissOnClick={true} label={selectedCat || "--Seleccionar--"}>
                            <Dropdown.Item onClick={() => handleCategorySelect("All")}>Todos</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Main Dish")}>Plato Principal</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Side Dish")}>Guarnición</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Beverage")}>Bebida</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleCategorySelect("Dessert")}>Postre</Dropdown.Item>
                        </Dropdown>
                    </div>
                </div>
                <div className="mr-3 p-2">
                    <Button color='success' className="bg-green-500" onClick={handleAddFood}>
                        + Agregar
                    </Button>
                </div>
            </div>

            <div className="m-4 bg-white rounded-lg shadow-md p-4">
                <TableContainer>
                    <DataTable
                        columns={columns}
                        data={filteredFoods}
                        customStyles={customStyles}
                        progressPending={pending}
                        noDataComponent={
                            <div className="py-8 text-center text-gray-500">
                                No se encontraron alimentos. ¡Agrega algunos para comenzar!
                            </div>
                        }
                        responsive
                        striped
                        highlightOnHover
                        pagination
                        paginationPerPage={10}
                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                    />
                </TableContainer>
            </div>

            {/* Edit popup */}
            {isEditPopupOpen && (
                <EditFoodItem
                    foodId={itemToEdit}
                    onCancel={cancelEdit}
                    onSubmit={handleUpdateSubmit}
                />
            )}

            {/* Add food popup */}
            {addFoodPopup && (
                <AddFoodItem onClose={cancelAddFood} />
            )}
        </div>
    );
}