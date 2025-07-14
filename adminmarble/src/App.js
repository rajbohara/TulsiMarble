
import './App.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Inventory from './pages/Inventory';
import Editpatti from './pages/Editpatti';
import AllOrders from './pages/AllOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminContextProvider from './context/AdminContext';

function App() {
  return (
    <BrowserRouter>
    <AdminContextProvider>
    <div className="App">
           <Navbar />
    <Routes>
       <Route path='/' element={ <Login />} />
       <Route path='/Inventory' element={ <Inventory />} />
       <Route path='/admin/editpatti/:_id' element={ <Editpatti />} /> 
        <Route path='/admin/allorders' element={ <AllOrders />} />
    </Routes>
     <ToastContainer />

    </div>
    </AdminContextProvider>
    </BrowserRouter>
  );
}

export default App;
