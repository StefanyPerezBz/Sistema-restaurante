import { React, Fragment, useEffect, useState } from 'react'
import { Table, Button, Pagination } from "flowbite-react";
import axios from 'axios';
import UseItemPopup from './UseItemPopup';

export default function ManageInventory() {
  const [items, setItems] = useState([]);
  const [todayUsage, setTodayUsage] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Number of items to display per page

  useEffect(() => { /*run the useEffect method, when lord the page and chenge the state*/
    fetchData();
    fetchTodayUsage();

  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/inventory/view");
      console.log(response.data);
      setItems(response.data);
      fetchTodayUsage();

    } catch (error) {
      console.error("Error al recuperar datos", error);

    }
  };

  // Calculate the index range of items to display based on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter the inventory data to display only items for the current page
  const currentInventoryData = items.slice(startIndex, endIndex);

  const onPageChange = (page) => {
    setCurrentPage(page);

  };

  const fetchTodayUsage = async () => {
    try {

      const currentDate = new Date(); // Get the current date
      currentDate.setDate(currentDate.getDate() + 0); // Increase the date by 1 day
      const increasedDate = currentDate.toISOString().split('T')[0]; // Format the increased date
      console.log(increasedDate); // Output the increased date


      const response = await axios.get(`http://localhost:8080/api/inventory/inventory-usage-log/` + increasedDate);
      console.log(response);
      setTodayUsage(response.data);
    } catch (error) {
      console.error("Error al obtener el uso de hoy", error);
    }
  };

  // use Item popup winfow function

  const handleUseItem = (itemId) => {
    const item = items.find(item => item.id === itemId);
    setSelectedItem(item);
    setShowPopup(true);
    fetchData();
  };

  const handleUseItemConfirm = async (quantityUsed) => {
    try {
      fetchData();
      setShowPopup(false);
    } catch (error) {
      console.error("Error al usar el artículo", error);
    }
  };

  const handleCancelPopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };


  return (
    <Fragment>
      <section>
        <div className='h-screen w-full flex grid-rows-2 md:grid-cols-2 bg-gray-200 dark:bg-gray-700'>

          <div className='h-full w-3/5 md:h-screen p-4 border-r-2 border-white'>
            <div className='flex justify-between border-b-2 bg-white p-2 rounded-lg shadow-md dark:bg-gray-600'>
              {/* Left column */}
              <h2 className="text-2xl">Artículo de inventario disponible</h2>
            </div>
            <br></br>
            {/* Pagination */}
            <div className="flex mt-0 justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={onPageChange}
              />
            </div>
            {/* inventory Table */}
            <div className="overflow-x-auto drop-shadow-md">
              <Table striped>
                <Table.Head>
                  <Table.HeadCell className='text-center bg-green-100'>#</Table.HeadCell>
                  <Table.HeadCell className='text-center bg-green-100'>ID</Table.HeadCell>
                  <Table.HeadCell className='text-center bg-green-100'>Nombre del ítem</Table.HeadCell>
                  <Table.HeadCell className='text-center bg-green-100' >Cantidad</Table.HeadCell>
                  <Table.HeadCell className='text-center bg-green-100 '>Nombre del vendedor</Table.HeadCell>
                  <Table.HeadCell className='text-center bg-green-100'>Acción</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">

                  {currentInventoryData.map((item, index) => (
                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className='text-center'>{index + 1}</Table.Cell>
                      <Table.Cell className='text-center'>{item.id}</Table.Cell>
                      <Table.Cell>{item.itemName}</Table.Cell>
                      <Table.Cell className='text-center'><span>{item.quantity} {item.unit}</span></Table.Cell>
                      <Table.Cell className='text-center'>{item.vendorId}</Table.Cell>
                      <Table.Cell><Button size='md' color='success' className=' bg-green-500' onClick={() => handleUseItem(item.id)}>Use</Button></Table.Cell>
                    </Table.Row>
                  ))
                  }
                </Table.Body>
              </Table>
            </div>


          </div>


          {/* Right column */}
          <div className=' h-full w-2/5 md:h-screen  p-4 justify-start items-center'>
            <div className='border-b-2 w-full bg-white p-2 rounded-md shadow-md dark:bg-gray-600'>
              <h2 className="text-2xl ">Today Item Usage</h2>
            </div>

            {/* daily usage show table */}
            <div className="overflow-x-auto shadow-md mt-16">


              <Table striped>
                <Table.Head>
                  <Table.HeadCell className='text-center  bg-green-100'>#</Table.HeadCell>
                  <Table.HeadCell className='text-center  bg-green-100'>ID</Table.HeadCell>
                  <Table.HeadCell className='text-center  bg-green-100'>Nombre</Table.HeadCell>
                  <Table.HeadCell className='text-center  bg-green-100'>Cantidad usada</Table.HeadCell>
                  <Table.HeadCell className='text-center bg-green-100'>Tiempo usado</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">

                  {todayUsage.map((usage, index) => (
                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className='text-center'>{index + 1}</Table.Cell>
                      <Table.Cell className='text-center'>{usage.itemId}</Table.Cell>
                      <Table.Cell className='text-center'>{usage.itemName}</Table.Cell>
                      <Table.Cell className='text-center'>{usage.decreasedQuantity} {usage.unit}</Table.Cell>
                      <Table.Cell className='text-center'>{new Date(usage.usageDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Table.Cell>

                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>


            </div>



          </div>

        </div>
        {/* Popup window */}
        {showPopup && selectedItem && (
          <UseItemPopup
            item={selectedItem}
            onConfirm={handleUseItemConfirm}
            onCancel={handleCancelPopup}
            onReloadItems={() => {
              fetchData();
              fetchTodayUsage();
            }}
          />
        )}
      </section>

    </Fragment>
  )
}
