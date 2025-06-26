import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2 className="sidebar-title">Admin Panel</h2>
      <ul className="sidebar-list">
        <li>
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/pedidos" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Pedidos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/produtos" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Produtos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categorias" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Categorias
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/usuarios" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Usuários
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/cadastro" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Cadastrar Usuário
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/compra-usuario" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Compra em Nome do Usuário
          </NavLink>
        </li>
      </ul>
      <div className="sidebar-logout">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Sidebar;
