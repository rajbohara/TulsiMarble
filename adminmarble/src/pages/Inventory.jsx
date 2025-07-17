import React, {  useContext,useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';

function Inventory() {
  const { adminToken} = useContext(AdminContext)
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [image, setImage] = useState(false);
  const [category, setCategory] = useState('');
  const [patti, setPatti] = useState([]);
  const [type, setType] = useState('Marble');
  const [expandedCategories, setExpandedCategories] = useState({});
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const categoryOptionsByType = {
    Marble: ['Pink', 'Green', 'White', 'P-White', 'S-White', 'Multi-Color'],
    Decorations: ['Rangoli', 'Welcome', 'Border Strips', 'Single-Color', 'Tilak', 'Design Patti'],
  };

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

  async function onSubmitHandler(event) {
    event.preventDefault();
    try {
      if (!image) {
        toast.error('No Image selected');
      } else {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('name', name);
        formData.append('size', size);
        formData.append('quantity', Number(quantity));
        formData.append('rate', rate);
        formData.append('category', category);
        formData.append('type', type);

        const { data } = await axios.post(backendURL + '/admin/addpatti', formData,{headers:{aToken: adminToken}});
        if (data.success) {
          toast.success(data.message);
          setImage(false);
          setName('');
          setSize('');
          setQuantity('');
          setRate('');
          fetchInventory();
        } else {
          toast.error(data.message || "Something went wrong");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error occurred");
    }
  }

  // Group items by type & category
  const grouped = patti.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = {};
    const cat = item.category || 'Uncategorized';
    if (!acc[item.type][cat]) acc[item.type][cat] = [];
    acc[item.type][cat].push(item);
    return acc;
  }, {});

  // Toggle category section
  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  return (
    <div className='pt-12 px-2 md:px-8'>
      <div className='flex mx-5'>
        <p className='text-3xl text-blue-900 mx-2 my-3 underline'>Admin Inventory</p>
        <h1 className='text-3xl my-3 text-blue-900'>:</h1>
      </div>

      {/* Form Section */}
      <form onSubmit={onSubmitHandler} className='max-w-xl mx-auto mb-10'>
        <div className='shadow-md rounded-lg p-4'>
          <label className='cursor-pointer block mx-auto mb-2' htmlFor="upload-area">
            <img
              className='w-full h-40 object-contain rounded-2xl border mb-2'
              src={image ? URL.createObjectURL(image) : 'addimage.png'}
              alt=""
            />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='upload-area' hidden />
          <input onChange={(e) => setName(e.target.value)} value={name}
            type="text" placeholder='Name'
            className='block w-full border border-black text-xl text-blue-900 text-center mb-2'
          />
          <input onChange={(e) => setSize(e.target.value)} value={size}
            type="text" placeholder='Size'
            className='block w-full border border-black text-xl text-blue-900 text-center mb-2'
          />
          <input onChange={(e) => setRate(e.target.value)} value={rate}
            type="text" placeholder='Rate'
            className='block w-full border border-black text-xl text-blue-900 text-center mb-2'
          />
          <input onChange={(e) => setQuantity(e.target.value)} value={quantity}
            type="text" placeholder='Quantity'
            className='block w-full border border-black text-xl text-blue-900 text-center mb-2'
          />
          <select
            onChange={(e) => setType(e.target.value)}
            value={type}
            className='block w-full border border-black text-xl text-blue-900 text-center mb-2'
          >
            <option value="">Select Type</option>
            <option value="Decorations">Decorations</option>
            <option value="Marble">Marble</option>
          </select>
          <select
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className='block w-full border border-black text-xl text-blue-900 text-center mb-2'
          >
            <option value="">Select Category</option>
            {categoryOptionsByType[type]?.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
          <button type='submit' className='bg-blue-900 text-white mt-2 block w-full py-2 rounded-md'>Add Item +</button>
        </div>
      </form>

      {/* Type Filter Tabs */}
      <div className='flex gap-4 mb-6 justify-center'>
        {['Decorations', 'Marble'].map((tab) => (
          <button
            key={tab}
            onClick={() => setType(tab)}
            className={`px-6 py-2 rounded-xl text-lg font-semibold border transition-all duration-150 
              ${type === tab
                ? 'bg-blue-900 text-white border-blue-900 shadow-md'
                : 'bg-white text-blue-900 border-blue-900'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grouped Inventory Display */}
      <div>
        {grouped[type] ? (
          Object.entries(grouped[type]).map(([cat, items]) => (
            <div key={cat} className='mb-10'>
              <div
                className='flex justify-between items-center bg-blue-50  px-4 py-2 rounded-xl cursor-pointer'
                onClick={() => toggleCategory(cat)}
              >
                <h2 className='text-xl font-bold text-blue-900 underline'>{cat}</h2>
                <span className='text-blue-800 text-lg'>
                  {expandedCategories[cat] ? '▲' : '▼'}
                </span>
              </div>
              {expandedCategories[cat] && (
                <div className='flex flex-wrap gap-2 sm:gap-6 mt-4 justify-center'>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/admin/editpatti/${item._id}`)}
                      className='max-w-xs  shadow-sm hover:shadow-lg cursor-pointer rounded-xl bg-white p-1 sm:p-2'
                    >
                      <img
                        className=' w-44  sm:w-52 h-52 object-cover rounded-xl'
                        src={item.image}
                        alt=""
                      />
                      <p className='text-lg text-blue-900 text-center font-medium'>{item.name}</p>
                      <p className='text-blue-900 text-center text-sm'>Size: {item.size}</p>
                      <p className='text-blue-900 text-center text-sm'>Rate: {item.rate}</p>
                      <div className='flex justify-center items-center mt-3 '>
                        <span className='text-blue-900 text-center '>Quantity:</span>
                        <p className='mx-2 text-blue-900'> {item.quantity} </p>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className='text-center text-gray-500'>Loading.</div>
        )}
      </div>
    </div>
  );
}

export default Inventory;