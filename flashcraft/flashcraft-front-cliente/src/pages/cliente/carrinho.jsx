import { useCarrinho } from '../../context/CarrinhoContext';
import './Carrinho.css';

function Carrinho() {
  const { carrinho = [], removerDoCarrinho, limparCarrinho } = useCarrinho();

  const totalGeral = carrinho.reduce(
    (acc, item) => acc + (item.preco * (item.quantidade || 1)),
    0
  );

  async function handleFinalizarCompra() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para finalizar a compra.');
        return;
      }

      if (carrinho.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
      }

      const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
      const nomeCliente = usuario.nome || 'Cliente Anônimo';
      const emailCliente = usuario.email || 'cliente@email.com';

      console.log('Iniciando finalização da compra com os dados:', {
        nomeCliente,
        emailCliente,
        carrinho
      });

      for (const item of carrinho) {
        console.log('Enviando pedido para o produto:', item.nome);
        const response = await fetch('http://localhost:3000/api/pedidosCliente', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nomeCliente,
            emailCliente,
            quantidade: item.quantidade,
            produto: {
              id: item._id,
              nome: item.nome,
              imagem: item.imagem,
              preco: item.preco
            }
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao criar pedido para o produto ' + item.nome);
        }
      }

      alert('Compra finalizada com sucesso!');
      limparCarrinho();
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao finalizar a compra. Tente novamente.');
    }
  }

  return (
    <main className="carrinho-container">
      <section className="carrinho-cabecalho">
        <h1>Seu <span className="destaque">Carrinho</span></h1>
        <p>Confira os itens antes de finalizar sua compra.</p>
      </section>

      {carrinho.length === 0 ? (
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
      ) : (
        <section className="carrinho-itens">
          {carrinho.map((item) => (
            <div className="carrinho-card" key={item._id}>
              <div className="imagem-carrinho">
                <img
                  src={item.imagem || 'https://via.placeholder.com/200'}
                  alt={item.nome}
                />
              </div>
              <div className="info-carrinho">
                <h3>{item.nome}</h3>
                <p>Quantidade: {item.quantidade || 1}</p>
                <p>Preço unitário: R$ {parseFloat(item.preco).toFixed(2)}</p>
                <p>Total: R$ {(item.preco * (item.quantidade || 1)).toFixed(2)}</p>
                <button onClick={() => removerDoCarrinho(item._id)}>Remover</button>
              </div>
            </div>
          ))}

          <div className="carrinho-resumo">
            <h2>Total geral: <span>R$ {totalGeral.toFixed(2)}</span></h2>
            <button className="btn-finalizar" onClick={handleFinalizarCompra}>Finalizar Compra</button>
            <button className="btn-limpar" onClick={limparCarrinho}>Esvaziar Carrinho</button>
          </div>
        </section>
      )}
    </main>
  );
}

export default Carrinho;
