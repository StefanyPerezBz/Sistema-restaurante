// import React, { useState } from 'react';
// import { Modal, Label, TextInput, Button } from 'flowbite-react';

// const GenerateTicketPriceModal = ({ show, onClose, onTicketPriceChange }) => {
//   const [empSalary, setEmpSalary] = useState('');
//   const [electricityBill, setElectricityBill] = useState('');
//   const [waterBill, setWaterBill] = useState('');
//   const [inventory, setInventoryOutage] = useState('');
//   // const [budget, setBudget] = useState('');
//   const [otherExpenses, setOtherExpenses] = useState('');
//   const [ticketQuantity, setTicketQuantity] = useState('');
//   const [ticketPrice, setTicketPrice] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');


//   const isValidNumber = (value) => {
//   // Check if the value is a valid positive number
//   return /^\d*\.?\d+$/.test(value) && parseFloat(value) > 0;
// };


//   const calculateTicketPrice = () => {
//     // if(empSalary === '' || electricityBill === '' || waterBill === '' || inventory === '' || budget === '' || ticketQuantity === '') {
//     //   // alert('Please fill all the fields');
//     //   setErrorMessage('Please fill all the required fields'); 
//     //   return;
//     // }
//     if (empSalary === '') {
//       setErrorMessage('Por favor, ingresa el salario del empleado');
//       return;
//     }
//     if (electricityBill === '') {
//       setErrorMessage('Por favor, ingresa el monto estimado de la factura de electricidad');
//       return;
//     }
//     if (waterBill === '') {
//       setErrorMessage('Por favor, ingresa el monto estimado de la factura de agua');
//       return;
//     }
//     if (inventory === '') {
//       setErrorMessage('Por favor, ingresa el monto estimado de pérdida de inventari');
//       return;
//     }
//     // if (budget === '') {
//     //   setErrorMessage('Please enter the expected budget');
//     //   return;
//     // }
//     if (ticketQuantity === '') {
//       setErrorMessage('Por favor ingrese la cantidad de entradas');
//       return;
//     }


//     // Calculate ticket price based on inputs
//     const totalCost = 
//       parseFloat(empSalary) + 
//       parseFloat(electricityBill) + 
//       parseFloat(waterBill)  + 
//       parseFloat(inventory) + 
//       // parseFloat(budget) +
//       (otherExpenses !== '' ? parseFloat(otherExpenses) : 0); 

//     const pricePerTicket = totalCost / parseFloat(ticketQuantity);
//     setTicketPrice(pricePerTicket.toFixed(2));
//     onTicketPriceChange(formattedPrice); // Pass calculated price back to parent component

//   };

//     const handleSetTicketPrice = () => {
//     console.log('Ticket Price: ', ticketPrice);
//     onTicketPriceChange(ticketPrice); // Pass calculated price back to parent component
//     onClose(); // Close the modal after setting the ticket price
//   };


//   return (
//     <Modal show={show} size="md" onClose={onClose} >
//       <Modal.Header>
//         <h3 className="text-xl font-medium text-gray-900 ">Calcular el precio del ticket</h3>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="space-y-6">
//           <div>
//             <Label htmlFor="empSalary" value="Salario del empleado (S/.)*" />
//             <TextInput
//               id="empSalary"
//               type="text"
//               placeholder="Ingresar salario"
//               value={empSalary}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setEmpSalary(newValue);
//                   }
//               }}
//             />
//           </div>
//           <div>
//             <Label htmlFor="electricityBill" value="Factura de electricidad estimada (S/.)*" />
//             <TextInput
//               id="electricityBill"
//               type="text"
//               placeholder="Ingresar factura de electricidad"
//               value={electricityBill}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setElectricityBill(newValue);
//                   }
//               }}
//             />
//           </div>
//           <div>
//             <Label htmlFor="waterBill" value="Factura de agua estimada (S/.)*" />
//             <TextInput
//               id="waterBill"
//               type="text"
//               placeholder="Ingresar factura de agua"
//               value={waterBill}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setWaterBill(newValue);
//                   }
//               }}
//             />
//           </div>
//           <div>
//             <Label htmlFor="inventory" value="Estimación del valor del inventario que va a faltar o agotarse (S/.)*" />
//             <TextInput
//               id="inventory"
//               type="text"
//               placeholder=""
//               value={inventory}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setInventoryOutage(newValue);
//                   }
//               }}
//             />
//           </div>
//           {/* <div>
//             <Label htmlFor="budget" value="Expected Budget (Rs.)*" />
//             <TextInput
//               id="budget"
//               type="text"
//               placeholder=""
//               value={budget}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setBudget(newValue);
//                   }
//               }}
//             /> */}
//           {/* </div> */}
//            <div>
//             <Label htmlFor="otherExpenses" value="Gastos adicionales (S/.)" />
//             <TextInput
//               id="otherExpenses"
//               type="text"
//               placeholder="Ingresar gastos adicionales"
//               value={otherExpenses}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setOtherExpenses(newValue);
//                   }
//               }}
//             />
//           </div>
//           <div>
//             <Label htmlFor="ticketQuantity" value="Cantidad de tickets*" />
//             <TextInput
//               id="ticketQuantity"
//               type="text"
//               placeholder="Ingresar cantidad de tickets"
//               value={ticketQuantity}
//               onChange={(e) => {const newValue = e.target.value;
//                   if (newValue === '' || isValidNumber(newValue)) {
//                     setTicketQuantity(newValue);
//                   }
//               }}
//             />
//           </div>
//           <Button onClick={calculateTicketPrice} className='bg-green-500 hover:bg-green-600' >Calcular </Button>
//           {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}
//           {!ticketPrice && errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//           {ticketPrice && (
//             <div className="text-lg font-bold text-green-900">
//               Precio por ticket: S/. {ticketPrice}
//               {/* Button to set ticket price in parent component */}
//             <Button onClick={handleSetTicketPrice} className='mt-4 bg-green-500 hover:bg-green-600'>Fijar precio </Button>
//             </div>
//           )}
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default GenerateTicketPriceModal;

import React, { useState } from 'react';
import { Modal, Label, TextInput, Button } from 'flowbite-react';
import Swal from 'sweetalert2';

const GenerateTicketPriceModal = ({ show, onClose, onTicketPriceChange }) => {
  const [formData, setFormData] = useState({
    empSalary: '',
    electricityBill: '',
    waterBill: '',
    inventory: '',
    otherExpenses: '',
    ticketQuantity: ''
  });

  const [ticketPrice, setTicketPrice] = useState('');
  const [errors, setErrors] = useState({});


  const isValidNumber = (value) => {
    return /^(\d+)?(\.\d?)?$/.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación mientras se escribe
    if (value === '' || isValidNumber(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Limpiar error si se corrige
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };

  const validateFields = () => {
    const newErrors = {};
    let isValid = true;

    // Validar campos obligatorios
    const requiredFields = ['empSalary', 'electricityBill', 'waterBill', 'inventory', 'ticketQuantity'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo es requerido';
        isValid = false;
      } else if (!/^\d+(\.\d)?$/.test(formData[field]) || parseFloat(formData[field]) <= 0) {
        newErrors[field] = 'Debe ser un número mayor a 0 con máximo un decimal';
        isValid = false;
      }

    });


    // Validar campo opcional
    if (formData.otherExpenses) {
      if (formData.otherExpenses && (!/^\d+(\.\d)?$/.test(formData.otherExpenses) || parseFloat(formData.otherExpenses) <= 0)) {
        newErrors.otherExpenses = 'Debe ser un número mayor a 0 con máximo un decimal';
        isValid = false;
      }

    }


    setErrors(newErrors);
    return isValid;
  };

  const calculateTicketPrice = () => {
    if (!validateFields()) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor corrige los errores en el formulario',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Validar cantidad de tickets
    const ticketQty = parseFloat(formData.ticketQuantity);
    if (!ticketQty || isNaN(ticketQty) || ticketQty <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'La cantidad de tickets debe ser un número válido mayor que 0',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    // Calcular precio
    const totalCost =
      parseFloat(formData.empSalary) +
      parseFloat(formData.electricityBill) +
      parseFloat(formData.waterBill) +
      parseFloat(formData.inventory) +
      (formData.otherExpenses ? parseFloat(formData.otherExpenses) : 0);

    const pricePerTicket = totalCost / parseFloat(formData.ticketQuantity);
    const formattedPrice = pricePerTicket.toFixed(2);

    setTicketPrice(formattedPrice);
  };

  const handleSetTicketPrice = () => {
    onTicketPriceChange(ticketPrice);

    Swal.fire({
      title: 'Éxito',
      text: `Precio del ticket fijado en S/. ${ticketPrice}`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });

    onClose();
  };

  return (
    <Modal show={show} size="md" onClose={onClose}>
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900">Calcular el precio del ticket</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          {/* Salario del empleado */}
          <div>
            <Label htmlFor="empSalary" value="Salario del empleado (S/.)*" />
            <TextInput
              id="empSalary"
              type="text"
              placeholder="Ingresar salario"
              value={formData.empSalary}
              onChange={handleChange}
              name="empSalary"
              color={errors.empSalary ? 'failure' : ''}
              helperText={errors.empSalary && <span className="text-red-500">{errors.empSalary}</span>}
            />
          </div>

          {/* Factura de electricidad */}
          <div>
            <Label htmlFor="electricityBill" value="Factura de electricidad estimada (S/.)*" />
            <TextInput
              id="electricityBill"
              type="text"
              placeholder="Ingresar factura de electricidad"
              value={formData.electricityBill}
              onChange={handleChange}
              name="electricityBill"
              color={errors.electricityBill ? 'failure' : ''}
              helperText={errors.electricityBill && <span className="text-red-500">{errors.electricityBill}</span>}
            />
          </div>

          {/* Factura de agua */}
          <div>
            <Label htmlFor="waterBill" value="Factura de agua estimada (S/.)*" />
            <TextInput
              id="waterBill"
              type="text"
              placeholder="Ingresar factura de agua"
              value={formData.waterBill}
              onChange={handleChange}
              name="waterBill"
              color={errors.waterBill ? 'failure' : ''}
              helperText={errors.waterBill && <span className="text-red-500">{errors.waterBill}</span>}
            />
          </div>

          {/* Inventario */}
          <div>
            <Label htmlFor="inventory" value="Estimación del valor del inventario que va a faltar o agotarse (S/.)*" />
            <TextInput
              id="inventory"
              type="text"
              placeholder="Ingresar valor estimado"
              value={formData.inventory}
              onChange={handleChange}
              name="inventory"
              color={errors.inventory ? 'failure' : ''}
              helperText={errors.inventory && <span className="text-red-500">{errors.inventory}</span>}
            />
          </div>

          {/* Gastos adicionales */}
          <div>
            <Label htmlFor="otherExpenses" value="Gastos adicionales (S/.)" />
            <TextInput
              id="otherExpenses"
              type="text"
              placeholder="Ingresar gastos adicionales"
              value={formData.otherExpenses}
              onChange={handleChange}
              name="otherExpenses"
              color={errors.otherExpenses ? 'failure' : ''}
              helperText={errors.otherExpenses && <span className="text-red-500">{errors.otherExpenses}</span>}
            />
          </div>

          {/* Cantidad de tickets */}
          <div>
            <Label htmlFor="ticketQuantity" value="Cantidad de tickets*" />
            <TextInput
              id="ticketQuantity"
              type="text"
              placeholder="Ingresar cantidad de tickets"
              value={formData.ticketQuantity}
              onChange={handleChange}
              name="ticketQuantity"
              color={errors.ticketQuantity ? 'failure' : ''}
              helperText={errors.ticketQuantity && <span className="text-red-500">{errors.ticketQuantity}</span>}
            />
          </div>

          {/* Botón de cálculo */}
          <Button
            onClick={calculateTicketPrice}
            className='bg-green-500 hover:bg-green-600 w-full'
          >
            Calcular
          </Button>

          {/* Resultado y botón para fijar precio */}
          {ticketPrice && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-green-900 text-center">
                Precio por ticket: S/. {ticketPrice}
              </div>
              <Button
                onClick={handleSetTicketPrice}
                className='mt-4 bg-blue-500 hover:bg-blue-600 w-full'
              >
                Fijar precio
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GenerateTicketPriceModal;