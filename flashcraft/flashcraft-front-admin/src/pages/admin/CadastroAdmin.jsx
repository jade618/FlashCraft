import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import apiAdmin from '../../services/apiAdmin';
import './CadastroAdmin.css';

const CadastroAdmin = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaPadrao, setSenhaPadrao] = useState('123');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!senhaPadrao) {
      setErro('Por favor, digite a senha padrão para confirmação.');
      return;
    }

    try {
      await apiAdmin.post('/admin/cadastro', { nome, email, senha, senhaPadrao });
      setSucesso('Usuário cadastrado com sucesso.');
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setSenhaPadrao('');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao cadastrar usuário.');
    }
  };

  return (
    <AdminLayout>
      <div className="cadastro-admin cadastro-login sem-sidebar">
        <h1>Cadastrar Usuário</h1>
        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <label>Confirmar Senha:</label>
          <input
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          <label>Senha Padrão (para confirmação):</label>
          <input
            type="password"
            value={senhaPadrao}
            onChange={(e) => setSenhaPadrao(e.target.value)}
            required
          />
          <button type="submit">Cadastrar</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CadastroAdmin;
