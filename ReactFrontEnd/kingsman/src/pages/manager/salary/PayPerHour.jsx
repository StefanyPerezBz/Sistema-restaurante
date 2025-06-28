// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Button, Modal, Label, TextInput, Select } from "flowbite-react";
// import HourlyPayTable from './HourlyPayTable'; // Import HourlyPayTable component

// function PayPerHour() {
//   const [hourlyModalOpen, setHourlyModalOpen] = useState(false);
//   const [hourlyPay, setHourlyPay] = useState(0);
//   const [otPay, setOTPay] = useState(0);
//   const [positions, setPositions] = useState([]); // State to hold positions
//   const [selectedPosition, setSelectedPosition] = useState(''); // State for selected position

//   useEffect(() => {
//     // Fetch positions from backend
//     axios.get('http://localhost:8080/employeeIdsAndPositions')
//       .then(response => {
//         // Filter out positions with 'manager'
//         const filteredPositions = response.data.filter(item => item[2] !== 'manager');

//         // Create a set to store unique positions
//         const uniquePositions = new Set();
//         filteredPositions.forEach(item => {
//           uniquePositions.add(item[2]); // Add position to set
//         });

//         // Convert set to array for state update
//         const positionsFromBackend = Array.from(uniquePositions).map(position => ({
//           id: filteredPositions.find(item => item[2] === position)[0], // Find corresponding ID
//           position: position
//         }));

//         setPositions(positionsFromBackend);
//       })
//       .catch(error => {
//         console.error('Error al buscar rol:', error);
//       });
//   }, []); // Empty dependency array ensures this runs once on component mount


//   const handleOpenHourlyModal = () => {
//     setHourlyModalOpen(true);
//   };

//   const closeHourlyModal = () => {
//     setHourlyModalOpen(false);
//     setHourlyPay(0);
//     setOTPay(0);
//     setSelectedPosition('');
//   };

//   const handleAddHourlyPay = () => {
//     const hourlyPayData = {
//       position: selectedPosition,
//       payPerHour: parseFloat(hourlyPay),
//       payPerOverTimeHour: parseFloat(otPay)
//     };

//     axios.post('http://localhost:8080/hourPayments/create', hourlyPayData)
//       .then(response => {
//         console.log('Pago por hora añadido con éxito:', response.data);
//         closeHourlyModal();
//         // Trigger refresh of HourlyPayTable component
//         // You can force a refresh by toggling a state variable
//         setRefreshHourlyTable(prev => !prev);
//       })
//       .catch(error => {
//         console.error('Error al añadir el pago por hora:', error);
//       });
//   };

//   const incrementHourlyPay = () => {
//     setHourlyPay(prev => prev + 10); // Increment by 10 (you can change the increment value)
//   };

//   const incrementOTPay = () => {
//     setOTPay(prev => prev + 10); // Increment by 10 (you can change the increment value)
//   };

//   // State to force refresh of HourlyPayTable
//   const [refreshHourlyTable, setRefreshHourlyTable] = useState(false);

//   return (
//     <div className='bg-gray-200 h-screen'>
//       <div className='h-20 border bg-slate-800'>
//         <div className='flex flex-wrap justify-center gap-10 mt-5'>
//           <Button gradientDuoTone="cyanToBlue" onClick={handleOpenHourlyModal}>Pago por hora</Button>
//         </div>
//       </div>

//       {/* Render HourlyPayTable component with refresh state */}
//       <div className='flex flex-row'>
//         <div className="flex-1 ml-8 mr-5 mt-8 mb-6">
//           <HourlyPayTable refresh={refreshHourlyTable} setRefresh={setRefreshHourlyTable} />
//         </div>
//       </div>

//       {/* Add Hourly Pay Modal */}
//       <Modal show={hourlyModalOpen} size="md" onClose={closeHourlyModal} popup>
//         <Modal.Header />
//         <Modal.Body>
//           <div className="space-y-6">
//             <h3 className="text-xl font-medium text-gray-900 dark:text-white">Agregar pago por hora</h3>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="position" value="Puesto" />
//               </div>
//               <Select
//                 id="position"
//                 value={selectedPosition}
//                 onChange={(event) => setSelectedPosition(event.target.value)}
//                 className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
//               >
//                 <option value="" disabled>Seleccionar puesto</option> {/* Default option */}
//                 {/* Render dropdown options */}
//                 {positions.map(position => (
//                   <option key={position.id} value={position.position}>{position.position}</option>
//                 ))}
//               </Select>
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="hourlyPay" value="Pago por hora" />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <TextInput
//                   id="hourlyPay"
//                   type="text" // Changed to text to allow manual input
//                   value={hourlyPay}
//                   onChange={(event) => setHourlyPay(parseFloat(event.target.value))}
//                   placeholder="Ingrese el pago por hora"
//                   className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
//                 />
//                 <Button onClick={incrementHourlyPay}>+</Button> {/* Button to increment hourly pay */}
//               </div>
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="otPay" value="Pago por horas extra" />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <TextInput
//                   id="otPay"
//                   type="text" // Changed to text to allow manual input
//                   value={otPay}
//                   onChange={(event) => setOTPay(parseFloat(event.target.value))}
//                   placeholder="Ingrese horas extra"
//                   className="w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-500 dark:focus:ring-gray-600 dark:text-gray-300 rounded-md"
//                 />
//                 <Button onClick={incrementOTPay}>+</Button> {/* Button to increment OT pay */}
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button gradientDuoTone="cyanToBlue" onClick={handleAddHourlyPay}>Agregar pago</Button>
//           <Button gradientDuoTone="gray" onClick={closeHourlyModal}>Cancelar</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }

// export default PayPerHour;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Label, TextInput } from "flowbite-react";
import Select from 'react-select';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import HourlyPayTable from './HourlyPayTable';

const MySwal = withReactContent(Swal);

// Diccionario de traducción de roles
const roleTranslations = {
  'cashier': 'Cajero',
  'waiter': 'Mesero',
  'chef': 'Chef'
};

function PayPerHour() {
  const [hourlyModalOpen, setHourlyModalOpen] = useState(false);
  const [hourlyPay, setHourlyPay] = useState('');
  const [otPay, setOTPay] = useState('');
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [errors, setErrors] = useState({
    position: '',
    hourlyPay: '',
    otPay: ''
  });
  const [refreshHourlyTable, setRefreshHourlyTable] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/employeeIdsAndPositions');
      const filteredPositions = response.data.filter(item => item[2] !== 'manager');

      const uniquePositions = [...new Set(filteredPositions.map(item => item[2]))];

      const positionOptions = uniquePositions.map(position => ({
        value: position, // Guardamos el valor original en inglés
        label: roleTranslations[position] || position // Mostramos la traducción o el original si no existe
      }));

      setPositions(positionOptions);
    } catch (error) {
      console.error('Error al buscar roles:', error);
      showError('Error al cargar los puestos disponibles');
    }
  };

  const showSuccess = (message) => {
    MySwal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  };

  const showError = (message) => {
    MySwal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  };

  const validateForm = () => {
    const decimalOrIntegerPattern = /^\d+(\.\d)?$/; // entero o decimal con un solo decimal

    const newErrors = {
      position: !selectedPosition ? 'Debe seleccionar un puesto' : '',

      hourlyPay: !hourlyPay || !decimalOrIntegerPattern.test(hourlyPay) || parseFloat(hourlyPay) < 1
        ? 'Debe ingresar un monto válido mayor o igual a 1, con máximo un decimal'
        : '',

      otPay: !otPay || !decimalOrIntegerPattern.test(otPay) || parseFloat(otPay) < 1
        ? 'Debe ingresar un monto válido mayor o igual a 1, con máximo un decimal'
        : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


  const handleOpenHourlyModal = () => {
    setHourlyModalOpen(true);
    setSelectedPosition(null);
    setHourlyPay('');
    setOTPay('');
    setErrors({
      position: '',
      hourlyPay: '',
      otPay: ''
    });
  };

  const closeHourlyModal = () => {
    setHourlyModalOpen(false);
  };

  const handleHourlyPayChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setHourlyPay(value);
      setErrors({ ...errors, hourlyPay: '' });
    }
  };

  const handleOTPayChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setOTPay(value);
      setErrors({ ...errors, otPay: '' });
    }
  };

  const incrementHourlyPay = () => {
    const newValue = parseFloat(hourlyPay || 0) + 10;
    setHourlyPay(newValue.toString());
    setErrors({ ...errors, hourlyPay: '' });
  };

  const incrementOTPay = () => {
    const newValue = parseFloat(otPay || 0) + 10;
    setOTPay(newValue.toString());
    setErrors({ ...errors, otPay: '' });
  };

  const handleAddHourlyPay = async () => {
    if (!validateForm()) return;

    const hourlyPayData = {
      position: selectedPosition.value, // Enviamos el valor original en inglés
      payPerHour: parseFloat(hourlyPay).toFixed(2),
      payPerOverTimeHour: parseFloat(otPay).toFixed(2)
    };

    try {
      await axios.post('http://localhost:8080/hourPayments/create', hourlyPayData);
      showSuccess('Pago por hora registrado correctamente');
      setRefreshHourlyTable(prev => !prev);
      closeHourlyModal();
    } catch (error) {
      console.error('Error al añadir el pago por hora:', error);
      showError('Error al registrar el pago por hora');
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="dark:bg-slate-800 mb-6">
        <div className="flex justify-center">
          <Button
            gradientDuoTone="cyanToBlue"
            onClick={handleOpenHourlyModal}
            className="min-w-[200px]"
          >
            Registrar Pago por Hora
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <HourlyPayTable refresh={refreshHourlyTable} setRefresh={setRefreshHourlyTable} />
      </div>

      {/* Modal para agregar pago por hora */}
      <Modal show={hourlyModalOpen} size="md" onClose={closeHourlyModal} popup>
        <Modal.Header className="border-b pb-3">
          <h3 className="text-lg font-medium text-gray-900">Registrar Pago por Hora</h3>
        </Modal.Header>
        <Modal.Body className="space-y-4">
          <div>
            <Label htmlFor="position" value="Puesto *" className="mb-1 block" />
            <Select
              id="position"
              options={positions}
              value={selectedPosition}
              onChange={setSelectedPosition}
              placeholder="Seleccione un puesto"
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              noOptionsMessage={() => "No hay puestos disponibles"}
            />
            {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
          </div>

          <div>
            <Label htmlFor="hourlyPay" value="Pago por Hora (S/.) *" className="mb-1 block" />
            <div className="flex items-center gap-2">
              <TextInput
                id="hourlyPay"
                type="text"
                value={hourlyPay}
                onChange={handleHourlyPayChange}
                placeholder="0.0"
                className="flex-1"
              />
              <Button onClick={incrementHourlyPay} size="sm">+10</Button>
            </div>
            {errors.hourlyPay && <p className="text-red-500 text-sm mt-1">{errors.hourlyPay}</p>}
          </div>

          <div>
            <Label htmlFor="otPay" value="Pago por Horas Extra (S/.) *" className="mb-1 block" />
            <div className="flex items-center gap-2">
              <TextInput
                id="otPay"
                type="text"
                value={otPay}
                onChange={handleOTPayChange}
                placeholder="0.0"
                className="flex-1"
              />
              <Button onClick={incrementOTPay} size="sm">+10</Button>
            </div>
            {errors.otPay && <p className="text-red-500 text-sm mt-1">{errors.otPay}</p>}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t pt-3">
          <div className="flex justify-end space-x-3">
            <Button color="gray" onClick={closeHourlyModal}>Cancelar</Button>
            <Button gradientDuoTone="cyanToBlue" onClick={handleAddHourlyPay}>Guardar</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PayPerHour;