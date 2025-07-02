
import axios from 'axios';
import React, { useEffect, useState } from 'react';


function MyOrders() {  
  
  const backendURL = 'http://localhost:3000';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
              <div>
                <strong>Order ID:</strong> {order._id}<br/>
                <strong>Quantity:</strong> {order.quantity}<br/>
                <strong>Phone:</strong> {order.phone}<br/>
                <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}<br/>
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