
import { Button, Checkbox, Label, Modal, TextInput, Table } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";


export function DailyInventoryUsage({ selectedDate, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [apiData, setApiData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log('selectedDate:', selectedDate);
            
                try {
    
                    const response = await axios.get('http://localhost:8080/api/inventory/inventory-usage-log/' + selectedDate);
    
                    setApiData(response.data);
                    console.log('API:', response.data);
                } catch (error) {
                    console.error('Error al obtener datos de la API:', error);
                }
            
            
        };

        fetchData();
    }, [selectedDate]);

    return (
        <>

            <Modal show={openModal} onClose={onCancel} size='3xl' >
            <Modal.Header>{`Uso del inventario en ${selectedDate}`}</Modal.Header>
                <Modal.Body>
                {apiData.length === 0 ? (<p>No se utilizó ningún artículo para la fecha seleccionada.</p>):(
                    <div className="overflow-x-auto">
                        
                        <Table hoverable >
                            <Table.Head>
                                <Table.HeadCell>#</Table.HeadCell>
                                <Table.HeadCell>Nombre del artículo</Table.HeadCell>
                                <Table.HeadCell>Cantidad usada</Table.HeadCell>
                                <Table.HeadCell>Unidad</Table.HeadCell>
                                <Table.HeadCell>Fecha y hora usadas</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                            {apiData.map(item => (
                                    <Table.Row key={item.itemId} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell>{item.itemId}</Table.Cell>
                                        <Table.Cell>{item.itemName}</Table.Cell>
                                        <Table.Cell>{item.decreasedQuantity}</Table.Cell>
                                        <Table.Cell>{item.unit}</Table.Cell>
                                        <Table.Cell>{new Date(item.usageDateTime).toLocaleString()}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        
                    </div>
                    )}

                </Modal.Body>
            </Modal>
        </>
    );
}
export default DailyInventoryUsage;
