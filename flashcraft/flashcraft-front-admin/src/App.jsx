import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginAdmin from './pages/admin/LoginAdmin';
import Dashboard from './pages/admin/Dashboard';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminPedidos from './pages/admin/AdminPedidos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import CadastroAdmin from './pages/admin/CadastroAdmin';
import RotaAdminPrivada from './components/RotaAdminPrivada';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminCompraUsuario from './pages/admin/AdminCompraUsuarioView';
import AdminComprasUsuarioView from './pages/admin/AdminCompraUsuarioView';
import './styles/variables.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/cadastro" element={<CadastroAdmin />} />
        <Route
          path="/admin/dashboard"
          element={
            <RotaAdminPrivada>
              <Dashboard />
            </RotaAdminPrivada>
          }
        />
        <Route
          path="/admin/produtos"
          element={
            <RotaAdminPrivada>
              <AdminProdutos />
            </RotaAdminPrivada>
          }
        />
        <Route
          path="/admin/pedidos"
          element={
            <RotaAdminPrivada>
              <AdminPedidos />
            </RotaAdminPrivada>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RotaAdminPrivada>
              <AdminUsuarios />
            </RotaAdminPrivada>
          }
        />
        <Route
          path="/admin/categorias"
          element={
            <RotaAdminPrivada>
              <AdminCategorias />
            </RotaAdminPrivada>
          }
        />
        <Route
          path="/admin/compra-usuario"
          element={
            <RotaAdminPrivada>
              <AdminCompraUsuario />
            </RotaAdminPrivada>
          }
        />
        <Route
          path="/admin/compras-usuario"
          element={
            <RotaAdminPrivada>
              <AdminComprasUsuarioView />
            </RotaAdminPrivada>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
