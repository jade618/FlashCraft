// 📁 components/RotaPrivada.jsx

import { Navigate, Outlet } from 'react-router-dom';

function RotaPrivada({ children }) {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Se receber filho (como <Layout>), renderiza ele — senão, renderiza <Outlet />
  return children || <Outlet />;
}

export default RotaPrivada;
