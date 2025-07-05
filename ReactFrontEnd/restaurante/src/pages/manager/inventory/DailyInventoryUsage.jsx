import { Button, Modal, Table, Spinner, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";

export function DailyInventoryUsage({ selectedDate, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(
                    `${import.meta.env.REACT_APP_API_URL}/api/inventory/inventory-usage-log/${selectedDate}`
                );

                setApiData(response.data);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
                setError("Error al cargar los datos. Por favor, inténtelo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        if (selectedDate) {
            fetchData();
        }
    }, [selectedDate]);

    const handleClose = () => {
        setOpenModal(false);
        onCancel();
    };

    return (
        <Modal show={openModal} onClose={handleClose} size="7xl">
            <Modal.Header>
                <div className="flex items-center">
                    <span className="mr-2">{`Uso del inventario en ${selectedDate}`}</span>
                    {loading && <Spinner size="sm" />}
                </div>
            </Modal.Header>
            <Modal.Body>
                {error ? (
                    <Alert color="failure" className="mb-4">
                        {error}
                    </Alert>
                ) : null}

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Spinner size="xl" />
                        </div>
                    ) : apiData.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            No se utilizó ningún artículo para la fecha seleccionada.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table hoverable striped className="w-full">
                                <Table.Head>
                                    <Table.HeadCell className="whitespace-nowrap">#</Table.HeadCell>
                                    <Table.HeadCell className="whitespace-nowrap">Nombre</Table.HeadCell>
                                    <Table.HeadCell className="whitespace-nowrap">Cantidad usada</Table.HeadCell>
                                    <Table.HeadCell className="whitespace-nowrap">Medida</Table.HeadCell>
                                    <Table.HeadCell className="whitespace-nowrap">Fecha y hora usadas</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {apiData.map((item) => (
                                        <Table.Row
                                            key={item.itemId}
                                            className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <Table.Cell className="whitespace-nowrap">{item.itemId}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap">{item.itemName}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap">{item.decreasedQuantity}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap">{item.unit}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap">
                                                {new Date(item.usageDateTime).toLocaleString("es-PE", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    hour12: true,
                                                })}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button color="gray" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DailyInventoryUsage;