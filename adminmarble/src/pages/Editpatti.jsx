
import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify'

function Pattidetails() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [image, setImage] = useState(false);

  const [selectedpatti, setSelectedpatti] = useState()
  const backendURL = 'http://localhost:3000';
  const [isedit, setIsedit] = useState(false);
  const { _id } = useParams();
  console.log(_id);


  async function onSubmitHandler(event) {
    event.preventDefault();

    try {
       const formData = new FormData();
    
       

        formData.append('name', name)
        formData.append('size', size)
        formData.append('quantity', Number(quantity))
        formData.append('rate', rate)
        if(image){
          formData.append('image', image)
        }
        formData.forEach((value, key) => {
          console.log(`${key}:${value}`)
        });
        console.log("updating")
        const { data } = await axios.post(backendURL + `/admin/editpatti/${_id}`, formData)
        if (data.success) {
          console.log("hanji ho gaya edit")
          toast.success(data.message)
          setImage(false)
          setName('')
          setSize('')
          setQuantity('')
          setRate('')
          navigate('/Inventory')
        } else {
          toast.error(data.message || "Something went wrong")
        
      }
    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response.data.message)

    }

  }

  const fetchselected = async () => {
    try {
      console.log("selected lara")
      const { data } = await axios.get(`${backendURL}/selectedpatti/${_id}`);

      if (data.success) {
        setSelectedpatti(data.selectedpatti);
        setName(data.selectedpatti.name);
        setSize(data.selectedpatti.size);
        setQuantity(data.selectedpatti.quantity);
        setRate(data.selectedpatti.rate)

      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error fetching inventory.");
      console.error(error);
    }
  }

  useEffect(() => {
    console.log("useeffect called")
    fetchselected();
  }, []);


  console.log(selectedpatti);
  return (
    <div>
      {selectedpatti ? (
        <div className='w-96 text-center mx-auto my-14'>
          <form onSubmit={onSubmitHandler} action="">
            <label htmlFor="photoyaha">            <img
              className='w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl'
              src={ image? URL.createObjectURL(image):  selectedpatti.image}
              alt=""
            />
            </label>
           <input type="file" id='photoyaha' hidden onChange={ (e)=> setImage(e.target.files[0])} />
            <p className={`text-2xl text-blue-900 text-center  ${isedit ? 'hidden' : ''}`}>
              {selectedpatti.name}
            </p>
            <input onChange={(e) => setName(e.target.value)} className={`border border-black   text-2xl text-blue-900 text-center block mx-auto ${isedit ? '' : 'hidden'}`} type="text" name="" id="" value={name} />

            <p className={`text-blue-900 text-center ${isedit ? 'hidden' : ''}`}>Size : {selectedpatti.size}</p>
            <input onChange={(e) => setSize(e.target.value)} className={`border border-black mt-3  text-blue-900 text-center mx-auto block ${isedit ? '' : 'hidden'}`} type="text" name="Size" id="" value={size} />
            <p className={`text-blue-900 text-center ${isedit ? 'hidden' : ''}`}>Rate : {selectedpatti.rate}</p>
            <input onChange={(e) => setRate(e.target.value)} className={`border border-black mt-3  text-blue-900 text-center mx-auto block ${isedit ? '' : 'hidden'}`} type="text" name="" id="" value={rate} />

            <p className={`text-blue-900 text-center  ${isedit ? 'hidden' : ''}`}>Quantity : {selectedpatti.quantity}</p>
            <input onChange={(e) => setQuantity(e.target.value)} className={` border border-black mt-3 text-blue-900 text-center block mx-auto ${isedit ? '' : 'hidden'}`} type="text" name="" id="" value={quantity} />

            <button  type="button" onClick={() => setIsedit(!isedit)} className={` py-3 my-4 px-24 mx-auto bg-blue-900 text-xl text-white  ${isedit ? 'hidden' : ''}`}>
              Edit
            </button>
            <button type='submit' className={`py-3 my-4 px-24 mx-auto bg-blue-900 text-xl text-white  ${isedit ? '' : 'hidden'}`}>
              Save
            </button>
          </form>
        </div>
      ) : (
        <p className="text-center mt-10 text-blue-900">Loading...</p>
      )}

    </div>
  );


}

export default Pattidetails
