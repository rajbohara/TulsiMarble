import React from 'react'
import { createContext } from "react"; //createContext : It lets you create a Context, which is like a global box for storing data that any component in your app can use — without needing to pass props.
import {toast} from 'react-toastify'
import axios from 'axios';
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
     const [adminToken,setadminToken] = React.useState(localStorage.getItem('adminToken')?localStorage.getItem('adminToken'):'');
     

     
    
    

     const value = {
      
        adminToken,
        setadminToken,
       
      
     }
  return (
     <AdminContext.Provider value={value}>
           {props.children} 
         </AdminContext.Provider>
  )
}

export default AdminContextProvider;

