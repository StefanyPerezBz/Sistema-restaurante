import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
import HourlyPayTable from './HourlyPayTable'; // Import HourlyPayTable component

function PayPerHour() {
  const [hourlyModalOpen, setHourlyModalOpen] = useState(false);
  const [hourlyPay, setHourlyPay] = useState(0);
  const [otPay, setOTPay] = useState(0);
  const [positions, setPositions] = useState([]); // State to hold positions
  const [selectedPosition, setSelectedPosition] = useState(''); // State for selected position

  useEffect(() => {
    // Fetch positions from backend
    axios.get('http://localhost:8080/employeeIdsAndPositions')
      .then(response => {
        // Filter out positions with 'manager'
        const filteredPositions = response.data.filter(item => item[2] !== 'manager');
  
        // Create a set to store unique positions
        const uniquePositions = new Set();
        filteredPositions.forEach(item => {
          uniquePositions.add(item[2]); // Add position to set
        });
  
        // Convert set to array for state update
        const positionsFromBackend = Array.from(uniquePositions).map(position => ({
          id: filteredPositions.find(item => item[2] === position)[0], // Find corresponding ID
          position: position
        }));
  
        setPositions(positionsFromBackend);
      })
      .catch(error => {
        console.error('Error al buscar rol:', error);
      });
  }, []); // Empty dependency array ensures this runs once on component mount
  

  const handleOpenHourlyModal = () => {
    setHourlyModalOpen(true);
  };

  const closeHourlyModal = () => {
    setHourlyModalOpen(false);
    setHourlyPay(0);
    setOTPay(0);
    setSelectedPosition('');
  };

  const handleAddHourlyPay = () => {
    const hourlyPayData = {
      position: selectedPosition,
      payPerHour: parseFloat(hourlyPay),
      payPerOverTimeHour: parseFloat(otPay)
    };

    axios.post('http://localhost:8080/hourPayments/create', hourlyPayData)
      .then(response => {
        console.log('Pago por hora añadido con éxito:', response.data);
        closeHourlyModal();
        // Trigger refresh of HourlyPayTable component
        // You can force a refresh by toggling a state variable
        setRefreshHourlyTable(prev => !prev);
      })
      .catch(error => {
        console.error('Error al añadir el pago por hora:', error);
      });
  };

  const incrementHourlyPay = () => {
    setHourlyPay(prev => prev + 10); // Increment by 10 (you can change the increment value)
  };

  const incrementOTPay = () => {
    setOTPay(prev => prev + 10); // Increment by 10 (you can change the increment value)
  };

  // State to force refresh of HourlyPayTable
  const [refreshHourlyTable, setRefreshHourlyTable] = useState(false);

  return (
    <div className='bg-gray-200 h-screen'>
      <div className='h-20 border bg-slate-800'>
        <div className='flex flex-wrap justify-center gap-10 mt-5'>
          <Button gradientDuoTone="cyanToBlue" onClick={handleOpenHourlyModal}>Pago por hora</Button>
        </div>
      </div>

      {/* Render HourlyPayTable component with refresh state */}
      <div className='flex flex-row'>
        <div className="flex-1 ml-8 mr-5 mt-8 mb-6">
          <HourlyPayTable refresh={refreshHourlyTable} setRefresh={setRefreshHourlyTable} />
        </div>
      </div>

      {/* Add Hourly Pay Modal */}
      <Modal show={hourlyModalOpen} size="md" onClose={closeHourlyModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar pago por hora</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="position" value="Position" />
              </div>
              <Select
                id="position"
                value={selectedPosition}
                onChange={(event) => setSelectedPosition(event.target.value)}
                className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
              >
                <option value="" disabled>Seleccionar rol</option> {/* Default option */}
                {/* Render dropdown options */}
                {positions.map(position => (
                  <option key={position.id} value={position.position}>{position.position}</option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="hourlyPay" value="Hourly Pay" />
              </div>
              <div className="flex items-center space-x-2">
                <TextInput
                  id="hourlyPay"
                  type="text" // Changed to text to allow manual input
                  value={hourlyPay}
                  onChange={(event) => setHourlyPay(parseFloat(event.target.value))}
                  placeholder="Ingrese el pago por hora"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
                <Button onClick={incrementHourlyPay}>+</Button> {/* Button to increment hourly pay */}
              </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="otPay" value="OT Pay" />
              </div>
              <div className="flex items-center space-x-2">
                <TextInput
                  id="otPay"
                  type="text" // Changed to text to allow manual input
                  value={otPay}
                  onChange={(event) => setOTPay(parseFloat(event.target.value))}
                  placeholder="Ingrese horas extra"
                  className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
                />
                <Button onClick={incrementOTPay}>+</Button> {/* Button to increment OT pay */}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="cyanToBlue" onClick={handleAddHourlyPay}>Agregar pago</Button>
          <Button gradientDuoTone="gray" onClick={closeHourlyModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PayPerHour;