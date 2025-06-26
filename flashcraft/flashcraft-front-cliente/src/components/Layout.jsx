import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './Layout.css';

function Layout() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  return (
    <div className="layout-pagina">
      {usuario && <Navbar />}
      <main className="conteudo-pagina">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
