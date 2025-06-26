import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pedidoService from '../../services/pedidoService';
import { useCarrinho } from '../../context/CarrinhoContext';
import './DetalheProduto.css';

function DetalheProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { adicionarAoCarrinho, carrinho } = useCarrinho();
  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    async function buscarProduto() {
      try {
        const dados = await pedidoService.getProdutoById(id);
        setProduto(dados);
      } catch (erro) {
        console.error('Erro ao buscar produto:', erro);
      }
    }

    buscarProduto();
  }, [id]);

  const quantidadeNoCarrinho = carrinho.find((item) => item._id === id)?.quantidade || 0;
  const estoqueDisponivel = produto ? produto.quantidade - quantidadeNoCarrinho : 0;

  const handleAdicionar = () => {
    if (quantidade > estoqueDisponivel) {
      alert("Você já tem " + quantidadeNoCarrinho + " no carrinho. Restam apenas " + estoqueDisponivel + " unidades.");
      return;
    }

    adicionarAoCarrinho({
      ...produto,
      quantidade,
      estoque: produto.quantidade
    });
  };

  const handleComprar = async () => {
    if (!produto) return;

    if (quantidade > estoqueDisponivel) {
      alert("Estoque insuficiente. Restam apenas " + estoqueDisponivel + " unidades.");
      return;
    }

    try {
      const novaQuantidade = produto.quantidade - quantidade;

      // Atualiza estoque do produto
      await fetch(`http://localhost:3000/api/produtos/${produto._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: produto.nome,
          descricao: produto.descricao,
          preco: produto.preco,
          quantidade: novaQuantidade,
          tipo: produto.tipo,
          disponivel: produto.disponivel,
          categoria: produto.categoria._id || produto.categoria
        })
      });

      // Cria novo pedido
      const token = localStorage.getItem('token');
      const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
      const nomeCliente = usuario.nome || 'Cliente Anônimo';
      const emailCliente = usuario.email || 'cliente@email.com';

      await fetch('http://localhost:3000/api/pedidosCliente', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nomeCliente,
          emailCliente,
          quantidade,
          produto: {
            id: produto._id,
            nome: produto.nome,
            imagem: produto.imagem,
            preco: produto.preco
          }
        })
      });

      alert('Compra realizada com sucesso!');
      navigate('/meus-pedidos');
    } catch (error) {
      console.error('Erro ao concluir compra:', error);
      alert('Erro ao processar a compra. Tente novamente.');
    }
  };

  if (!produto) {
    return <p className="carregando">Carregando produto...</p>;
  }

  return (
    <main className="detalhe-container">
      <div className="detalhe-produto">
        <div className="coluna-img">
          <img
            src={produto.imagem || '/img/placeholder.png'}
            alt={produto.nome}
          />
        </div>
        <div className="coluna-info">
          <h1>{produto.nome}</h1>
          <p className="preco">R$ {parseFloat(produto.preco).toFixed(2)}</p>
          <p className="estoque">Estoque: {produto.quantidade || 0}</p>
          <p className="descricao">{produto.descricao}</p>

          <div className="quantidade">
            <label htmlFor="quantidade">Quantidade:</label>
            <input
              id="quantidade"
              type="number"
              value={quantidade}
              min="1"
              max={estoqueDisponivel}
              onChange={(e) => {
                const valor = parseInt(e.target.value);
                setQuantidade(isNaN(valor) ? 1 : valor);
              }}
            />
            <p className="estoque-alerta">
              {quantidadeNoCarrinho > 0 &&
                "Você já adicionou " + quantidadeNoCarrinho + ". Restam " + estoqueDisponivel + " unidades."}
            </p>
          </div>

          <div className="botoes">
            <button className="btn-rosa" onClick={handleComprar}>
              Comprar Agora
            </button>
            <button className="btn-outline" onClick={handleAdicionar}>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DetalheProduto;
