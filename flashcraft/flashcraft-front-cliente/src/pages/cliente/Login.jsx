// 📁 src/pages/cliente/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiCliente from '../../services/apiCliente';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const resposta = await apiCliente.post('/auth/login', { email, senha });
      const { usuario, token } = resposta.data;

      localStorage.setItem('token', token); // <-- Corrigido
      localStorage.setItem('usuario', JSON.stringify(usuario)); // <-- Corrigido

      navigate('/produtos');

    } catch (err) {
      if (err.response?.status === 401) {
        setErro('Email ou senha incorretos.');
      } else {
        setErro('Erro ao conectar com o servidor. Tente novamente.');
      }
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Entrar na Flashcraft</h2>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p className="mensagem-erro">{erro}</p>}
        <p className="link-extra">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
