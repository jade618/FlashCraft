import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import './Navbar.css';

function Navbar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const { itens = [] } = useCarrinho() || {};
  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const fecharMenu = () => setMenuAberto(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo"><img src="/flashcraft.jpg" alt="flashcraft" /></div>

        <nav className={`nav-links ${menuAberto ? 'aberto' : ''}`}>
          <NavLink to="/home" onClick={fecharMenu}>Home</NavLink>
          <NavLink to="/produtos" onClick={fecharMenu}>Produtos</NavLink>
          <NavLink to="/meus-pedidos" onClick={fecharMenu}>Minhas Compras</NavLink>
          <NavLink to="/perfil" onClick={fecharMenu}>Perfil</NavLink>
          <NavLink to="/carrinho" onClick={fecharMenu} className="carrinho-botao">
            🛒 
            {totalItens > 0 && <span className="contador">{totalItens}</span>}
          </NavLink>
          <button className="btn-sair" onClick={handleLogout}>Sair</button>
        </nav>

        <button className={`hamburguer ${menuAberto ? 'ativo' : ''}`} onClick={toggleMenu} aria-label="Menu">
          <span className="linha"></span>
          <span className="linha"></span>
          <span className="linha"></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
