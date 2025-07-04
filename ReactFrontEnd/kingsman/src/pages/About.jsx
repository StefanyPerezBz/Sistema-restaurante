import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaParking, FaBus, FaUtensils, FaCalendarAlt } from 'react-icons/fa';

export default function About() {
  return (
    <div className='bg-gray-100 dark:bg-gray-900 p-6 md:p-10 min-h-screen transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-orange-600 dark:text-orange-400 text-center font-serif'>
          Sobre Nosotros
        </h1>
        
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Columna Izquierda - Imagen */}
          <div className='lg:basis-2/5'>
            <div className='relative rounded-2xl overflow-hidden shadow-2xl h-full min-h-[400px]'>
              <img 
                src="../src/image/about.jpg" 
                alt='Restaurante Los Patos' 
                className='w-full h-full object-cover transition-transform duration-500 hover:scale-105'
              />
              <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6'>
                <h2 className='text-2xl font-bold text-white'>Los Patos</h2>
                <p className='text-orange-200'>Chepén - Desde 1985</p>
              </div>
            </div>
          </div>
          
          {/* Columna Central - Descripción */}
          <div className='lg:basis-3/5 space-y-8'>
            <div className='bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-md'>
              <h2 className='text-2xl md:text-3xl font-semibold text-orange-600 dark:text-orange-400 mb-4'>
                Nuestra Historia
              </h2>
              <div className='prose dark:prose-invert max-w-none'>
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-4'>
                  Bienvenidos a <strong className='text-orange-600 dark:text-orange-400'>Los Patos</strong>, el corazón gastronómico de Chepén. Desde 1985, hemos sido el lugar donde tradición y sabor se encuentran, ofreciendo los platillos más auténticos de la región.
                </p>
                <p className='text-lg text-gray-700 dark:text-gray-300 mb-4'>
                  Nuestro restaurante campestre, ubicado en las afueras de Chepén, combina la calidez del campo con la excelencia culinaria. Cada ingrediente es seleccionado cuidadosamente de productores locales, garantizando frescura y calidad en cada bocado.
                </p>
                <p className='text-lg text-gray-700 dark:text-gray-300'>
                  Más que un restaurante, somos parte de la comunidad de Chepén, un lugar donde las familias celebran, los amigos se reúnen y los visitantes descubren los sabores auténticos de nuestra tierra.
                </p>
              </div>
            </div>
            
            {/* Información de Contacto */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
                <h3 className='text-xl font-semibold text-orange-600 dark:text-orange-400 mb-4 flex items-center'>
                  <FaUtensils className='mr-2' /> Información
                </h3>
                <div className='space-y-4'>
                  <div className='flex items-start'>
                    <FaMapMarkerAlt className='text-orange-500 dark:text-orange-300 mt-1 mr-3 flex-shrink-0' />
                    <div>
                      <p className='font-medium text-gray-700 dark:text-gray-300'>Chepén Km 712</p>
                      <p className='text-gray-600 dark:text-gray-400'>Chepén, La Libertad</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <FaPhone className='text-orange-500 dark:text-orange-300 mr-3 flex-shrink-0' />
                    <p className='text-gray-700 dark:text-gray-300'>(044) 456-7890</p>
                  </div>
                  <div className='flex items-center'>
                    <FaEnvelope className='text-orange-500 dark:text-orange-300 mr-3 flex-shrink-0' />
                    <p className='text-gray-700 dark:text-gray-300'>lospatos@gmail.com</p>
                  </div>
                </div>
              </div>
              
              <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
                <h3 className='text-xl font-semibold text-orange-600 dark:text-orange-400 mb-4 flex items-center'>
                  <FaClock className='mr-2' /> Horario
                </h3>
                <div className='space-y-3'>
                  <div className='flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700'>
                    <span className='text-gray-700 dark:text-gray-300'>Lunes - Viernes</span>
                    <span className='font-medium text-orange-600 dark:text-orange-400'>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className='flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700'>
                    <span className='text-gray-700 dark:text-gray-300'>Sábado</span>
                    <span className='font-medium text-orange-600 dark:text-orange-400'>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-700 dark:text-gray-300'>Domingo</span>
                    <span className='font-medium text-orange-600 dark:text-orange-400'>9:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <div className='mt-4 bg-orange-100 dark:bg-gray-700 p-3 rounded-lg'>
                  <p className='text-orange-700 dark:text-orange-300 text-center text-sm'>
                    Horario extendido los feriados hasta las 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Columna Derecha - Mapa y Eventos */}
          <div className='lg:basis-2/5 space-y-8'>
            <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
              <h2 className='text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4'>
                Nuestra Ubicación
              </h2>
              <div className='aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md'>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.674715760634!2d-79.43138292400638!3d-7.227880492718701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904c5c7f5b5b5b5b%3A0x5b5b5b5b5b5b5b5b!2sLos%20Patos%2C%20Chep%C3%A9n!5e0!3m2!1ses!2spe!4v1620000000000!5m2!1ses!2spe"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className='dark:grayscale-[20%] dark:opacity-90'
                  title="Ubicación Los Patos Chepén"
                ></iframe>
              </div>
              <div className='mt-4 flex flex-wrap gap-2'>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-gray-700 dark:text-orange-300'>
                  <FaParking className='mr-1' /> Estacionamiento
                </span>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-gray-700 dark:text-orange-300'>
                  <FaBus className='mr-1' /> Accesible
                </span>
                <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-gray-700 dark:text-orange-300'>
                  <FaUtensils className='mr-1' /> Terraza
                </span>
              </div>
            </div>
            
            <div className='bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md'>
              <h2 className='text-2xl font-semibold text-orange-600 dark:text-orange-400 mb-4 flex items-center'>
                <FaCalendarAlt className='mr-2' /> Eventos Especiales
              </h2>
              <p className='text-gray-700 dark:text-gray-300 mb-4'>
                Nuestro espacio campestre es ideal para celebrar tus momentos especiales:
              </p>
              <ul className='space-y-3 text-gray-700 dark:text-gray-300'>
                <li className='flex items-start'>
                  <span className='text-orange-500 dark:text-orange-400 mr-2'>•</span>
                  <span>Bodas y aniversarios</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-orange-500 dark:text-orange-400 mr-2'>•</span>
                  <span>Eventos corporativos</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-orange-500 dark:text-orange-400 mr-2'>•</span>
                  <span>Celebraciones familiares</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-orange-500 dark:text-orange-400 mr-2'>•</span>
                  <span>Cenas románticas</span>
                </li>
              </ul>
              <button className='mt-4 w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition duration-300'>
                Consultar para Eventos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}