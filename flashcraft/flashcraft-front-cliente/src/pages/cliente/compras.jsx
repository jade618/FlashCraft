import React, { useEffect, useState } from 'react';
import pedidoService from '../../services/pedidoService';
import './compras.css';

function CompraCard({ compra }) {
  return (
    <div className="card-compra">
      <div className="imagem-compra">
        {compra.imagemUrl ? (
          <img src={compra.imagemUrl} alt="Produto" />
        ) : (
          <div className="sem-imagem">Sem imagem disponível</div>
        )}
      </div>

      <h3>{compra.nome}</h3>

      {compra.descricao && <p>{compra.descricao}</p>}

      {compra.linkReferencia ? (
        <a href={compra.linkReferencia} target="_blank" rel="noopener noreferrer" className="link-referencia">
          Ver referência
        </a>
      ) : (
        <span className="link-ausente">Sem link de referência</span>
      )}

      <p className="status">
        Status: <strong>{compra.status}</strong>
      </p>

      <p className="data-pedido">
        Enviado em: {new Date(compra.criadoEm).toLocaleDateString()}
      </p>

      {compra.personalizado && (
        <span className="badge-personalizado">Personalizado</span>
      )}

      <button>Ver detalhes</button>
    </div>
  );
}

function Compras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCompras() {
      try {
        const comprasComuns = await pedidoService.getCompras();
        const solicitacoes3D = await pedidoService.getSolicitacoes3D();

        const personalizados = solicitacoes3D.map((item) => ({
          id: item._id,
          nome: 'Produto 3D Personalizado',
          descricao: item.descricao,
          imagemUrl: item.imagemUrl || null,
          linkReferencia: item.linkReferencia || null,
          status: item.status || 'Aguardando Produção',
          criadoEm: item.criadoEm,
          personalizado: true
        }));

        const pedidosFormatados = comprasComuns.map((pedido) => ({
          id: pedido._id,
          nome: pedido.produto?.nome || 'Produto',
          descricao: pedido.produto?.descricao || '',
          imagemUrl: pedido.produto?.imagem || null,
          linkReferencia: null,
          status: pedido.status || 'Aguardando Produção',
          criadoEm: pedido.createdAt || pedido.criadoEm || new Date(),
          personalizado: false
        }));

        setCompras([...pedidosFormatados, ...personalizados]);
      } catch (err) {
        setError('Erro ao carregar pedidos: ' + err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCompras();
  }, []);

  if (loading) {
    return <div className="loading">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (compras.length === 0) {
    return <p className="sem-compras">Você ainda não tem pedidos registrados.</p>;
  }

  return (
    <main className="pagina-compras">
      <section className="cabecalho-compras">
        <h1>Meus <span className="destaque">Pedidos</span></h1>
        <p>Acompanhe suas compras e solicitações personalizadas.</p>
      </section>

      <section className="compras-grid">
        {compras.map((compra, index) => (
          <CompraCard key={(compra.id || compra._id) + '-' + index} compra={compra} />
        ))}
      </section>
    </main>
  );
}

export default Compras;
