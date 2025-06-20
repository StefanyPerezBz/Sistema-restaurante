import React, { useState } from 'react';
import { Modal, Label, TextInput, Button } from 'flowbite-react';

const GenerateTicketPriceModal = ({ show, onClose, onTicketPriceChange }) => {
  const [empSalary, setEmpSalary] = useState('');
  const [electricityBill, setElectricityBill] = useState('');
  const [waterBill, setWaterBill] = useState('');
  const [inventory, setInventoryOutage] = useState('');
  // const [budget, setBudget] = useState('');
  const [otherExpenses, setOtherExpenses] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const isValidNumber = (value) => {
  // Check if the value is a valid positive number
  return /^\d*\.?\d+$/.test(value) && parseFloat(value) > 0;
};


  const calculateTicketPrice = () => {
    // if(empSalary === '' || electricityBill === '' || waterBill === '' || inventory === '' || budget === '' || ticketQuantity === '') {
    //   // alert('Please fill all the fields');
    //   setErrorMessage('Please fill all the required fields'); 
    //   return;
    // }
    if (empSalary === '') {
      setErrorMessage('Por favor, ingresa el salario del empleado');
      return;
    }
    if (electricityBill === '') {
      setErrorMessage('Por favor, ingresa el monto estimado de la factura de electricidad');
      return;
    }
    if (waterBill === '') {
      setErrorMessage('Por favor, ingresa el monto estimado de la factura de agua');
      return;
    }
    if (inventory === '') {
      setErrorMessage('Por favor, ingresa el monto estimado de pérdida de inventari');
      return;
    }
    // if (budget === '') {
    //   setErrorMessage('Please enter the expected budget');
    //   return;
    // }
    if (ticketQuantity === '') {
      setErrorMessage('Por favor ingrese la cantidad de entradas');
      return;
    }


    // Calculate ticket price based on inputs
    const totalCost = 
      parseFloat(empSalary) + 
      parseFloat(electricityBill) + 
      parseFloat(waterBill)  + 
      parseFloat(inventory) + 
      // parseFloat(budget) +
      (otherExpenses !== '' ? parseFloat(otherExpenses) : 0); 

    const pricePerTicket = totalCost / parseFloat(ticketQuantity);
    setTicketPrice(pricePerTicket.toFixed(2));
    onTicketPriceChange(formattedPrice); // Pass calculated price back to parent component

  };

    const handleSetTicketPrice = () => {
    console.log('Ticket Price: ', ticketPrice);
    onTicketPriceChange(ticketPrice); // Pass calculated price back to parent component
    onClose(); // Close the modal after setting the ticket price
  };


  return (
    <Modal show={show} size="md" onClose={onClose} >
      <Modal.Header>
        <h3 className="text-xl font-medium text-gray-900 ">Calcular el precio del ticket</h3>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div>
            <Label htmlFor="empSalary" value="Employee Salary (S/.)*" />
            <TextInput
              id="empSalary"
              type="text"
              placeholder=""
              value={empSalary}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setEmpSalary(newValue);
                  }
              }}
            />
          </div>
          <div>
            <Label htmlFor="electricityBill" value="Estimated Electricity Bill (S/.)*" />
            <TextInput
              id="electricityBill"
              type="text"
              placeholder=""
              value={electricityBill}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setElectricityBill(newValue);
                  }
              }}
            />
          </div>
          <div>
            <Label htmlFor="waterBill" value=" Estimated Water Bill (Rs.)*" />
            <TextInput
              id="waterBill"
              type="text"
              placeholder=""
              value={waterBill}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setWaterBill(newValue);
                  }
              }}
            />
          </div>
          <div>
            <Label htmlFor="inventory" value=" Estimated Inventory Outage (Rs.)*" />
            <TextInput
              id="inventory"
              type="text"
              placeholder=""
              value={inventory}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setInventoryOutage(newValue);
                  }
              }}
            />
          </div>
          {/* <div>
            <Label htmlFor="budget" value="Expected Budget (Rs.)*" />
            <TextInput
              id="budget"
              type="text"
              placeholder=""
              value={budget}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setBudget(newValue);
                  }
              }}
            /> */}
          {/* </div> */}
           <div>
            <Label htmlFor="otherExpenses" value="Other Expenses (Rs.)" />
            <TextInput
              id="otherExpenses"
              type="text"
              placeholder=""
              value={otherExpenses}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setOtherExpenses(newValue);
                  }
              }}
            />
          </div>
          <div>
            <Label htmlFor="ticketQuantity" value="Ticket Quantity*" />
            <TextInput
              id="ticketQuantity"
              type="text"
              placeholder=""
              value={ticketQuantity}
              onChange={(e) => {const newValue = e.target.value;
                  if (newValue === '' || isValidNumber(newValue)) {
                    setTicketQuantity(newValue);
                  }
              }}
            />
          </div>
          <Button onClick={calculateTicketPrice} className='bg-green-500 hover:bg-green-600' >Calculate </Button>
          {/* {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}
          {!ticketPrice && errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {ticketPrice && (
            <div className="text-lg font-bold text-green-900">
              Precio por ticket: S/. {ticketPrice}
              {/* Button to set ticket price in parent component */}
            <Button onClick={handleSetTicketPrice} className='mt-4 bg-green-500 hover:bg-green-600'>Fijar precio </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GenerateTicketPriceModal;
