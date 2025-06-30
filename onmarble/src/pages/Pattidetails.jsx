
import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import axios from 'axios';
import {toast} from 'react-toastify'

function Pattidetails() {
    const [selectedpatti, setSelectedpatti] = useState()
      const backendURL = 'http://localhost:3000';
     const [adding, setAdding] = useState(false);
    const {_id}= useParams();
    console.log(_id);

    const fetchselected = async () => {
      try {
        console.log("selected lara")
        const { data } = await axios.get(`${backendURL}/selectedpatti/${_id}`);

        if (data.success) {
          setSelectedpatti(data.selectedpatti);
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
        <img
          className='w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl'
          src={selectedpatti.image}
          alt=""
        />
        <p className='text-2xl text-blue-900 text-center'>
          {selectedpatti.name}
        </p>
        <p className='text-blue-900 text-center'>Size : {selectedpatti.size}</p>
        <p className='text-blue-900 text-center'>Rate : {selectedpatti.rate}</p>
         <p className='text-blue-900 text-center'>Quantity : {selectedpatti.quantity}</p>
        <button onClick={()=> setAdding(true)} className='py-3 my-4 px-24 mx-auto bg-green-600 text-xl text-white'>
           + Order
        </button>
        { adding?
                <div className=' fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
  <div className='bg-white w-[50vw] max-w-64 rounded-xl p-4 shadow-2xl text-center'>
      Quantity:
      <input className='px-2 border border-black rounded-md mt-2 mb-3' type="text" placeholder='eg: 20' />
      <br />
      <button className='bg-green-500 text-white text-2xl px-4 mt-3 rounded-md py-1 mb-2'> Order </button>
      <br />
      <p className='text-blue-800 mt-2'>You will recieve a call for order and price confirmation.</p>
  </div>
</div>:'' }
         </div>
    ) : (
      <p className="text-center mt-10 text-blue-900">Loading...</p>
    )}
  </div>
);

  
}

export default Pattidetails
