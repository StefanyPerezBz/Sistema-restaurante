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


export default function CashierProfile() {
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
    console.log('subiendo imagen');
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
        setImageFileUplordError("No se pudo cargar la imagen (El tamaño del archivo debe ser inferior a 2 MB)"
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
      setUpdateUserError('No se realizaron cambios');
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

    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
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

        < TextInput type='text' id='first_name' placeholder='Nombres' defaultValue={currentUser.first_name} onChange={handleChange} />
        <TextInput type='text' id='last_name' placeholder='Apellidos' defaultValue={currentUser.last_name} onChange={handleChange} />
        <TextInput type='email' id='email' placeholder='Correo electrónico' defaultValue={currentUser.email} onChange={handleChange} />
        <TextInput type={showPassword ? 'text' : 'password'} id='password' placeholder='Contraseña' defaultValue={currentUser.password} onChange={handleChange} />

        {/* Button to toggle password visibility */}
        <div className='flex justify-between'>
          <span></span>
          <Link
            type='button'
            onClick={togglePasswordVisibility}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </Link>
        </div>
        <Button type='submit' gradientDuoTone='greenToBlue' outline >Actualizar</Button>
      </form>


      <div className='text-red-500 flex justify-between mt-5'>
        <span></span>
        <span onClick={handleLogOut} className='cursor-pointer'> Salir</span>
      </div>

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
