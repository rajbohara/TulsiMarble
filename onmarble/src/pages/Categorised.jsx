import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';


function Categorised() {
    const { category } = useParams(); // assuming your route is like "/category/:category"

  const navigate = useNavigate();
  const [patti, setPatti] = useState([]);
  const backendURL = 'http://localhost:3000';
  const [type, setType] = useState('Decorations');

const fetchInventory = async () => {
  try {
    const { data } = await axios.get(`${backendURL}/admin/inventory`);
    if (data.success) {
      const filtered = data.patti.filter((item) => item.category === category);
      setPatti(filtered);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error("Error fetching inventory.");
    console.error(error);
  }
};


  useEffect(() => {
    fetchInventory();
  }, []);

  

  return (
    <>
     
      {/* Category-wise Grouped Section */}
      <div className="mt-10 px-10 pt-12">
        
         
            <h1 className='text-3xl my-3 text-blue-900 underline mb-8'>{category}</h1>
            <div className="flex flex-wrap gap-6 justify-start">
              {patti.map(item => (
                <div key={item._id} onClick={() => navigate(`/${item._id}`)} className='max-w-60 min-w-40 shadow-sm hover:shadow-lg cursor-pointer'>
                  <img className='w-full h-40 object-cover rounded-xl' src={item.image} alt="" />
                  <p className='text-lg text-blue-900 text-center'>{item.name}</p>
                  <p className='text-blue-900 text-center text-sm'>Size: {item.size}</p>
                </div>
              ))}
            </div>
          
    
      </div>
    </>
  );
}

export default Categorised
