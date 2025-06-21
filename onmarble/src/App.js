
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Pattidetails from './pages/Pattidetails';
function App() {
  return (
   <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/:_id' element={<Pattidetails/>} />
          
          
        </Routes>
       
      </header>
    </div>
    </BrowserRouter>
  );
}

export default App;
