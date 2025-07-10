
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Pattidetails from './pages/Pattidetails';
import Profile from './pages/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyOrders from './pages/MyOrders';
import Categorised from './pages/Categorised';

function App() {
  return (
   <BrowserRouter>
    <div className="App">
      <header className="App-header">
       
        <Navbar />
       
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:_id' element={<Pattidetails/>} />
          <Route path='/MyOrders/:userid' element={<MyOrders/>} />
          <Route path='/category/:category' element={<Categorised/>} />
        </Routes>
        <ToastContainer />
      </header>
    </div>
    </BrowserRouter>
  );
}

export default App;
