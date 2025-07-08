
import axios from 'axios';
import React, { useEffect, useState } from 'react';


function MyOrders() {  
  
  const backendURL = 'http://localhost:3000';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(''); // Added status state

  useEffect(() => {
    if (1) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
   
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/admin/allorders`);

      if(response.data.success){
        setOrders(response.data.orders);
      }
    } catch (error) {
      setError("Failed to load orders");
      console.error('failed:', error);   
    }
    setLoading(false);
  };

  const handleStatus = async (status,orderId) => {
   
    try {
      const response = await axios.put(`${backendURL}/admin/orderstatus/${orderId}`, { status });
      if (response.data.success) {
        fetchOrders(); // Refresh orders after updating status
       

      } else {
        setError("Failed to update order status");
      }
    } catch (error) {
      setError("Failed to update order status");
      console.error('Update failed:', error);
    }
  }

  return (
    <div className='pt-10'>
      <p className='text-3xl text-blue-900 mx-2 my-3 underline'> All Orders - </p>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {orders.length === 0 && !loading ? (
          <li>No orders found.</li>
        ) : (
          [...orders].reverse().map(order => (
            <li key={order._id} style={{ marginBottom: '2em', border: '1px solid #ccc', padding: '1em', borderRadius: '6px' }}>
              <div className='relative'>
                <strong>Order ID:</strong> {order._id}<br/>
                <strong>Quantity:</strong> {order.quantity}<br/>
                <strong>Phone:</strong> {order.phone}<br/>
                <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}<br/>
                {!order.status ? (
                   <div className='absolute top-2 flex flex-col right-5 gap-2 '>
                 <button onClick={()=>handleStatus('confirmed',order._id)} className=' text-black border border-black h-8 w-28  hover:bg-green-500 hover:text-white '>Confirm ?</button>
                 <button onClick={()=>handleStatus('cancelled',order._id)} className=' text-black border border-black h-8 w-28  hover:bg-red-500 hover:text-white '>Cancel ?</button>
                 <button onClick={()=>handleStatus('completed',order._id)} className=' text-black border border-black h-8 w-28  hover:bg-blue-800 hover:text-white '>Completed ?</button>
                </div>
                ):
                <div className='absolute top-2 flex flex-col right-5 gap-2 '>
                  {order.status === 'confirmed' && <div className=' flex flex-col gap-2 '> 
                    <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Pending</button>
                      <button onClick={()=>handleStatus('completed',order._id)} className=' text-black border border-black h-8 w-28  hover:bg-blue-800 hover:text-white '>Completed ?</button>
                  </div>}  
                  {order.status === 'completed' && <div className=' flex flex-col gap-2 '> 
                    <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Shipped ✅</button>
                   </div>} 
                    {order.status === 'cancelled' && <div className=' flex flex-col gap-2 '> 
                    <button className=' text-black border border-black h-8 w-28  hover: cursor-default'>Cancelled ❌</button>
                   </div>} 
                 </div>
                 
                }
                

              </div>
              {order.pattid ? (
                <div style={{marginTop: '1em', background:'#f9f9f9', padding: '1em', borderRadius: '4px'}}>
                  <strong>Patti Info:</strong><br/>
                  <strong>Name:</strong> {order.pattid.name}<br/>
                  <strong>Size:</strong> {order.pattid.size}<br/>
                  <strong>Rate:</strong> {order.pattid.rate}<br/>
                  <strong>Patti Id:</strong> {order.pattid._id}<br/>
                  <strong>Available Quantity:</strong> {order.pattid.quantity}<br/>
                  {order.pattid.image && (
                    <img src={order.pattid.image} alt={order.pattid.name} width={100} style={{marginTop: '0.5em'}} />
                  )}
                 
                </div>
              ) : (
                <div style={{color:'red'}}>Patti info missing</div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default MyOrders;