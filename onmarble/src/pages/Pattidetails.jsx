
import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from "@clerk/clerk-react";
import { SignIn } from "@clerk/clerk-react";
import axios from 'axios';
import {toast} from 'react-toastify'
 import { useUser } from '@clerk/clerk-react';
 import { useNavigate } from 'react-router-dom'

function Pattidetails() {
    const [additionalPatti, setAdditionalPatti] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [quantityreq, setQuantityreq] = useState('');
    const { getToken } = useAuth();
    const [selectedpatti, setSelectedpatti] = useState()
      const backendURL = 'http://localhost:3000';
     const [adding, setAdding] = useState(false);
    const {_id}= useParams();
    
     const { user, isLoaded } = useUser();

const handleorder = async () => {
  try {
    const token = await getToken();
   
    const response = await axios.post(
      `${backendURL}/order`,
      {
        pattid: _id,
        quantity: quantityreq,
        userid:  user.id,
        phone: user.primaryPhoneNumber?.phoneNumber
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Handle successful response here
    console.log(response.data);
    if(response.data.success){
      toast.success('Order Placed Successfully')
      navigate( `/MyOrders/${user.id}` );
    }
  } catch (error) {
    // Handle error here
    console.error('Order failed:', error);
  }
};

    const fetchselected = async () => {
       const token = await getToken();
      try { 
        console.log("selected lara")
        const { data } = await axios.get(`${backendURL}/selectedpatti/${_id}`,{
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

        if (data.success) {
          setSelectedpatti(data.selectedpatti);
        } else {
          toast.error(data.message);
        }
      } catch (error) {

         if (error.response?.status === 401) {
        console.warn("User is unauthenticated, redirecting...");
        // Clerk modal
          setShowModal(true);
       // if using modal
        console.log("fetchwala")
        
        // Or redirect:
        // window.location.href = "/sign-in";
      } else {
         toast.error("Error fetching inventory.");
        console.error(error);
      }

       
      }
    }

    const fetchadditional = async () => {
        const { data } = await axios.get(`${backendURL}/additionalinfo/${_id}`);

        if (data.success) {
        console.log("additional data fetched", data);
         setAdditionalPatti(data.additionalPatti);

        } else {
          toast.error(data.message);
        }
    }

useEffect(() => {
    console.log("useeffect called")
    fetchselected();
    fetchadditional();
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
      <input onChange={(e)=> setQuantityreq(e.target.value)} value={quantityreq} className='px-2 border border-black rounded-md mt-2 mb-3' type="text" placeholder='eg: 20' />
      <br />
      <button onClick={handleorder} className='bg-green-600 text-white text-2xl px-4 mt-3 rounded-md py-1 mb-2'> Order </button>
      <br />
      <p className='text-blue-800 mt-2'>You will recieve a call for order and price confirmation.</p>
  </div>
</div>:'' }
         </div>
    ) : (
      <p className="text-center mt-10 text-blue-900">Loading...</p>
    )}
       {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-xl">
          <SignIn />
        </div>
      </div>
    )}

     <div className="p-4">
      
      
       {additionalPatti && (
        
  <div key={additionalPatti._id} className="border p-4 rounded-lg shadow mb-6">
     <h2 className="text-xl font-bold mb-4">More Information:</h2>
    <p><strong>Patti ID:</strong> {additionalPatti.pattid}</p>
    <p><strong>Info:</strong> {additionalPatti.additionalInfo}</p>

    <div className="mt-6 flex flex-wrap  justify-center gap-4">
      {additionalPatti.images?.map((img, idx) => (
            <img key={idx} src={img}  className="gap-8 h-56 w-56 object-cover rounded-md" alt="" />
          ))}
    </div>
  </div>
)}

    </div>
  </div>
);
}

export default Pattidetails
