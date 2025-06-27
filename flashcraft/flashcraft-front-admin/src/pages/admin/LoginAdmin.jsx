import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiAdmin from '../../services/apiAdmin';
import './LoginAdmin.css';

function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const res = await apiAdmin.post('/usuarios/login', { email, senha });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setErro('Login inválido. Verifique seus dados.');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Login Admin</h2>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
        {erro && <p className="mensagem-erro">{erro}</p>}
        <p className="link-extra">
          Ainda não tem conta?{' '}
          <a onClick={() => navigate('/admin/cadastrar')} style={{ cursor: 'pointer' }}>
            Cadastre-se
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginAdmin;
