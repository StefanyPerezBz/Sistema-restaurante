

import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { FileInput } from "flowbite-react";
import { set } from "firebase/database";

function EditFoodItem({ foodId, onSubmit, onCancel }) {
    const [openModal, setOpenModal] = useState(true);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [file, setFile] = useState(null);



    useEffect(() => {

        // Fetch item details by foodId
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/food/get/${foodId}`);
                const { foodName, foodPrice, foodImageURL } = response.data;
                setName(foodName);
                setPrice(foodPrice);
                setImageUrl(foodImageURL);
                console.log('comida Detalles del artículo:', response.data);
            } catch (error) {
                console.error('Error al obtener los detalles del artículo:', error);
            }
        };

        fetchItemDetails();
    }, [foodId]);



    const handleUpdateItem = async () => {
        if (file) {
            handleImageUpload();
        }

        const updatedItem = {
            foodName: name,
            foodPrice: price,
            foodImageURL: imageUrl
        };


        //update foodItemDetails
        try {
            const responce = await axios.put(`http://localhost:8080/api/food/edit/${foodId}`, updatedItem);
            console.log(responce);

            
            onSubmit(); // Reload items after editing

        } catch (error) {
            console.error('Error al actualizar el elemento:', error);
        }

    };

    const handleImageUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`http://localhost:8080/api/food/upload-image/${foodId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setImageUrl(response.data);
            console.log('Imagen cargada:', response.data);

        } catch (error) {
            console.error('Error al actualizar el elemento:', error);
        }
    }

    const handleImageChange = async (e) => {
        setFile(e.target.files[0]);
    }






    return (
        <>
            {/* <Button onClick={() => setOpenModal(true)}>Toggle modal</Button> */}
            <Modal show={openModal} size="md" onClose={onCancel} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <Label className="text-xl font-medium text-gray-900 dark:text-white" htmlFor="quantity" value={"Edit Food Item(" + name + ")"} />
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="foodName" value={"Name"} />
                            </div>
                            <TextInput
                                id="foodName"
                                value={name}
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="price" value="Price (Rs.)" />
                            </div>
                            <TextInput
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="image" value="Change Image" />
                            </div>
                            {imageUrl && (
                                <img src={`http://localhost:8080/api/food/image/${imageUrl}`} alt="Food Image" style={{ width: '100px' }} />
                            )}
                            <FileInput id="file" helperText=" A Food Image"  accept=".png, .jpeg, jpg" onChange={handleImageChange}/>
   
                        </div>


                        <div className="w-full">
                            <Button onClick={handleUpdateItem} color='success' className="bg bg-green-400">Update</Button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default EditFoodItem;
