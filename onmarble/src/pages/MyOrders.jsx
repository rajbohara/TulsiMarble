import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

function MyOrders() {  
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const backendURL = 'http://localhost:3000';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders();
    }
  }, [isLoaded, user]);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const token = await getToken();
    try {
      const response = await axios.get(`${backendURL}/myorders`, {
        params: { userid: user.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.data.success){
        setOrders(response.data.orders);
      }
    } catch (error) {
      setError("Failed to load orders");
      console.error('failed:', error);   
    }
    setLoading(false);
  };

  return (
    <div>
      <p className='text-3xl text-blue-900 mx-2 my-3 underline'> All Orders - </p>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {orders.length === 0 && !loading ? (
          <li>No orders found.</li>
        ) : (
          [...orders].reverse().map(order => (
            <li className="relative" key={order._id} style={{ marginBottom: '2em', border: '1px solid #ccc', padding: '1em', borderRadius: '6px' }}>
              <div>
                
                <strong>Quantity:</strong> {order.quantity}<br/>
               
                <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}<br/>
              </div>
              {order.pattid ? (
                <div style={{marginTop: '1em', background:'#f9f9f9', padding: '1em', borderRadius: '4px'}}>
                  <strong>Patti Info:</strong><br/>
                  <strong className="ml-2">Name:</strong> {order.pattid.name}<br/>
                  <strong className="ml-2">Size:</strong> {order.pattid.size}<br/>
                  <strong className="ml-2">Rate:</strong> {order.pattid.rate}<br/>
                  <strong className="ml-2">Patti Id:</strong> {order.pattid._id}<br/>
                 <div className="ml-2">
                  {order.pattid.image && (
                    <img src={order.pattid.image} alt={order.pattid.name} width={100} style={{marginTop: '0.5em'}} />
                  )}
                  </div>
                </div>
              ) : (
                <div style={{color:'red'}}>Patti info missing</div>
              )}
              {!order.status ? (
                   <div className='absolute top-2 flex flex-col right-5 gap-2 '>
                 <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Requested</button>
                </div>
                ):
                <div className='absolute top-2 flex flex-col right-5 gap-2 '>
                  {order.status === 'confirmed' && <div className=' flex flex-col gap-2 '> 
                    <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Confirmed</button>
                          </div>}  
                  {order.status === 'completed' && <div className=' flex flex-col gap-2 '> 
                    <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Shipped ✅</button>
                   </div>} 
                    {order.status === 'cancelled' && <div className=' flex flex-col gap-2 '> 
                    <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Cancelled ❌</button>
                   </div>} 
                 </div>
                 
                }
            </li>
            

          ))
        )}
      </ul>
    </div>
  );
}

export default MyOrders;