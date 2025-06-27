import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/cliente/Home';
import Produtos from './pages/cliente/Produtos';
import DetalheProduto from './pages/cliente/DetalheProduto';
import Login from './pages/cliente/Login';
import Cadastro from './pages/cliente/Cadastro';
import PedidoPersonalizado from './pages/cliente/PedidoPersonalizado';
import HistoricoPedidos from './pages/cliente/compras';
import Carrinho from './pages/cliente/carrinho'; // ✅ NOVO IMPORT
import Perfil from './pages/cliente/Perfil';
import MaisProdutos from './pages/cliente/MaisProdutos';
import AgendamentoCabine   from './pages/cliente/AgendamentoCabine'; 



import RotaPrivada from './components/RotaPrivada';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* ROTAS PROTEGIDAS COM LAYOUT */}
        <Route element={<RotaPrivada><Layout /></RotaPrivada>}>
          <Route path="/" element={<Navigate to="/produtos" />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/produtos/:id" element={<DetalheProduto />} />
          <Route path="/personalizar" element={<PedidoPersonalizado />} />
          <Route path="/meus-pedidos" element={<HistoricoPedidos />} />
          <Route path="/carrinho" element={<Carrinho />} /> {/* ✅ NOVA ROTA */}
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/mais-produtos" element={<MaisProdutos />} />
          <Route path="/agendamento-cabine" element={<AgendamentoCabine />} />
        </Route>

        {/* Fallback padrão */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
