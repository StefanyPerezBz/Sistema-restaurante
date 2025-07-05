
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from "flowbite-react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const MySwal = withReactContent(Swal);
const animatedComponents = makeAnimated();

const BillPayments = () => {
    const [payments, setPayments] = useState([]);
    const [originalPayments, setOriginalPayments] = useState([]);
    const [newPaymentData, setNewPaymentData] = useState({
        payDate: '',
        billType: '',
        amount: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [currentPaymentId, setCurrentPaymentId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter states
    const [selectedBillType, setSelectedBillType] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [billTypes, setBillTypes] = useState([]);

    // Month options for filter
    const monthOptions = [...Array(12)].map((_, i) => ({
        value: i + 1,
        label: new Date(0, i).toLocaleString('default', { month: 'long' })
    }));

    // Translated bill types
    const billTypeOptions = [
        { value: 'Water Bill', label: 'Factura de Agua' },
        { value: 'Electricity Bill', label: 'Factura de Electricidad' },
        { value: 'Telephone Bill', label: 'Factura de Teléfono' },
        { value: 'Internet Bill', label: 'Factura de Internet' },
        { value: 'Insurance', label: 'Seguro' },
        { value: 'Other Expenses', label: 'Otros Gastos' }
    ];

    useEffect(() => {
        viewAllPayments();
        fetchBillTypes();
    }, []);

    const viewAllPayments = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.REACT_APP_API_URL}/api/payment/getAllPayments`);
            setPayments(response.data);
            setOriginalPayments(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al obtener los datos de pago:', error);
            showErrorAlert('Error al cargar pagos', error.message);
            setIsLoading(false);
        }
    };

    const fetchBillTypes = async () => {
        try {
            // Uncomment when your API is ready
            // const response = await axios.get('http://localhost:8080/api/payment/getAllBillTypes');
            // const existingBillTypes = response.data.map(type => ({
            //     value: type,
            //     label: type
            // }));
            setBillTypes(billTypeOptions);
        } catch (error) {
            console.error('Error al obtener los tipos de factura:', error);
            showErrorAlert('Error al cargar tipos de factura', error.message);
        }
    };

const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
        // Permitir solo números y como mucho un punto decimal mientras se escribe
        if (!/^\d*\.?\d{0,1}$/.test(value)) return;

        // También impedir valores como "0" o "0.3"
        if (value && parseFloat(value) < 1) return;
    }

    setNewPaymentData(prevData => ({
        ...prevData,
        [name]: value
    }));
};


    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await showUpdateConfirmation();
            } else {
                await showAddConfirmation();
            }
        } catch (error) {
            console.error('Error en operación de pago:', error);
            showErrorAlert('Error', error.message);
        }
    };

    const showAddConfirmation = async () => {
        const result = await MySwal.fire({
            title: '¿Agregar nuevo pago?',
            text: `¿Estás seguro de agregar este pago de ${newPaymentData.amount} S/.?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`${import.meta.env.REACT_APP_API_URL}/api/payment/addPayment`, newPaymentData);
                await viewAllPayments();
                resetForm();
                showSuccessAlert('¡Pago agregado!', 'El pago se ha registrado correctamente.');
            } catch (error) {
                handleApiError(error, 'agregar');
            }
        }
    };

    const showUpdateConfirmation = async () => {
        const result = await MySwal.fire({
            title: '¿Actualizar pago?',
            text: `¿Estás seguro de actualizar este pago a ${newPaymentData.amount} S/.?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await axios.put(`${import.meta.env.REACT_APP_API_URL}/api/payment/updatePayment/${currentPaymentId}`, newPaymentData);
                await viewAllPayments();
                resetForm();
                showSuccessAlert('¡Pago actualizado!', 'El pago se ha actualizado correctamente.');
            } catch (error) {
                handleApiError(error, 'actualizar');
            }
        }
    };

    const handleDeletePayment = async (paymentId) => {
        const result = await MySwal.fire({
            title: '¿Eliminar pago?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.REACT_APP_API_URL}/api/payment/${paymentId}`);
                await viewAllPayments();
                showSuccessAlert('¡Pago eliminado!', 'El pago se ha eliminado correctamente.');
            } catch (error) {
                handleApiError(error, 'eliminar');
            }
        }
    };

    const handleApiError = (error, action) => {
        const errorMessage = error.response?.data?.message || `Error al ${action} el pago`;
        showErrorAlert(`Error al ${action}`, errorMessage);
    };

    const showSuccessAlert = (title, text) => {
        MySwal.fire({
            title,
            text,
            icon: 'success',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false
        });
    };

    const showErrorAlert = (title, text) => {
        MySwal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonText: 'OK'
        });
    };

    const handleEditPayment = (payment) => {
        setEditMode(true);
        setCurrentPaymentId(payment.payID);
        setNewPaymentData({
            payDate: payment.payDate,
            billType: payment.billType,
            amount: payment.amount
        });
    };

    const resetForm = () => {
        setNewPaymentData({ payDate: '', billType: '', amount: '' });
        setErrorMessage('');
        setEditMode(false);
        setCurrentPaymentId(null);
    };

    const handleCancelAdd = () => {
        const hasChanges = newPaymentData.payDate || newPaymentData.billType || newPaymentData.amount;

        if (!hasChanges) {
            resetForm();
            return;
        }

        MySwal.fire({
            title: '¿Cancelar cambios?',
            text: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres cancelar?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, continuar editando'
        }).then((result) => {
            if (result.isConfirmed) {
                resetForm();
            }
        });
    };

    const handleFilterChange = (selectedOption, action) => {
        if (action.name === 'filterBillType') {
            setSelectedBillType(selectedOption?.value || '');
        } else if (action.name === 'filterMonth') {
            setSelectedMonth(selectedOption?.value || '');
        }
        setCurrentPage(1);
    };

    const filteredPayments = payments.filter(payment => {
        const paymentDate = new Date(payment.payDate);
        const paymentMonth = paymentDate.getMonth() + 1;
        const isBillTypeMatch = selectedBillType ? payment.billType === selectedBillType : true;
        const isMonthMatch = selectedMonth ? paymentMonth === parseInt(selectedMonth, 10) : true;
        return isBillTypeMatch && isMonthMatch;
    });

    const resetFilters = () => {
        setSelectedBillType('');
        setSelectedMonth('');
        setPayments(originalPayments);
        MySwal.fire({
            title: 'Filtros reiniciados',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    const formatCurrency = (amount) => {
        return parseFloat(amount).toLocaleString('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2
        });
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Fecha inválida';

            return date.toLocaleDateString('es-PE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (e) {
            return 'Fecha inválida';
        }
    };

    return (
        <div className="flex flex-col w-full bg-gray-200 dark:bg-gray-700 min-h-screen">
            {/* Header and filters */}
            <div className="flex flex-col md:flex-row items-center m-4 justify-between border-b bg-white dark:bg-gray-800 p-3 shadow-md rounded-md">
                <h1 className="text-2xl font-bold mb-2 dark:text-white">Pagos de facturas</h1>

                {/* Filters */}
                <div className='flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-4'>
                    <div className='w-full md:w-48'>
                        <label htmlFor="filterBillType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipo de factura
                        </label>
                        <Select
                            id="filterBillType"
                            name="filterBillType"
                            options={[
                                { value: '', label: 'Todos' },
                                ...billTypes
                            ]}
                            value={selectedBillType ? billTypes.find(type => type.value === selectedBillType) : null}
                            onChange={handleFilterChange}
                            placeholder="Filtrar por tipo"
                            isClearable
                            className="basic-single"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className='w-full md:w-48'>
                        <label htmlFor="filterMonth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Mes
                        </label>
                        <Select
                            id="filterMonth"
                            name="filterMonth"
                            options={[
                                { value: '', label: 'Todos los meses' },
                                ...monthOptions
                            ]}
                            value={selectedMonth ? monthOptions.find(m => m.value === parseInt(selectedMonth)) : null}
                            onChange={handleFilterChange}
                            placeholder="Filtrar por mes"
                            isClearable
                            className="basic-single"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="px-3 py-2 h-[38px] text-xs font-medium text-white bg-gray-500 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            <i className="ri-refresh-line mr-1"></i> Reiniciar
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="w-full flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 p-3 rounded-md">
                {/* Left Side: Payment Details Table */}
                <div className="w-full lg:w-1/2">
                    <div className="relative overflow-x-auto shadow-md bg-white dark:bg-gray-800 rounded-md">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : filteredPayments.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No se encontraron pagos con los filtros actuales
                            </div>
                        ) : (
                            <Table hoverable className="min-w-full">
                                <Table.Head className="bg-green-100 dark:bg-gray-700">
                                    <Table.HeadCell className="dark:text-white">Fecha</Table.HeadCell>
                                    <Table.HeadCell className="dark:text-white">Tipo</Table.HeadCell>
                                    <Table.HeadCell className="dark:text-white">Monto</Table.HeadCell>
                                    <Table.HeadCell className="dark:text-white">Acciones</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y dark:divide-gray-600">
                                    {filteredPayments.map((payment) => (
                                        <Table.Row key={payment.payID} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <Table.Cell className="whitespace-nowrap dark:text-white">
                                                {formatDate(payment.payDate)}
                                            </Table.Cell>
                                            <Table.Cell className="dark:text-white">
                                                {billTypes.find(type => type.value === payment.billType)?.label || payment.billType}
                                            </Table.Cell>
                                            <Table.Cell className="font-medium dark:text-white">
                                                {formatCurrency(payment.amount)}
                                            </Table.Cell>
                                            <Table.Cell className="space-x-2">
                                                <button
                                                    onClick={() => handleEditPayment(payment)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    <i className="ri-edit-line mr-1"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePayment(payment.payID)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        )}
                    </div>
                </div>

                {/* Right Side: Form to Add/Edit Payment */}
                <div className="w-full lg:w-1/2">
                    <div className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
                        <h2 className="text-xl font-bold mb-2 dark:text-white">
                            {editMode ? 'Actualizar Pago' : 'Agregar Nuevo Pago'}
                        </h2>

                        {errorMessage && (
                            <div className="p-2 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
                                {errorMessage}
                            </div>
                        )}

                        <form onSubmit={handleAddPayment}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="payDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Fecha de pago
                                    </label>
                                    <input
                                        type="date"
                                        id="payDate"
                                        name="payDate"
                                        value={newPaymentData.payDate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                        readOnly={editMode}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="billType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tipo de factura
                                    </label>
                                    <Select
                                        id="billType"
                                        name="billType"
                                        options={billTypes}
                                        value={billTypes.find(type => type.value === newPaymentData.billType)}
                                        onChange={(selectedOption) => {
                                            setNewPaymentData(prev => ({
                                                ...prev,
                                                billType: selectedOption?.value || ''
                                            }));
                                        }}
                                        className="basic-single"
                                        classNamePrefix="select"
                                        placeholder="Seleccionar tipo"
                                        isDisabled={editMode}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Monto (S/.)
                                    </label>
                                    <input
                                        type="text"
                                        id="amount"
                                        name="amount"
                                        value={newPaymentData.amount}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                        placeholder="0.00"
                                        pattern="^\d+(\.\d{1,2})?$"
                                        title="Ingrese un monto válido (ej. 100.50)"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between">
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-md text-white font-semibold ${editMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                                >
                                    {editMode ? (
                                        <>
                                            <i className="ri-save-line mr-1"></i> Actualizar
                                        </>
                                    ) : (
                                        <>
                                            <i className="ri-add-line mr-1"></i> Agregar
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancelAdd}
                                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md"
                                >
                                    <i className="ri-close-line mr-1"></i> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillPayments;