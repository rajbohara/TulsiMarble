import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'



function Navbar() {
  return (
    <div  className=' fixed top-0 left-0 w-full z-50'>
    <div className='bg-blue-950 h-10 flex  items-center p-4 fi'>
      <div className=''><p className='text-white'>Tulsi Marbles</p></div>
         <Bars3Icon className="h-6 w-6 text-white ml-auto" />
    </div>
   
    </div>
  )
}

export default Navbar
