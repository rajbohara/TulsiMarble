import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {AdminContext} from '../context/AdminContext';
import { useContext } from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'

function Login() {
    const { adminToken,setadminToken} = useContext(AdminContext)
   const navigate = useNavigate();
     const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");
    const backendURL = process.env.REACT_APP_BACKEND_URL;

     const submitHandler = async () => {
   
     try {
      
        const {data} = await axios.post(backendURL+'/admin/login',{email,password});
        if(data.success){
          console.log(data.token);
          localStorage.setItem('adminToken',data.token)
          setadminToken(data.token)
          navigate('/Inventory');
        } else{
          toast.error(data.message)
        }
        
     } catch (error) {
      console.log(error);
      toast.error('Something went wrong, please try again later.')
     }
    }

  return (
    <div className='m-0 flex flex-col  min-h-screen  justify-center items-center px-4'>
      <div className='  w-full  max-w-md border border-gray-400 shadow-md rounded-lg p-6 sm:p-8 '>
        <h1  className='text-3xl sm:text-5xl text-blue-900 text-center mb-6'>Admin Login</h1>
        
        <label className="text-lg sm:text-2xl mb-1 text-blue-900 block">Email</label>
         <input onChange={(e)=> setEmail(e.target.value)} className="h-10 w-full p-2 text-base sm:text-xl mb-5 border border-gray-400 rounded"type="email" value={email} />
          <label className="text-lg sm:text-2xl mb-1 text-blue-900 block">Password</label>
    <input onChange={(e)=> setPassword(e.target.value)}
      className="h-10 w-full p-2 text-base sm:text-xl border border-gray-400 rounded"
      type="password"
      name="Password"
       value={password}
    />
       
        <br />
        <button onClick={() => submitHandler()} className='bg-blue-900 h-12 w-full text-white text-lg sm:text-xl mt-8 rounded hover:bg-blue-800 transition-all'>Login</button>
        <a className='underline text-blue-900 text-center block mt-4' href="">Login as user?</a>
      </div>
   </div>
  )
}

export default Login
 