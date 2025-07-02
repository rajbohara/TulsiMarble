import React, {  useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast} from 'react-toastify'


function Home() {
    const navigate = useNavigate();
  const [patti, setPatti] = useState([])
    const backendURL = 'http://localhost:3000';

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
    }

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      
     <div className='bg-blue-50 h-30 flex items-center py-10 pt-20 px-56 justify-between'>
      <div className='h-28'>
        <img className='h-24' src="/welcomeicon.png" alt="welcome" />
        <p className='text-center font-medium  text-blue-950 py-1'> Welcome </p>
      </div>
        <div className='h-28'>
        <img className='h-24' src="/blackicon.png" alt="patti" />
        <p className='text-center font-medium  text-blue-950 py-1'>Patti </p>
      </div>
        <div className='h-28'>
        <img className='h-24' src="/rangoliicon.png" alt="rangoli" />
        <p className='text-center font-medium  text-blue-950 py-1'> Rangoli </p>
      </div>
        <div className='h-28'>
        <img className='h-24' src="/stripsicon.png" alt="strips" />
        <p className='text-center font-medium  text-blue-950 py-1'> Colour Strips </p>
      </div>
        <div className='h-28'>
        <img className='h-24' src="/moreicon.png" alt="more" />
        <p className='text-center font-medium  text-blue-950 py-1'> Other Items </p>
      </div>
    </div>
    
    <div className='flex'><h1 className='text-3xl text-blue-900 mx-2 my-3 underline'>Top Selling</h1><h1 className='text-3xl my-3 text-blue-900'>:</h1></div>
    <div className='flex flex-wrap justify-center gap-4'>
     { patti.slice(0,10).map((item,index)=>(
        <div  key={item._id} onClick={() => navigate(`/${item._id}`)}  className='max-w-80 min-w-40 shadow-sm  hover:shadow-lg' >
            <img className='w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl' src={item.image} alt="" />
            <p className='text-2xl text-blue-900 text-center '>{item.name}</p>
            <p  className=' text-blue-900 text-center'>Size: {item.size}</p>
        </div>
      ))}
    </div>
    </>
  )
}

export default Home
