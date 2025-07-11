import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Home() {
  const navigate = useNavigate();
  const [patti, setPatti] = useState([]);
  const backendURL = process.env.REACT_APP_BACKEND_URL;
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
      <div className='bg-blue-50 flex flex-wrap justify-center items-center gap-10 py-10 pt-20'>
        {[
          { src: "/welcomeicon.png", label: "Decorations" },
          { src: "/moreicon.png", label: "Marble" }
        ].map(({ src, label }) => (
          <div
            key={label}
            onClick={() => { setType(label); }}
            className={`w-32 h-40 flex flex-col items-center justify-center p-3 rounded-lg hover:cursor-pointer transition-all duration-200 ${
              type === label ? 'shadow-lg border border-blue-500' : 'shadow-sm'
            }`}
          >
            <img className='h-20 w-20 object-contain' src={src} alt={label} />
            <p className='text-center font-medium text-blue-950 mt-2'>{label}</p>
          </div>
        ))}
      </div>

      {/* Grouped Sections */}
      <div className="mt-10 px-4 md:px-10">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-10">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl md:text-2xl font-bold text-blue-900 underline">{category}</h2>
              <button
                onClick={() => navigate(`/category/${category}`)}
                className="text-sm text-blue-700 hover:underline"
              >
                See All
              </button>
            </div>

            {/* Scrollable item row */}
            <div className='overflow-x-auto scroll-hide'>
              <div className="flex gap-4 sm:gap-6 w-max px-2 md:px-0 snap-x snap-mandatory">
                {items.slice(0, 10).map(item => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/${item._id}`)}
                    className='min-w-[180px] sm:min-w-[200px] max-w-xs snap-start shadow-sm hover:shadow-lg cursor-pointer rounded-xl bg-white p-2'
                  >
                    <img
                      className='w-full h-40 object-cover rounded-lg mb-2'
                      src={item.image}
                      alt=""
                    />
                    <p className='text-base sm:text-lg text-blue-900 text-center font-medium'>{item.name}</p>
                    <p className='text-blue-900 text-center text-sm'>Size: {item.size}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Home;
