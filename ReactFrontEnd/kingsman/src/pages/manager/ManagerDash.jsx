import React, { useEffect } from 'react'
import { Card } from 'flowbite-react'
import axios from 'axios'
import { useState } from 'react'
import { MdDelete } from "react-icons/md";

export default function ManagerDash() {
  const [tables, setTable] = useState([]);
  const [nextEvent, setNextEvent] = useState([]);

  useEffect(() => {
    fetchData();
  }
    , []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/table/all");
      setTable(response.data)


      const eventResponse = await axios.get("http://localhost:8080/api/events/next-event");
      setNextEvent(eventResponse.data)
      console.log(eventResponse.data)
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Calculate the quantity of available tables
  const availableTables = tables.filter(table => table.tableAvailability === true).length;

  return (
    <div className='bg-gray-100 p-5 w-full'>
      <div className='flex flex-wrap ml-5 my-4'>

        {/* {*Display the available tables count*} */}
        <div key="" className=' w-fit h-auto ml-5 my-4'>
          <Card

            className="max-w-sm"
            imgAlt="Table with chairs"
            imgSrc="./src/image/638523.png"
            horizontal
          >
            <div className=' mt-8'>
            <div className=' w-40 justify-center'>
              <h2 className=' font-bold text-2xl text-center'>Disponible </h2>
            </div>
            <div className=' w-40 justify-center mt-2'>
              <h2 className=' font-bold text-2xl text-center'><span className='text-4xl text-green-600'>{availableTables}</span> <span className=' text-gray-500'>/ {tables.length} </span> </h2>
            </div>
            </div>
          </Card>
        </div>
         <div key="next-event" className='pt-5 pl-10'>
          <Card className=" pl-20 pr-20 max-w-sm" horizontal>
            <div className='mt-8'>
              <div className='text-center'>
                <h2 className='font-bold text-2xl'>Próximo evento</h2>
              </div>
              <div className='text-center mt-2'>
                <h2 className='font-bold text-2xl'>
                  <span className='text-xl text-green-600'>
                    {nextEvent ? nextEvent.eventName : 'No hay eventos próximos'} <br />
                    {nextEvent ? nextEvent.eventDate : ''}
                  </span>
                </h2>
              </div>
            </div>
          </Card>
        </div>


      </div>
    </div>
  )
}
