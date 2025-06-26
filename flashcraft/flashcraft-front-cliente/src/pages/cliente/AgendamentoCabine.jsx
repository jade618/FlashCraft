// 📁 flashcraft-frontend/src/pages/AgendamentoCabine.jsx
import { useState, useEffect } from 'react';
import agendamentoService from '../../services/agendamentoService';
import './AgendamentoCabine.css';

function AgendamentoCabine() {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  const [nome, setNome] = useState(usuario.nome || '');
  const [email, setEmail] = useState(usuario.email || '');
  const [dataHora, setDataHora] = useState('');
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        setCarregando(true);
        const dados = await agendamentoService.getAgendamentos();
        setAgendamentos(dados);
      } catch (err) {
        setErro('Erro ao listar agendamentos: ' + err.message);
      } finally {
        setCarregando(false);
      }
    }
    fetchAgendamentos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem(null);
    setErro(null);

    try {
      setCarregando(true);
      const data = await agendamentoService.criarAgendamento({ nome, email, dataHora });
      setMensagem(data.mensagem);
      setDataHora('');
      setAgendamentos(prev => [...prev, data.agendamento]);
    } catch (err) {
      setErro(err.message || 'Erro inesperado.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="pagina-agendamento">
      <h1>Agendamento da Cabine Fotográfica</h1>

      <form className="form-agendamento" onSubmit={handleSubmit}>
        {mensagem && <p className="sucesso">{mensagem}</p>}
        {erro && <p className="erro">{erro}</p>}

        <label>
          Nome
          <input
            type="text"
            value={nome}
            readOnly
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            readOnly
          />
        </label>

        <label>
          Data e Hora
          <input
            type="datetime-local"
            value={dataHora}
            onChange={e => setDataHora(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={carregando}>
          {carregando ? 'Enviando...' : 'Confirmar Agendamento'}
        </button>
      </form>

      <section className="lista-agendamentos">
        <h2>Agendamentos Existentes</h2>
        {carregando ? (
          <p>Carregando agendamentos...</p>
        ) : agendamentos.length === 0 ? (
          <p>Nenhum agendamento realizado ainda.</p>
        ) : (
          <ul>
            {agendamentos.map((ag) => (
              <li key={ag._id}>
                <strong>{new Date(ag.dataHora).toLocaleString()}</strong> – {ag.nome} ({ag.email})
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default AgendamentoCabine;
