// 📁 src/pages/cliente/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiCliente from '../../services/apiCliente';
import './Login.css'; // CSS baseado no estilo que você mandou

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

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

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
    <div className="login-background">
      <ul className="background-animation">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i}></li>
        ))}
      </ul>

      <div className="admin-login"> {/* Mantive essa classe pra aproveitar o CSS */}
        <h1>Entrar na Flashcraft</h1>
        <form onSubmit={handleLogin}>
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
          {erro && <p className="erro">{erro}</p>}
          <button type="submit">Entrar</button>
          <p style={{ marginTop: '18px', fontSize: '0.9rem', color: '#333' }}>
            Não tem conta?{' '}
            <Link to="/cadastro" style={{ color: '#CA368E', fontWeight: '600' }}>
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
