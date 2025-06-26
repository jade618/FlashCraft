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
    <div className="admin-login">
      <h1>Login Admin</h1>
      <form onSubmit={handleLogin}>
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
        {erro && <p className="erro">{erro}</p>}
        <button type="submit">Entrar</button>
        <button
          type="button"
          className="btn-cadastro"
          onClick={() => navigate('/admin/cadastrar')}
        >
          Criar Conta Admin
        </button>
      </form>
    </div>
  );
}

export default LoginAdmin;
