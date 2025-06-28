import { Button, TextInput, Label } from 'flowbite-react';
import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateStart, updateSuccess, updateFailure } from '../../redux/user/userSlice';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function CashierProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [nameCharCount, setNameCharCount] = useState(currentUser.first_name?.length || 0);
  const [lastNameCharCount, setLastNameCharCount] = useState(currentUser.last_name?.length || 0);
  const [addressCharCount, setAddressCharCount] = useState(currentUser.address?.length || 0);
  const [emailValid, setEmailValid] = useState(true);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  // Traducción de cargos y géneros (solo visual)
  const translatePosition = (position) => {
    const translations = {
      'cashier': 'Cajero',
      'manager': 'Gerente',
      'admin': 'Administrador',
      'chef': 'Chef',
      'waiter': 'Mesero',
      'waitress': 'Mesera'
    };
    return translations[position?.toLowerCase()] || position;
  };

  const translateGender = (gender) => {
    const translations = {
      'male': 'Masculino',
      'female': 'Femenino',
      'other': 'Otro',
      'm': 'Masculino',
      'f': 'Femenino',
      'o': 'Otro'
    };
    return translations[gender?.toLowerCase()] || gender;
  };

  // Validación de email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmailValid(validateEmail(email) || email === '');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El tamaño del archivo debe ser menor a 2MB',
          confirmButtonText: 'Entendido'
        });
        return;
      }
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/food/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.imageName;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo subir la imagen',
        confirmButtonText: 'Entendido'
      });
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setNameCharCount(value.length);
    } else {
      e.target.value = value.substring(0, 50);
    }
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setLastNameCharCount(value.length);
    } else {
      e.target.value = value.substring(0, 50);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    if (value.length <= 100) {
      setAddressCharCount(value.length);
    } else {
      e.target.value = value.substring(0, 100);
    }
  };

  const handlePhoneChange = (e) => {
    // Solo permite números y máximo 9 dígitos
    const value = e.target.value.replace(/\D/g, '').substring(0, 9);
    e.target.value = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!emailValid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese un correo electrónico válido',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    try {
      dispatch(updateStart());
      
      // Subir imagen primero si hay una nueva
      let imageName = currentUser.profilePicture;
      if (imageFile) {
        imageName = await uploadImage();
        if (!imageName) return;
      }

      // Preparar datos para actualizar
      const updateData = {
        ...(imageName && { profilePicture: imageName }),
        email: e.target.email.value,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        contact_number: e.target.contact_number.value,
        address: e.target.address.value,
        gender: currentUser.gender,
        uniform_size: currentUser.uniform_size,
        emergency_contact: e.target.emergency_contact.value,
        position: currentUser.position
      };

      const response = await axios.put(
        `http://localhost:8080/api/employees/update/${currentUser.id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      dispatch(updateSuccess(response.data));
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: 'Perfil actualizado correctamente',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (error) {
      dispatch(updateFailure(error.message));
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Error al actualizar',
        confirmButtonText: 'Entendido'
      });
    }
  };

  // Imagen por defecto si no hay una imagen de perfil
  const profileImageSrc = imageFileURL || 
    (currentUser.profilePicture 
      ? `http://localhost:8080/api/food/image/${currentUser.profilePicture}`
      : '/default-profile.png');

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Perfil</h1>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept='image/*' 
          onChange={handleImageChange} 
          ref={filePickerRef} 
          hidden 
        />
        
        <div 
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' 
          onClick={() => filePickerRef.current.click()}
        >
          <img 
            src={profileImageSrc}
            alt='Foto de perfil' 
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'
            onError={(e) => {
              e.target.src = '/default-profile.png';
            }}
          />
        </div>

        {/* Nombre con contador de caracteres */}
        <div>
          <Label htmlFor="first_name" value="Nombres" />
          <TextInput 
            type='text' 
            id='first_name' 
            placeholder='Ingrese sus nombres' 
            defaultValue={currentUser.first_name}
            onChange={handleNameChange}
            maxLength={50}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{nameCharCount}/50 caracteres</p>
        </div>

        {/* Apellido con contador de caracteres */}
        <div>
          <Label htmlFor="last_name" value="Apellidos" />
          <TextInput 
            type='text' 
            id='last_name' 
            placeholder='Ingrese sus apellidos' 
            defaultValue={currentUser.last_name}
            onChange={handleLastNameChange}
            maxLength={50}
            required
          />
          <p className="text-xs text-gray-500 mt-1">{lastNameCharCount}/50 caracteres</p>
        </div>

        {/* Correo electrónico con validación */}
        <div>
          <Label htmlFor="email" value="Correo electrónico" />
          <TextInput 
            type='email' 
            id='email' 
            placeholder='correo@ejemplo.com' 
            defaultValue={currentUser.email}
            onChange={handleEmailChange}
            color={emailValid ? 'gray' : 'failure'}
            helperText={!emailValid && 'Ingrese un correo electrónico válido'}
            required
          />
        </div>

        {/* Teléfono (9 dígitos) */}
        <div>
          <Label htmlFor="contact_number" value="Teléfono (9 dígitos)" />
          <TextInput 
            type='text' 
            id='contact_number' 
            placeholder='Ej: 987654321' 
            defaultValue={currentUser.contact_number}
            onChange={handlePhoneChange}
            maxLength={9}
          />
        </div>

        {/* Dirección con contador de caracteres */}
        <div>
          <Label htmlFor="address" value="Dirección" />
          <TextInput 
            type='text' 
            id='address' 
            placeholder='Ingrese su dirección completa' 
            defaultValue={currentUser.address}
            onChange={handleAddressChange}
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">{addressCharCount}/100 caracteres</p>
        </div>

        {/* Género (no editable) con traducción */}
        <div>
          <Label htmlFor="gender" value="Género" />
          <TextInput 
            type='text' 
            id='gender' 
            defaultValue={translateGender(currentUser.gender)} 
            readOnly
            className='bg-gray-100 cursor-not-allowed'
          />
        </div>

        {/* Talla de uniforme (no editable) */}
        <div>
          <Label htmlFor="uniform_size" value="Talla de uniforme" />
          <TextInput 
            type='text' 
            id='uniform_size' 
            defaultValue={currentUser.uniform_size} 
            readOnly
            className='bg-gray-100 cursor-not-allowed'
          />
        </div>

        {/* Contacto de emergencia */}
        <div>
          <Label htmlFor="emergency_contact" value="Contacto de emergencia" />
          <TextInput 
            type='text' 
            id='emergency_contact' 
            placeholder='Nombre y teléfono de contacto' 
            defaultValue={currentUser.emergency_contact} 
          />
        </div>

        {/* Cargo (no editable) con traducción */}
        <div>
          <Label htmlFor="position" value="Cargo" />
          <TextInput 
            type='text' 
            id='position' 
            defaultValue={translatePosition(currentUser.position)} 
            readOnly
            className='bg-gray-100 cursor-not-allowed'
          />
        </div>

        <Button 
          type='submit' 
          gradientDuoTone='greenToBlue' 
          outline
          disabled={isUploading || !emailValid}
          className="mt-4"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : 'Actualizar perfil'}
        </Button>
      </form>
    </div>
  );
}