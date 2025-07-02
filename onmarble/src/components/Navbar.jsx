import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Clerkheader from '../components/Clerkheader';


function Navbar() {
  return (
    <div  className=' fixed top-0 left-0 w-full z-50'>
    <div className='bg-blue-950 h-10 flex  items-center p-4'>
      <div className=''><p className='text-white'>Tulsi Marbles</p></div>
     <div className='ml-auto flex items-center gap-5 h-6 '>
      <div className='flex items-center'> <Clerkheader/> </div>
         <Bars3Icon className="h-6 w-6 text-white  my-auto" />
         </div>
    </div>
   
    </div>
  )
}

export default Navbar
