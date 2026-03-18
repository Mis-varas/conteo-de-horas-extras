import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout';
import Home from './pages/Home';
import Funcionarios from './pages/Funcionarios';
import Asignacion from './pages/Asignacion';
import Reportes from './pages/Reportes';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Contenido de la página actual */}
        <main style={{ paddingBottom: '70px' }}> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/funcionarios" element={<Funcionarios />} />
            <Route path="/asignacion" element={<Asignacion />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>

        {/* Menú de navegación inferior (fijo para móviles) */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;