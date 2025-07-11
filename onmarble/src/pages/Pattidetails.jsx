import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser, SignIn } from "@clerk/clerk-react";
import axios from 'axios';
import { toast } from 'react-toastify';

function Pattidetails() {
  const { _id } = useParams();
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const [selectedpatti, setSelectedpatti] = useState();
  const [additionalPatti, setAdditionalPatti] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [quantityreq, setQuantityreq] = useState('');
  const [adding, setAdding] = useState(false);
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleorder = async () => {
    try {
      const token = await getToken();
      const response = await axios.post(
        `${backendURL}/order`,
        {
          pattid: _id,
          quantity: quantityreq,
          userid: user.id,
          phone: user.primaryPhoneNumber?.phoneNumber
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('Order Placed Successfully');
        navigate(`/MyOrders/${user.id}`);
      }
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  const fetchselected = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendURL}/selectedpatti/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setSelectedpatti(data.selectedpatti);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setShowModal(true);
      } else {
        toast.error("Error fetching patti.");
        console.error(error);
      }
    }
  };

  const fetchadditional = async () => {
    const { data } = await axios.get(`${backendURL}/additionalinfo/${_id}`);
    if (data.success) {
      setAdditionalPatti(data.additionalPatti);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    fetchselected();
    fetchadditional();
  }, []);

  return (
    <div className="px-4 py-10 pt-16 max-w-4xl mx-auto">
      {selectedpatti ? (
        <div className='text-center'>
         <img
  className='w-80 sm:w-96 md:w-[400px] h-64 sm:h-72 md:h-80 object-contain mx-auto rounded-3xl shadow-md bg-white'
  src={selectedpatti.image}
  alt=""
/>


          <p className='text-2xl text-blue-900 mt-4'>{selectedpatti.name}</p>
          <p className='text-blue-900'>Size: {selectedpatti.size}</p>
          <p className='text-blue-900'>Rate: {selectedpatti.rate}</p>
          <p className='text-blue-900'>Quantity: {selectedpatti.quantity}</p>

          <button
            onClick={() => setAdding(true)}
            className='py-3 px-10 mt-6 bg-green-600 text-white text-xl rounded-lg hover:bg-green-700 transition'
          >
            + Order
          </button>

          {/* Modal */}
          {adding && (
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white w-[90%] max-w-xs rounded-xl p-6 shadow-2xl text-center relative'>
                <span onClick={()=>setAdding(!adding)}  className='absolute top-2 right-5 text-gray-600 text-xl hover:cursor-pointer '>x</span>
                <p className="mb-2 text-blue-900 font-medium">Quantity:</p>
                <input
                  onChange={(e) => setQuantityreq(e.target.value)}
                  value={quantityreq}
                  className='w-full px-3 py-2 border border-black rounded-md mb-4'
                  type="text"
                  placeholder='e.g., 20'
                />
                <button
                  onClick={handleorder}
                  className='bg-green-600 w-full text-white text-lg px-4 py-2 rounded-md hover:bg-green-700'
                >
                  Add Order
                </button>
                <p className='text-blue-800 mt-4 text-sm'>
                  You will receive a call for order and price confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-blue-900">Loading...</p>
      )}

      {/* Clerk Sign-In Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl">
            <SignIn />
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      {additionalPatti && (
        <div className="mt-10 border p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-blue-900 mb-4">More Information:</h2>
          <p><strong>Patti ID:</strong> {additionalPatti.pattid}</p>
          <p><strong>Info:</strong></p>
 <pre className='ml-10 text-left ' >{additionalPatti.additionalInfo?.split('\n').map((line, idx) => {
    const [key, ...rest] = line.split(':');
    if (!rest.length) return <span key={idx}>{line}<br /></span>; // no colon, print as-is
    return (
      <span key={idx}>
        <strong>{key.trim()}:</strong> {rest.join(':').trim()}<br />
      </span>
    );
  })}</pre>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {additionalPatti.images?.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="h-44 w-44 sm:h-56 sm:w-56 object-cover rounded-md shadow"
                alt=""
              />
            ))}
          </div>
        </div>
      )
 
      }
    </div>
  );
}

export default Pattidetails;
