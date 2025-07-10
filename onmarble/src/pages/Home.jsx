import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Home() {
  const navigate = useNavigate();
  const [patti, setPatti] = useState([]);
  const backendURL = 'http://localhost:3000';
  const [type, setType] = useState('Decorations');

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get(`${backendURL}/admin/inventory`);
      if (data.success) {
        setPatti(data.patti);
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

  // Group by category
  const grouped = patti.reduce((acc, item) => {
    if (item.type !== type) return acc;
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Icon Row */}
      <div className='bg-blue-50 h-30 flex items-center py-10 pt-20  gap-40 justify-center'>
        {[
          { src: "/welcomeicon.png", label: "Decorations" },
          { src: "/moreicon.png", label: "Marble" }
        ].map(({ src, label }) => (
          <div onClick={()=>{ setType(label); console.log(label)}}  className={`h-32 hover:cursor-pointer hover:border ${
    type === label ? 'shadow-lg border' : 'shadow-sm'
  }`} key={label}>
            <img className='h-24' src={src} alt={label} />
            <p className='text-center font-medium text-blue-950 py-1'>{label}</p>
          </div>
        ))}
      </div>

      

      {/* Category-wise Grouped Section */}
      <div className="mt-10 px-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-blue-900 underline">{category}</h2>
              <button
                onClick={() => navigate(`/category/${category}`)}
                className="text-sm text-blue-700 hover:underline"
              >
                See All
              </button>
            </div>
            <div className="flex flex-wrap gap-6 justify-start">
              {items.slice(0, 4).map(item => (
                <div key={item._id} onClick={() => navigate(`/${item._id}`)} className='max-w-60 min-w-40 shadow-sm hover:shadow-lg cursor-pointer'>
                  <img className='w-full h-40 object-cover rounded-xl' src={item.image} alt="" />
                  <p className='text-lg text-blue-900 text-center'>{item.name}</p>
                  <p className='text-blue-900 text-center text-sm'>Size: {item.size}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
