import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, TextInput, Label } from "flowbite-react";
import { ToggleSwitch } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import DeleteFoodItem from './DeleteFoodItem';
import { set } from 'firebase/database';
import EditFoodItem from './EditFoodItem';
import AddFoodItem from './AddFoodItem';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import the search icon from react-icons
import { FaEdit} from 'react-icons/fa';




export default function AllFood() {
    const [foods, setFoods] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // State to store item to delete
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // State to manage visibility of edit popup
    const [itemToEdit, setItemToEdit] = useState(null); // State to store item to edit
    const [switch2, setSwitch2] = useState(false);
    const [addFoodPopup, setAddFoodPopup] = useState(false);
    const navigate = useNavigate();
    const [searchFood, setSearchFood] = useState('');
    const [selectedCat, setSelectedCat] = useState('All');


    useEffect(() => {

        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/food/all');
            setFoods(response.data);
        } catch (error) {
            console.error('Error al buscar alimentos:', error);
        }
    };

    const handleAvailability = async (foodId) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/food/update-availability/${foodId}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al actualizar la disponibilidad de alimentos:', error);
        }
        fetchFoods();
    }

    const handleUpdateClick = (foodId) => {
        setIsEditPopupOpen(true);
        setItemToEdit(foodId);
    }

    const handleDeleteItem = async (foodId) => {
        setShowDeleteConfirmation(true);
        setItemToDelete(foodId);
    }

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    }

    const deleteFood = async () => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/food/delete/${itemToDelete}`);
            console.log(response.data);
        } catch (error) {
            console.error('Error al eliminar comida:', error);
        }
        setShowDeleteConfirmation(false);
        setItemToDelete(null);
        fetchFoods();
    }

    const cancelEdit = () => {
        setIsEditPopupOpen(false);
        setItemToEdit(null);
    }

    const handleUpdateSubmit = (updatedItem) => {
        fetchFoods();
        setIsEditPopupOpen(false);
        console.log('Artículo actualizado:', updatedItem);
    }

    const handleAddFood = () => {
        setAddFoodPopup(true);

    }

    const cancelAddFood = () => {
        fetchFoods();
        setAddFoodPopup(false);

    }

    const handleSearchItem = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/food/search/${searchFood}`);
            setFoods(response.data);
        } catch (error) {
            console.error('Error al buscar alimentos:', error);
        }
    }

    const handleCategorySelect = (category) => {
        setSelectedCat(category);
        console.log(category);
    }

    return (
        <div className="overflow-x-auto h-screen drop-shadow-md mr-3 bg-gray-100  dark:bg-slate-500 w-full">
            <div className='mt-3'><Label className='m-4 mt-5 text-2xl font-semibold text-gray-900 dark:text-white p-2'>Food Menu</Label> </div>
            <div className='flex justify-between m-4 bg-white rounded-lg shadow-md dark:bg-slate-600'>
                {/* <h1 className="text-2xl font-semibold text-gray-900 dark:text-white p-2">All Food Items</h1> */}
                <div className='p-2 flex'>
                    <div className=' m-3'><FaSearch className="text-gray-400 mx-3" /> {/* Search icon */}</div>
                    <TextInput placeholder={'Search Name '} onChange={(event) => setSearchFood(event.target.value)} className=' w-64' />
                    {/* <Button color='success' className=" ml-3 size-fit bg-green-500" onClick={handleSearchItem}>Search</Button> */}
                    <div className='mt-2 ml-5'>
                        <Label className=''>Categoría : </Label>
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
                    <Link>
                        <Button color='success' className=" bg-green-500" onClick={handleAddFood}> + Agregar comida </Button>
                    </Link>
                </div>
            </div>
            <div className=" m-4 bg-white rounded-lg shadow-md">
                <Table>
                    <Table.Head className=' w-full'>
                        <Table.HeadCell className=" bg-green-100 ">#</Table.HeadCell>
                        <Table.HeadCell className=" bg-green-100 ">Nombre</Table.HeadCell>
                        <Table.HeadCell className=" bg-green-100 ">Image</Table.HeadCell>
                        <Table.HeadCell className=" bg-green-100 ">Categoría</Table.HeadCell>
                        <Table.HeadCell className=" bg-green-100 ">Precio</Table.HeadCell>
                        <Table.HeadCell className=" bg-green-100 ">Disponibilidad</Table.HeadCell>
                        <Table.HeadCell className=" bg-green-100 ">Acción</Table.HeadCell>


                    </Table.Head>
                    <Table.Body className="divide-y">
                        {foods.map(food => (
                            food.foodName.toLowerCase().includes(searchFood.toLowerCase()) && (food.foodCategory == selectedCat || selectedCat === 'All') ? (
                                <Table.Row key={food.foodId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{food.foodId}</Table.Cell>
                                    <Table.Cell>{food.foodName}</Table.Cell>
                                    <Table.Cell>
                                        <img src={`http://localhost:8080/api/food/image/${food.foodImageURL}`} alt={food.foodName} style={{ width: '100px' }} />
                                        {console.log(food.foodImageURL)}
                                    </Table.Cell>
                                    <Table.Cell>{food.foodCategory}</Table.Cell>
                                    <Table.Cell>{food.foodPrice}</Table.Cell>
                                    <Table.Cell className=''>

                                        <ToggleSwitch className='' checked={food.available} color='success' label="" onChange={() => handleAvailability(food.foodId)} />


                                    </Table.Cell>
                                    <Table.Cell>
                                        <FaEdit onClick={() => handleUpdateClick(food.foodId)} className='text-blue-500 mr-3 hover:text-blue-700 cursor-pointer text-xl'/>
                                    </Table.Cell>

                                </Table.Row>
                            ) : null
                        ))}
                    </Table.Body>
                </Table>
            </div>


            {/* Delete confirmation popup */}
            {showDeleteConfirmation && (
                <DeleteFoodItem
                    foodName={foods.find(food => food.foodId === itemToDelete)?.foodName || ""}
                    onCancel={cancelDelete}
                    onDelete={deleteFood}
                />
            )}

            {/* Edit popup */}
            {isEditPopupOpen && (
                <EditFoodItem
                    foodId={itemToEdit}
                    onCancel={cancelEdit}
                    onSubmit={handleUpdateSubmit} // Reload items after editing
                />
            )}
            {/* Add food popup */}
            {addFoodPopup && (
                <AddFoodItem
                    onClose={cancelAddFood} />

            )}
        </div>


    )
}
