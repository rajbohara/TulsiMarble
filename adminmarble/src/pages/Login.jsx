import React from 'react'
import { useNavigate } from 'react-router-dom';
function Login() {
   const navigate = useNavigate();
  return (
    <div className='m-0 flex flex-col h-screen justify-center items-center'>
      <div className='  w-2/5 border border-gray-400 shadow-md rounded-md p-8 mx-auto h-3/5'>
        <h1  className='text-5xl text-blue-900 text-center mb-6'>Admin Login</h1>
        <p className='text-2xl mb-2  text-blue-900'>Username-</p>
        <input className='h-10 w-full p-2 text-xl mb-5' type="text" name="Username" id="" />
        <p className='text-2xl mb-2  text-blue-900'>Password-</p>
        <input className='h-10 w-full p-2 text-xl' type="password" name="" id="" />
        <br />
        <button onClick={() => navigate(`/Inventory`)} className='bg-blue-900 h-14 w-40 p-5 text-white mx-auto block mt-12'>Login</button>
        <a className='underline text-blue-900 mx-auto block w-28 pl-2 mt-3 ' href="">Login as user?</a>
      </div>
    </div>
  )
}

export default Login
 