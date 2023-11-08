import Modal from './paginas/Modal';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import MedicationTable from './paginas/RegistroMed';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes }  from 'react-router-dom';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path='/Login' element={<Login/>} />
        <Route path='/' element={<MedicationTable/>} />
        <Route path='/Registro' element={<Registro/>} />
        <Route path='/Modal' element={<Modal/>} />
      </Routes>
    </Router>

  );
}

export default App;
