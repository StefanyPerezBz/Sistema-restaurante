import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, logOutSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ManagerProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUplordingProcess, setImageFileUplordingProcess] = useState(null);
  const [imageFileUplordError, setImageFileUplordError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();

  console.log(imageFileUplordError, imageFileUplordingProcess);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));

    }

  };
  useEffect(() => {
    if (imageFile) {
      uplodeImage();
    }
  }, [imageFile]);

  const uplodeImage = async () => {

    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read; 
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true);
    setImageFileUplordError(null);
    console.log('uploading image');
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name; // crate uniqe file name
    const storageRef = ref(storage, fileName);
    const uplordTask = uploadBytesResumable(storageRef, imageFile);
    uplordTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUplordingProcess(progress.toFixed(0)
        );
      },
      (error) => {
        setImageFileUplordError("Error al cargar la imagen (el tamaño del archivo debe ser inferior a 2 MB)"
        );
        setImageFileUplordingProcess(null);
        setImageFile(null);
        setImageFileURL(null);
        setImageFileUploading(false);


      },
      () => {
        getDownloadURL(uplordTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);

        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    


    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Por favor espere mientras se carga la imagen');
      return;
    }
    try {
      dispatch(updateStart());
      console.log(currentUser.id)
      console.log(formData);
      const response = await axios.put(`http://localhost:8080/api/employees/update/${currentUser.id}`, formData);

      console.log(response);
      const data = response.data;
      if (response.status !== 200) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess('Perfil actualizado exitosamente');
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }

  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogOut = async () => {

    try {
      dispatch(logOutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  }



  console.log(formData);
  return (

    <div className=' p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Perfil</h1>
      <form onSubmit={handleSubmit} className=' w-3/5 mx-auto'>
        <div className='flex flex-row gap-5'>
          <div className='flex flex-col gap-5  basis-1/2'>
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>

              {imageFileUplordingProcess > 0 && (

                <CircularProgressbar value={imageFileUplordingProcess || 0}
                  text={`${imageFileUplordingProcess}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${imageFileUplordingProcess / 100})`,
                    },
                  }} />

              )}
              {/* add the profile pic path */}
              <img src={imageFileURL || currentUser.profilePicture} alt='user' defaultValue={currentUser.profilePicture} className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUplordingProcess &&
                imageFileUplordingProcess < 100 &&
                'opacity-60'
                }`} />
            </div>
            {/* // profile image uplord error alert  */}
            {imageFileUplordError && (
              <Alert color='failure'>
                {imageFileUplordError}
              </Alert>
            )
            }

            <TextInput type='text' id='first_name' placeholder='First Name' defaultValue={currentUser.first_name} onChange={handleChange} />
            <TextInput type='text' id='last_name' placeholder='Last Name' defaultValue={currentUser.last_name} onChange={handleChange} />
            <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />
            <TextInput type={showPassword ? 'text' : 'password'} id='password' placeholder='password' defaultValue={currentUser.password} onChange={handleChange} />

            {/* Button to toggle password visibility */}
            <div className='flex justify-between'>
              <span></span>
              <Link
                type='button'
                onClick={togglePasswordVisibility}>
                {showPassword ? 'Hide Password' : 'Show Password'}
              </Link>
            </div>

          </div>
          <div className='flex flex-col gap-5 basis-1/2 mt-36'>
            <TextInput type='text' id='contact_number' placeholder='Número de contacto' defaultValue={currentUser.contact_number} onChange={handleChange} />
            <TextInput type='text' id='address' placeholder='Dirección' defaultValue={currentUser.address} onChange={handleChange} />
            <TextInput type='text' id='idNumber' placeholder='Número de DNI' defaultValue={currentUser.idNumber} onChange={handleChange} />
            <TextInput type='text' id='uniform_size' placeholder='Talla de uniforme' defaultValue={currentUser.uniform_size} onChange={handleChange} />
            <TextInput type='text' id='emergency_contact' placeholder='Número de contacto de emergencia' defaultValue={currentUser.emergency_contact} onChange={handleChange} />
          </div>

        </div>
        <div className='mt-5'>
          <Button className='w-full' type='submit' gradientDuoTone='greenToBlue' outline >Actualizar</Button>
          <div className='text-red-500 flex justify-between mt-5'>
            <span></span>
            <span onClick={handleLogOut} className='cursor-pointer'> Salir</span>
          </div>
        </div>
      </form>




      {/* user update success alert  */}
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}

      {/* update user error alert */}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
    </div>
  );
}
