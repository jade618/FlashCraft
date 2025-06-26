// 📁 src/pages/cliente/Cadastro.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiCliente from '../../services/apiCliente';
import './Cadastro.css';

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso(false);

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    try {
      await apiCliente.post('/auth/cadastro', {
        nome,
        email,
        senha,
      });

      setSucesso(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      if (err.response?.status === 400) {
        setErro('E-mail já cadastrado.');
      } else {
        setErro('Erro ao cadastrar. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="cadastro-wrapper">
      <form className="cadastro-card" onSubmit={handleCadastro}>
        <h2>Crie sua conta</h2>
        <input
          type="text"
          placeholder="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
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
        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />
        <button type="submit">Cadastrar</button>

        {erro && <p className="mensagem-erro">{erro}</p>}
        {sucesso && <p className="mensagem-sucesso">Cadastro realizado! Redirecionando...</p>}

        <p className="link-extra">
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}

export default Cadastro;
