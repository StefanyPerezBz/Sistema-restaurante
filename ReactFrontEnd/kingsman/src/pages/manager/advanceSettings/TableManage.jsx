import React, { useEffect } from 'react'
import { Card, Label, Button, Modal, TextInput, Alert } from 'flowbite-react'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { set } from 'firebase/database'
import { HiInformationCircle } from "react-icons/hi";

export default function TableManage() {
    const [tables, setTable] = useState([]);
    const [deleteTableModel, setDeleteTableModel] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);
    const [addNewTableModel, setAddNewTableModel] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [errorAddingTableAlert, setErrorAddingTableAlert] = useState(false);
   
    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        // Hide the alert after 2 seconds
        const timeout = setTimeout(() => {
            setErrorAddingTableAlert(false);
        }, 2000);

        // Clear the timeout when the component unmounts
        return () => clearTimeout(timeout);
    }, [errorAddingTableAlert]);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/table/all");
            setTable(response.data)
            console.log(response.data)
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } 
    }

    

    const handleDeleteTablePopup = async (id) => {
        setDeleteTableModel(true);
        setTableToDelete(id);
    }

    const handleDeleteTable = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/table/delete/${tableToDelete}`);
            setDeleteTableModel(false);
            fetchData();
            setTableToDelete(null);
        } catch (error) {
            console.error("Error al eliminar datos:", error);
        }
    }

    const handleAddTabe = () => {
        setAddNewTableModel(true);
    }

    const handleAddTable = async () => {
        if (tableNumber) {
            const newTable = {
                tableNumber,
                tableAvailability: true,
                date: new Date()
            };

            try {
                const response = await axios.post("http://localhost:8080/api/table/add", newTable);
                console.log(response.data); // Log the response message
                fetchData();
                setAddNewTableModel(false);

            } catch (error) {
                setErrorAddingTableAlert(true)
            }
        }
        else {
            console.error("Por favor rellene todos los campos")
        }
    }



    return (
        <div className='bg-gray-200 p-5 w-full'>
            <div className='flex justify-between bg-white dark:bg-gray-600 p-3 rounded-lg shadow-md mb-2'>
                <Label className='text-2xl font-bold'>Gestión de mesas</Label>
                <Button color="success" className=' bg-green-500' onClick={handleAddTabe}>Agregar mesa </Button>
            </div>
            <div className='flex flex-wrap'>
                {tables.map(table => (
                    <div key={table.id} className=' w-52 h-auto ml-5 my-4'>
                        <Card

                            className="max-w-sm"
                            imgAlt="Table with chairs"
                            imgSrc="../src/image/Table2.jpg"
                        >

                            <Label className="text-xl mb-0 font-bold tracking-tight text-gray-900 dark:text-white">
                                Número de mesa: {table.tableNumber}
                            </Label>
                            <Label> {table.tableAvailability ? <Label className=' text-green-500'>Disponible</Label> : <Label className=' text-red-500'>Cliente en la mesa</Label>}</Label>
                            {table.tableAvailability ? (
                                <Link onClick={() => handleDeleteTablePopup(table.id)}>
                                    <MdDelete color='red' />
                                </Link>
                            ) : (<MdDelete color="#dbd5d5" />)}
                        </Card>
                    </div>

                ))}
            </div>
            {/* Delete table popup  */}
            {deleteTableModel &&
                <div>
                    <Modal show={deleteTableModel} size="md" onClose={() => setDeleteTableModel(false)} popup>
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    ¿Estás seguro de que quieres eliminar este mesa ?
                                </h3>
                                <div className="flex justify-center gap-4">
                                    <Button color="failure" onClick={handleDeleteTable}>
                                        {"Si, estoy seguro"}
                                    </Button>
                                    <Button color="gray" onClick={() => setDeleteTableModel(false)}>
                                        No, cancelar
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>}

            {/* Add new table popup */}
            {addNewTableModel &&
                <div>
                    <Modal show={addNewTableModel} size="md" onClose={() => setAddNewTableModel(false)} popup>
                        <Modal.Header />
                        <Modal.Body>
                            <div >
                                <div className="text-center">
                                    <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                        Agregar nueva mesa
                                    </h3>
                                </div>
                                <div>
                                    <Label> Número de mesa : </Label>
                                    <TextInput placeholder="Table Number" onChange={(e) => setTableNumber(e.target.value)} />
                                </div>
                                
                                {/* Table alredy exist alert */}
                                {errorAddingTableAlert && (
                                    <div>
                                        <Alert color="failure" icon={HiInformationCircle}>
                                            <span className="font-medium">La mesa {tableNumber} ya ha sido agregada!</span> 
                                        </Alert>

                                    </div>
                                )}
                                <div className="flex justify-center gap-4 mt-3">
                                    <Button color="success" className=' bg-green-500' onClick={handleAddTable}>
                                        {"Agregar mesa"}
                                    </Button>
                                    <Button color="gray" onClick={() => setAddNewTableModel(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>


                        </Modal.Body>
                    </Modal>
                </div>
            }



        </div>
    )
}
