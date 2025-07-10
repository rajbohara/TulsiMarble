import React, {  useEffect, useState } from 'react'
import {toast} from 'react-toastify'
import axios from 'axios';
import {useNavigate} from 'react-router-dom'

function Inventory() {
  const navigate = useNavigate();
   const [name, setName] = useState('');
    const [size, setSize] = useState('');
     const [quantity, setQuantity] = useState('');
      const [rate, setRate] = useState('');
       const [image, setImage] = useState(false);
        const [category, setCategory] = useState('');
         const [patti, setPatti] = useState([])
          const [type, setType] = useState('');
          const categoryOptionsByType = {
  Marble: ['Pink', 'Green', 'White', 'Crystal Black', 'Multi-Color'],
  Decorations: ['Rangoli', 'Welcome', 'Border Strips', 'Single-Color'],
};
         
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

   async function onSubmitHandler(event) {
    event.preventDefault();
   
    try {
       if(!image){
          toast.error('No Image selected')
       } else {
        const formData = new FormData();
        formData.append('image',image)
        formData.append('name',name)
        formData.append('size',size)
        formData.append('quantity',Number(quantity))
        formData.append('rate',rate)
        formData.append('category',category)
        formData.append('type',type)
      
       formData.forEach((value,key) => {
         console.log(`${key}:${value}`)
       });
      console.log("done")
      const {data}= await axios.post(backendURL+'/admin/addpatti',formData)
      if (data.success) {
        console.log("hanji ho gaya saaf")
        toast.success(data.message)
        setImage(false)
        setName('')
        setSize('')
        setQuantity('')
        setRate('')
        fetchInventory();
    } else {
         toast.error(data.message || "Something went wrong")
    }
  }
    } catch (error) {
        toast.error(error.response.data.message)
        console.log(error.response.data.message)
    
      }
   
  } 
  return (
   
    <div className='pt-12'>
    <div className='flex mx-5'> <p className='text-3xl text-blue-900 mx-2 my-3 underline'> All Items</p><h1 className='text-3xl my-3 text-blue-900'>:</h1></div>
    <div className='flex flex-wrap  justify-center gap-4'>
        <form onSubmit={onSubmitHandler} action="">
       <div className=' max-w-80  min-w-80 shadow-sm  hover:shadow-lg' >
           <label className='cursor-pointer' htmlFor="upload-area">
                <img  className='w-11/12 h-4/6 p-5 mx-auto object-cover rounded-3xl' src={image ? URL.createObjectURL(image) : 'addimage.png'} alt="" />
            </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='upload-area' hidden />
                <input  onChange={(e) => setName(e.target.value)} value={name}  type="text" placeholder='Name' className='block mx-auto border border-black text-xl  text-blue-900 text-center ' />
                  <input onChange={(e) => setSize(e.target.value)} value={size} type="text" placeholder='Size' className='mt-2 block mx-auto border border-black text-xl  text-blue-900 text-center ' />
               <input onChange={(e) => setRate(e.target.value)} value={rate} type="text" placeholder='Rate' className='mt-2 block mx-auto border border-black text-xl  text-blue-900 text-center ' />
           
               <input onChange={(e) => setQuantity(e.target.value)} value={quantity} type="text" placeholder='Quantity' className='mt-2 block mx-auto border border-black text-xl  text-blue-900 text-center ' />
           
 <select
  onChange={(e) => setType(e.target.value)}
  value={type}
  className='mt-2 block mx-auto border border-black text-xl text-blue-900 text-center'
>
  <option value="">Select Type</option>
  <option value="Decorations">Decorations</option>
  <option value="Marble">Marble</option>
</select>

<select
  onChange={(e) => setCategory(e.target.value)}
  value={category}
  className='mt-2 block mx-auto border border-black text-xl text-blue-900 text-center'
>
  <option value="">Select Category</option>
  {categoryOptionsByType[type]?.map((cat, idx) => (
    <option key={idx} value={cat}>{cat}</option>
  ))}
</select>


            <button   type='submit' className='bg-blue-800 text-white mt-2 block mx-auto px-2'>Add +</button>
           
            </div> 
    </form>
         {  
             
            patti.map((item,index)=>(
            <div onClick={()=> navigate(`/admin/editpatti/${item._id}`)} key={item._id} className=' max-w-80  min-w-40 shadow-sm  hover:shadow-lg' >
                <img className='w-11/12 h-4/6 p-5 mx-auto object-cover rounded-3xl' src={item.image} alt="" />
                <p className='text-2xl  text-blue-900 text-center '>{item.name}</p>
                <p className=' text-blue-900 mt-3 text-center'>{item.size}</p>
                 <p className=' text-blue-900 mt-3 text-center'>{item.rate}</p>
                <div className='flex mx-auto w-28 mt-3' >
                  <button className='bg-blue-800 h-8 w-8  rounded-full m-0 text-white'>-</button>
                  <p className='mx-2'> {item.quantity} </p>
                  <button className='bg-blue-800 h-8 w-8  rounded-full m-0 text-white'>+</button>
                </div>
            </div>
          ))
          }
        </div>
    </div>

  )
}

export default Inventory
