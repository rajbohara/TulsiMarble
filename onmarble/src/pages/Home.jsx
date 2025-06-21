import React from 'react'
import { patti } from '../assets/assets'
import { useNavigate } from 'react-router-dom';


function Home() {
    const navigate = useNavigate();

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
        <div  onClick={() => navigate(`/${item._id}`)}  className='max-w-80 min-w-40 shadow-sm  hover:shadow-lg' >
            <img className='w-11/12 h-5/6 p-5 mx-auto object-cover rounded-3xl' src={item.image} alt="" />
            <p className='text-2xl text-blue-900 text-center '>{item.name}</p>
            <p  className=' text-blue-900 text-center'>{item.size}</p>
        </div>
      ))}
    </div>
    </>
  )
}

export default Home
