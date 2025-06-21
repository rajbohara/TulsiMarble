import React from 'react'
import { useParams } from 'react-router-dom'
import { patti } from '../assets/assets'

function Pattidetails() {
    const {_id}= useParams();
    console.log(_id);
    const selected = patti.find(item=> item._id === _id);
    console.log(selected);
  return (
    <div>  <div className='w-96 text-center mx-auto my-14'>
       <img className='w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl' src={selected.image} alt="" />
            <p className='text-2xl text-blue-900 text-center '>{selected.name}</p>
            <p  className=' text-blue-900 text-center'>Size : {selected.size}</p>
             <p  className=' text-blue-900 text-center'>Rate :  {selected.rate}</p>
             <button className='py-3 my-2 px-24 mx-auto bg-green-600 text-xl text-white'>Call</button>
           </div> 
    
    </div>
  )
}

export default Pattidetails
