import axios from 'axios';
import React, { useContext,useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { toast } from 'react-toastify';

function MyOrders() {
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { adminToken} = useContext(AdminContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/admin/allorders`,{headers:{aToken: adminToken}});
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      setError("Failed to load orders");
      console.error('Failed:', error);
    }
    setLoading(false);
  };

  const handleStatus = async (status, orderId) => {
    try {
      const response = await axios.put(`${backendURL}/admin/orderstatus/${orderId}`, { status },{headers:{aToken: adminToken}});
      if (response.data.success) {
        fetchOrders(); // Refresh orders
      } else {
        setError("Failed to update order status");
      }
    } catch (error) {
      setError("Failed to update order status");
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="pt-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold text-blue-900 mb-6 underline">All Orders</h1>

      {loading && <p className="text-gray-700">Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-6">
        {orders.length === 0 && !loading ? (
          <p>No orders found.</p>
        ) : (
          [...orders].reverse().map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-md p-4 sm:p-6 relative"
            >
              <div className='flex'>
              <div className="text-sm sm:text-base  inline-block">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Quantity:</strong> {order.quantity}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
                <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              {/* Status Buttons */}
              <div className=" ml-auto flex flex-col gap-2 ">
                {!order.status ? (
                  <>
                    <button
                      onClick={() => handleStatus('confirmed', order._id)}
                      className="border border-black px-3 py-1 rounded hover:bg-green-500 hover:text-white"
                    >
                      Confirm?
                    </button>
                    <button
                      onClick={() => handleStatus('cancelled', order._id)}
                      className="border border-black px-3 py-1 rounded hover:bg-red-500 hover:text-white"
                    >
                      Cancel?
                    </button>
                    <button
                      onClick={() => handleStatus('completed', order._id)}
                      className="border border-black px-3 py-1 rounded hover:bg-blue-800 hover:text-white"
                    >
                      Completed?
                    </button>
                  </>
                ) : (
                  <>
                    {order.status === 'confirmed' && (
                      <>
                        <span className="border border-black px-3 py-1 rounded text-center bg-yellow-100 cursor-default">
                          Pending
                        </span>
                        <button
                          onClick={() => handleStatus('completed', order._id)}
                          className="border border-black px-3 py-1 rounded hover:bg-blue-800 hover:text-white"
                        >
                          Completed?
                        </button>
                      </>
                    )}
                    {order.status === 'completed' && (
                      <span className="border border-black px-3 py-1 rounded bg-green-100 cursor-default">
                        Shipped ✅
                      </span>
                    )}
                    {order.status === 'cancelled' && (
                      <span className="border border-black px-3 py-1 rounded bg-red-100 cursor-default">
                        Cancelled ❌
                      </span>
                    )}
                  </>
                )}
              </div>
           </div>
              {/* Patti Info */}
              <div className="mt-4 bg-gray-50 p-4 rounded text-sm sm:text-base">
                {order.pattid ? (
                  <>
                    <p><strong>Name:</strong> {order.pattid.name}</p>
                    <p><strong>Size:</strong> {order.pattid.size}</p>
                    <p><strong>Rate:</strong> {order.pattid.rate}</p>
                    <p><strong>Patti ID:</strong> {order.pattid._id}</p>
                    <p><strong>Available Quantity:</strong> {order.pattid.quantity}</p>
                    {order.pattid.image && (
                      <img
                        src={order.pattid.image}
                        alt={order.pattid.name}
                        className="mt-2 w-28 h-auto rounded border"
                      />
                    )}
                  </>
                ) : (
                  <p className="text-red-600 font-medium">Patti info missing</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrders;
