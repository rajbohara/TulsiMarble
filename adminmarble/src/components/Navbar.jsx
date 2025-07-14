
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import React, { useContext,useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';


function Navbar() {
   const navigate = useNavigate();
     const { adminToken} = useContext(AdminContext);
   const [dikha, setDikha] = React.useState(false);

  const logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = `${process.env.REACT_APP_USER_URL}/`;
    setDikha(false);
   
  }

  return (
    <div  className=' fixed top-0 left-0 w-full z-50'>
    <div className='bg-blue-950 h-10 flex  items-center p-4 fi'>
      <div onClick={()=> {navigate('/Inventory')}} className='cursor-pointer'><p className='text-white'>Tulsi Marbles</p></div>
     
    <div className='ml-auto relative flex items-center gap-5 h-6 '>
        {  !adminToken ? ( <span className=' text-white hover:cursor-pointer' onClick={() => window.location.href = `${process.env.REACT_APP_USER_URL}/`}
>User?</span>): (<div className='flex items-center'> <button className='text-white' onClick={()=>{ navigate('/admin/allorders')}}>All Orders</button> </div>)
        
}

              <Bars3Icon onClick={()=> setDikha(!dikha)} className="h-6 w-6 text-white hover:cursor-pointer my-auto" />
              <ul onClick={()=> logout()} className={`${!dikha?'hidden':''} bg-white px-2 absolute top-6 border border-black right-1 hover:cursor-pointer hover:bg-slate-300`}>Logout</ul>
            </div>  
     
      
        
    </div>
   
    </div>
  )
}

export default Navbar
