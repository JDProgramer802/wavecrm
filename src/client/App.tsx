import { Routes, Route } from 'react-router-dom';
import Layout from './componentes/Layout';
import InicioPage from './paginas/InicioPage';
import PanelPage from './paginas/PanelPage';
import ChatPage from './paginas/ChatPage';
import ContactosPage from './paginas/ContactosPage';
import ConfiguracionPage from './paginas/ConfiguracionPage';
import CDAPage from './paginas/cda/CDAPage';
import BarberiaPage from './paginas/barberia/BarberiaPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioPage />} />
      <Route path="/:slug" element={<Layout />}>
        <Route path="panel" element={<PanelPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="contactos" element={<ContactosPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="cda" element={<CDAPage />} />
        <Route path="barberia" element={<BarberiaPage />} />
      </Route>
    </Routes>
  );
}

export default App;
