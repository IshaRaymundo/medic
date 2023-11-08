import Modal from './paginas/Modal';
import LoginForm from './paginas/Login';
import Registro from './paginas/Registro'; 
import Tabla from './paginas/registroMed'; 
import Navbar from './paginas/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes }  from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/Login' element={<LoginForm/>} /> {/* Cambia a 'LoginForm' */}
        <Route path='/Navbar' element={<Navbar/>} /> {/* Cambia a 'Tabla' */}
        <Route path='/' element={<Tabla/>} /> {/* Cambia a 'Tabla' */}
        <Route path='/Registro' element={<Registro/>} /> {/* Cambia a 'Registro' */}
        <Route path='/Modal' element={<Modal/>} />
      </Routes>
    </Router>
  );
}

export default App;
