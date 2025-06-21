import React from 'react'
import { patti } from '../assets/assets'

function Inventory() {
  return (
    <div className='pt-12'>
    <div className='flex mx-5'> <p className='text-3xl text-blue-900 mx-2 my-3 underline'> All Items</p><h1 className='text-3xl my-3 text-blue-900'>:</h1></div>
    <div className='flex flex-wrap  justify-center gap-4'>
         { patti.slice(0,10).map((item,index)=>(
            <div className=' max-w-80  min-w-40 shadow-sm  hover:shadow-lg' >
                <img className='w-11/12 h-4/6 p-5 mx-auto object-cover rounded-3xl' src={item.image} alt="" />
                <p className='text-2xl  text-blue-900 text-center '>{item.name}</p>
                <p className=' text-blue-900 mt-3 text-center'>{item.size}</p>
                <div className='flex mx-auto w-28 mt-3' >
                  <button className='bg-blue-800 h-8 w-8  rounded-full m-0 text-white'>-</button>
                  <p className='mx-2'> {item.quantity} </p>
                  <button className='bg-blue-800 h-8 w-8  rounded-full m-0 text-white'>+</button>
                </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Inventory
