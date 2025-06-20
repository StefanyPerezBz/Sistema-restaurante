import React from 'react'
import { Carousel } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FaUtensils, FaCalendarAlt, FaWineGlassAlt, FaMapMarkerAlt, FaPhone, FaClock, FaStar, FaHeart, FaLeaf, FaInstagram, FaFacebook, FaTripadvisor } from 'react-icons/fa'
import { IoRestaurant, IoWine, IoTime } from 'react-icons/io5'

export default function Home() {
  return (
    <div className='bg-white font-sans'>
      {/* Hero Section con Efecto Parallax */}
      <div className='relative h-screen overflow-hidden'>
        <div className='absolute inset-0 bg-black/30 z-10'></div>
        <div className='absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent z-10'></div>
        
        <Carousel className='h-full' pauseOnHover={false}>
          <img src="../src/image/ss1.jpeg" alt="Interior del restaurante" 
               className='w-full h-full object-cover object-center' />
          <img src="../src/image/ss2.jpeg" alt="Platillo estrella" 
               className='w-full h-full object-cover object-center' />
          <img src="../src/image/ss3.jpeg" alt="Chef preparando comida" 
               className='w-full h-full object-cover object-center' />
        </Carousel>
        
        <div className='absolute bottom-1/4 left-0 right-0 z-20 text-center px-4'>
          <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold text-white font-serif mb-4 tracking-tight'>
            LOS <span className='text-orange-400'>PATOS</span>
          </h1>
          <p className='text-xl md:text-2xl text-orange-100 italic max-w-2xl mx-auto'>
            "Donde cada bocado es una tradición y cada visita, un recuerdo"
          </p>
          <div className='mt-8'>
            <Link>
              <button className='bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium 
                              transition-all duration-300 transform hover:scale-105 shadow-lg'>
                Reservar Mesa
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de Bienvenida */}
      <section className='py-20 px-4 max-w-6xl mx-auto relative'>
        <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-orange-500 rounded-full 
                       flex items-center justify-center shadow-xl'>
          <FaHeart className='text-white text-3xl' />
        </div>
        
        <div className='bg-white p-8 md:p-12 rounded-xl shadow-lg border border-orange-100'>
          <h2 className='text-3xl md:text-4xl font-serif text-center text-orange-600 mb-6'>
            Bienvenidos a Nuestra Mesa
          </h2>
          <div className='w-24 h-1 bg-orange-400 mx-auto mb-8'></div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
            <div>
              <p className='text-lg text-gray-700 mb-6 leading-relaxed'>
                En <span className='text-orange-600 font-semibold'>Los Patos</span>, fusionamos la auténtica cocina tradicional 
                con un toque contemporáneo, creando una experiencia gastronómica que despierta 
                todos los sentidos.
              </p>
              <p className='text-lg text-gray-700 leading-relaxed'>
                Nuestro chef ejecutivo, con más de 20 años de experiencia, selecciona 
                personalmente los ingredientes más frescos del mercado local para ofrecerte 
                sabores inigualables.
              </p>
            </div>
            <div className='relative h-64 md:h-80 rounded-lg overflow-hidden shadow-md'>
              <img src="../src/image/ss4.jpeg" alt="Chef preparando comida" 
                   className='w-full h-full object-cover transition duration-500 hover:scale-110' />
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className='py-20 bg-orange-50'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='text-center mb-16'>
            <div className='inline-block mb-4'>
              <FaLeaf className='text-orange-500 text-4xl mx-auto animate-pulse' />
            </div>
            <h2 className='text-3xl md:text-4xl font-serif text-orange-600'>Nuestras Especialidades</h2>
            <p className='text-orange-500 mt-2'>Descubre lo mejor de nuestra cocina</p>
            <div className='w-24 h-1 bg-orange-400 mx-auto mt-4'></div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {[
              {
                icon: <IoRestaurant className='text-5xl' />,
                title: "Cocina Tradicional",
                description: "Platillos que honran recetas centenarias con ingredientes locales de la más alta calidad."
              },
              {
                icon: <IoWine className='text-5xl' />,
                title: "Maridaje Perfecto",
                description: "Selección de vinos y bebidas artesanales que realzan cada sabor de nuestros platillos."
              },
              {
                icon: <IoTime className='text-5xl' />,
                title: "Experiencia Completa",
                description: "Ambiente acogedor y servicio excepcional para convertir tu comida en un momento memorable."
              }
            ].map((item, index) => (
              <div key={index} className='bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all 
                                        duration-300 transform hover:-translate-y-2 text-center'>
                <div className='text-orange-500 mb-6'>{item.icon}</div>
                <h3 className='text-xl font-semibold mb-3'>{item.title}</h3>
                <p className='text-gray-600'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería de Imágenes */}
      <section className='py-20 px-4'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-serif text-orange-600 text-center mb-12'>Nuestro Ambiente</h2>
          
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {[5, 6, 7, 8].map((num) => (
              <div key={num} className='relative group overflow-hidden rounded-xl shadow-lg h-48 md:h-64'>
                <img 
                  src={`../src/image/ss${num}.jpeg`} 
                  alt={`Galería ${num}`}
                  className='w-full h-full object-cover transition duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center'>
                  <FaHeart className='text-white text-2xl opacity-0 group-hover:opacity-100 transition duration-500 delay-200' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className='py-20 bg-orange-600 text-white'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <div className='inline-block mb-8'>
            <FaStar className='text-orange-300 text-4xl animate-spin-slow' />
          </div>
          
          <h2 className='text-3xl md:text-4xl font-serif mb-12'>Voces de Nuestros Comensales</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
            {[
              {
                quote: "El mejor pato a la naranja que he probado en mi vida. El servicio impecable y el ambiente es encantador.",
                author: "María González",
                rating: 5
              },
              {
                quote: "Celebramos nuestro aniversario aquí y fue mágico. La atención al detalle y los sabores son inolvidables.",
                author: "Carlos y Laura Méndez",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className='bg-white text-orange-800 p-8 rounded-xl shadow-lg h-full'>
                <div className='flex justify-center text-orange-400 mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className='mx-1' />
                  ))}
                </div>
                <p className='italic text-lg mb-6'>"{testimonial.quote}"</p>
                <p className='font-semibold'>- {testimonial.author}</p>
              </div>
            ))}
          </div>
          
          <Link to='/feedback'>
            <button className='bg-white text-orange-600 px-8 py-3 rounded-full font-medium 
                              hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl'>
              Comparte Tu Experiencia
            </button>
          </Link>
        </div>
      </section>

      {/* Horario y Ubicación */}
      <section className='py-20 px-4'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12'>
          {/* Horario */}
          <div className='bg-orange-50 p-8 rounded-xl shadow-lg border border-orange-100'>
            <h2 className='text-3xl font-serif text-orange-600 mb-8 flex items-center'>
              <FaClock className='mr-4 text-orange-500' /> Horario
            </h2>
            
            <div className='space-y-6'>
              <div className='flex justify-between pb-4 border-b border-orange-200'>
                <span className='font-medium text-gray-700'>Lunes - Jueves</span>
                <span className='text-orange-600'>11:00 AM - 10:00 PM</span>
              </div>
              <div className='flex justify-between pb-4 border-b border-orange-200'>
                <span className='font-medium text-gray-700'>Viernes - Sábado</span>
                <span className='text-orange-600'>11:00 AM - 11:00 PM</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>Domingo</span>
                <span className='text-orange-600'>10:00 AM - 9:00 PM</span>
              </div>
            </div>
            
            <div className='mt-8 bg-orange-100 p-4 rounded-lg'>
              <p className='text-orange-700 text-center'>
                <span className='font-semibold'>Horario especial:</span> Festivos 12:00 PM - 8:00 PM
              </p>
            </div>
          </div>
          
          {/* Ubicación */}
          <div className='bg-orange-50 p-8 rounded-xl shadow-lg border border-orange-100'>
            <h2 className='text-3xl font-serif text-orange-600 mb-8 flex items-center'>
              <FaMapMarkerAlt className='mr-4 text-orange-500' /> Visítanos
            </h2>
            
            <div className='space-y-6'>
              <div>
                <p className='text-gray-700 mb-2'>Av. Sabores Tradicionales 456</p>
                <p className='text-gray-700'>Centro Histórico, Ciudad</p>
              </div>
              
              <div className='bg-white p-4 rounded-lg shadow-inner border border-orange-200'>
                <p className='text-orange-600 font-medium mb-2'>Transporte público:</p>
                <p className='text-gray-700'>Metro: Estación Sabores (Línea 3)</p>
                <p className='text-gray-700'>Autobús: Rutas 12, 45 y 78</p>
              </div>
              
              <Link className='inline-block mt-4'>
                <button className='bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg 
                                transition duration-300 flex items-center'>
                  <FaPhone className='mr-2' /> Contactar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className='bg-orange-800 text-white pt-16 pb-8 px-4'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>
            {/* Logo y Descripción */}
            <div>
              <h3 className='text-2xl font-bold font-serif mb-4'>LOS PATOS</h3>
              <p className='text-orange-200 mb-4'>
                Tradición gastronómica desde 1985. Honrando los sabores auténticos con un toque de innovación.
              </p>
              <div className='flex space-x-4'>
                <a href="#" className='text-orange-300 hover:text-white transition duration-300 text-xl'>
                  <FaInstagram />
                </a>
                <a href="#" className='text-orange-300 hover:text-white transition duration-300 text-xl'>
                  <FaFacebook />
                </a>
                <a href="#" className='text-orange-300 hover:text-white transition duration-300 text-xl'>
                  <FaTripadvisor />
                </a>
              </div>
            </div>
            
            {/* Enlaces Rápidos */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Descubre</h4>
              <ul className='space-y-2'>
                <li><Link to='/menu' className='text-orange-200 hover:text-white transition'>Nuestro Menú</Link></li>
                <li><Link to='/gallery' className='text-orange-200 hover:text-white transition'>Galería</Link></li>
                <li><Link to='/events' className='text-orange-200 hover:text-white transition'>Eventos</Link></li>
                <li><Link to='/about' className='text-orange-200 hover:text-white transition'>Nuestra Historia</Link></li>
              </ul>
            </div>
            
            {/* Contacto */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Contacto</h4>
              <ul className='space-y-2'>
                <li className='flex items-start'>
                  <FaMapMarkerAlt className='mt-1 mr-2 text-orange-300' />
                  <span className='text-orange-200'>Av. Sabores 456, Centro</span>
                </li>
                <li className='flex items-center'>
                  <FaPhone className='mr-2 text-orange-300' />
                  <span className='text-orange-200'>(555) 123-4567</span>
                </li>
                <li className='flex items-center'>
                  <FaClock className='mr-2 text-orange-300' />
                  <span className='text-orange-200'>Lun-Dom: 11AM - 10PM</span>
                </li>
              </ul>
            </div>
            
            {/* Boletín */}
            <div>
              <h4 className='text-lg font-semibold mb-4'>Únete a Nuestra Mesa</h4>
              <p className='text-orange-200 mb-4'>
                Recibe noticias, eventos especiales y promociones exclusivas.
              </p>
              <div className='flex'>
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className='px-4 py-2 text-gray-800 rounded-l-lg focus:outline-none w-full'
                />
                <button className='bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-r-lg transition'>
                  Suscribir
                </button>
              </div>
            </div>
          </div>
          
          {/* Derechos de Autor */}
          <div className='border-t border-orange-700 pt-8 text-center'>
            <p className='text-orange-300'>
              &copy; {new Date().getFullYear()} Restaurante Los Patos. Todos los derechos reservados.
            </p>
            <p className='text-orange-400 text-sm mt-2'>
              Diseñado con ♥ para amantes de la buena cocina
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}