import React, { useState, useEffect } from 'react';
import pedidoService from '../../services/pedidoService';
import './PedidoPersonalizado.css';

function PedidoPersonalizado() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [descricao, setDescricao] = useState('');
  const [linkReferencia, setLinkReferencia] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!descricao) {
      alert('Descreva sua ideia antes de enviar.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('descricao', descricao);
    formData.append('linkReferencia', linkReferencia);
    if (arquivo) {
      formData.append('arquivo', arquivo);
    }

    try {
      setCarregando(true);
      await pedidoService.enviarPedidoPersonalizado(formData);
      setEnviado(true);
    } catch (err) {
      alert(err.message || 'Erro ao enviar o pedido.');
    } finally {
      setCarregando(false);
    }
  };

  if (enviado) {
    return (
      <main className="personalizado-container">
        <div className="mensagem-sucesso">
          <h2>🎉 Pedido enviado com sucesso!</h2>
          <p>Você receberá um e-mail com os detalhes e o PDF em breve.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="personalizado-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <h1>🧩 Pedido de Produto 3D Personalizado</h1>

        <label>Nome</label>
        <input type="text" value={nome} disabled />

        <label>Email</label>
        <input type="email" value={email} disabled />

        <label>Descrição da ideia*</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        ></textarea>

        <label>Link de referência (opcional)</label>
        <input
          type="url"
          value={linkReferencia}
          onChange={(e) => setLinkReferencia(e.target.value)}
        />

        <label>Anexo (opcional)</label>
        <input type="file" onChange={(e) => setArquivo(e.target.files[0])} />

        <button type="submit" className="btn-rosa" disabled={carregando}>
          {carregando ? 'Enviando...' : 'Enviar Pedido'}
        </button>
      </form>
    </main>
  );
}

export default PedidoPersonalizado;
