import React, { useEffect, useState } from 'react';
import apiAdmin from '../../services/apiAdmin';
import Sidebar from '../../components/Sidebar';
import LogoutButton from '../../components/LogoutButton';
import './AdminPedidos.css';

const statusOptions = ['Em andamento', 'Entregue', 'Pronto', 'Cancelado'];

// Recursive component to render list of orders of any type
function PedidoList({ title, pedidos, type, onStatusChange, onCancel }) {
  if (!pedidos || pedidos.length === 0) {
    return (
      <section className="pedido-section">
        <h1>{title}</h1>
        <p className="empty-message">Nenhum {title.toLowerCase()} encontrado.</p>
      </section>
    );
  }

  return (
    <section className="pedido-section">
      <h1>{title}</h1>
      <ul className="pedido-list">
        {pedidos.map((pedido) => (
          <li key={pedido._id} className="pedido-item">
            <div><strong>Cliente:</strong> {pedido.nomeCliente || pedido.nome || pedido.usuario?.nome || 'Nome não informado'}</div>
            {type === 'pedido' && (
              <>
                <div><strong>Código da Compra:</strong> {pedido.codigoFicha || 'Não informado'}</div>
                <div><strong>Produto:</strong> {pedido.produto?.nome || 'Produto não informado'}</div>
                <div><strong>Quantidade:</strong> {pedido.quantidade || 'Não informado'}</div>
                <div><strong>Email:</strong> {pedido.emailCliente || pedido.usuario?.email || 'Email não informado'}</div>
                <div><strong>Link:</strong> {pedido.linkReferencia || 'Não informado'}</div>
                <div><strong>Preço:</strong> R$ {pedido.produto?.preco ? parseFloat(pedido.produto.preco).toFixed(2) : 'Não informado'}</div>
              </>
            )}
            {type === 'solicitacao' && (
              <>
                <div><strong>Descrição:</strong> {pedido.descricao}</div>
                <div><strong>Email:</strong> {pedido.email || 'Email não informado'}</div>
                <div><strong>Link:</strong> {pedido.linkReferencia || 'Não informado'}</div>
                {pedido.imagemUrl && (
                  <div className="pedido-imagem">
                    <img src={pedido.imagemUrl} alt="Imagem do pedido personalizado" />
                  </div>
                )}
              </>
            )}
            {type === 'agendamento' && (
              <>
                <div><strong>Data/Hora:</strong> {new Date(pedido.dataHora).toLocaleString()}</div>
                <div><strong>Email:</strong> {pedido.email || 'Email não informado'}</div>
              </>
            )}
            <div>
              <strong>Status:</strong>
              <select
                value={pedido.status ? pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1) : ''}
                onChange={(e) => onStatusChange(pedido._id, type, e.target.value)}
              >
                <option value="" disabled>Selecione o status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="pedido-actions">
              <button onClick={() => onCancel(pedido._id, type)}>Cancelar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [solicitacoes3D, setSolicitacoes3D] = useState([]);
  const [agendamentosCabine, setAgendamentosCabine] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPedidos() {
      try {
        const response = await apiAdmin.get('/pedidos');
        setPedidos(response.data.pedidos || []);
        setSolicitacoes3D(response.data.solicitacoes3D || []);
        setAgendamentosCabine(response.data.agendamentosCabine || []);
      } catch (err) {
        setError('Erro ao buscar pedidos: ' + err.message);
      }
    }
    fetchPedidos();
  }, []);

  const handleCancel = async (id, type) => {
    try {
      let url = '';
      if (type === 'pedido' || type === 'solicitacao') {
        url = `/pedidos/${id}/cancelar`;
      } else if (type === 'agendamento') {
        alert('Cancelar agendamento ainda não implementado');
        return;
      }
      await apiAdmin.put(url, { type });
      alert(`${type} cancelado com sucesso.`);
      const response = await apiAdmin.get('/pedidos');
      setPedidos(response.data.pedidos || []);
      setSolicitacoes3D(response.data.solicitacoes3D || []);
      setAgendamentosCabine(response.data.agendamentosCabine || []);
    } catch (err) {
      alert('Erro ao cancelar: ' + err.message);
    }
  };

  const handleChangeStatus = async (id, type, newStatus) => {
    if (!newStatus || !statusOptions.includes(newStatus)) {
      alert('Status inválido. Por favor, escolha um dos seguintes: ' + statusOptions.join(', '));
      return;
    }
    try {
      let url = '';
      if (type === 'pedido' || type === 'solicitacao' || type === 'agendamento') {
        url = `/pedidos/${id}/status`;
      } else {
        alert('Tipo inválido para alteração de status');
        return;
      }
      await apiAdmin.put(url, { status: newStatus, type });
      alert(`${type} atualizado com sucesso.`);
      const response = await apiAdmin.get('/pedidos');
      setPedidos(response.data.pedidos || []);
      setSolicitacoes3D(response.data.solicitacoes3D || []);
      setAgendamentosCabine(response.data.agendamentosCabine || []);
    } catch (err) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="admin-pedidos-container">
      <Sidebar />
      <LogoutButton />
      <main className="admin-pedidos-main">
        <PedidoList
          title="Pedidos Padrão"
          pedidos={pedidos}
          type="pedido"
          onStatusChange={handleChangeStatus}
          onCancel={handleCancel}
        />
        <PedidoList
          title="Pedidos 3D Personalizados"
          pedidos={solicitacoes3D}
          type="solicitacao"
          onStatusChange={handleChangeStatus}
          onCancel={handleCancel}
        />
        <PedidoList
          title="Agendamentos de Cabine Fotográfica"
          pedidos={agendamentosCabine}
          type="agendamento"
          onStatusChange={handleChangeStatus}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}

export default AdminPedidos;
