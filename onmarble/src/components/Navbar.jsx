import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Clerkheader from '../components/Clerkheader';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { useAuth } from "@clerk/clerk-react";
import { SignIn } from "@clerk/clerk-react";
import axios from 'axios';
import {toast} from 'react-toastify'
 import { useUser } from '@clerk/clerk-react';

function Navbar() {
  const navigate = useNavigate();
    const { user, isLoaded } = useUser();
  return (

    <div  className=' fixed top-0 left-0 w-full z-50'>
    <div className='bg-blue-950 h-10 flex  items-center p-4'>
      <div className=''><p className='text-white  hover:cursor-pointer'  onClick={()=>{navigate(`/`)}}>Tulsi Marbles</p></div>
     
     <div className='ml-auto flex items-center gap-5 h-6 '>
       {  !user ? ( <span className=' text-white hover:cursor-pointer' onClick={() => window.location.href = `${process.env.REACT_APP_ADMIN_URL}/`}
>Admin?</span>): <span className='text-white hover:cursor-pointer' onClick={()=>{navigate(`/MyOrders/${user.id}`)}}> My Orders </span>
}
      
      <div className='flex items-center'> <Clerkheader/> </div>
         <Bars3Icon className="h-6 w-6 text-white  my-auto" />
         </div>
    </div>
   
    </div>
  )
}

export default Navbar
