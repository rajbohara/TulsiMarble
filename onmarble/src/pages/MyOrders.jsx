import { useAuth } from "@clerk/clerk-react";
import axios from 'axios';
import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

function MyOrders() {  
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const backendURL = 'http://localhost:3000';
  const [orders, setOrders] = React.useState([]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchOrders();
    }
  }, [isLoaded, user]);

  const fetchOrders = async () => {
    if (!user) return; // safeguard
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
      console.error('failed:', error);   
    }
  };

useEffect(() => {
      if (orders.length > 0) {
    console.log(orders);
  }
}, [orders]);

  return (
    <div>
      <p className='text-3xl text-blue-900 mx-2 my-3 underline'> All Orders - </p>
       <ul>
      {orders.map(order => (
        <li key={order._id}>
          Order {order._id}-{order.quantity}
        </li>
      ))}
    </ul>
    </div>
  );
}

export default MyOrders;