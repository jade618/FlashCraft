import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../context/CarrinhoContext';
import './MaisProdutos.css';

function MaisProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrecoMin, setFiltroPrecoMin] = useState('');
  const [filtroPrecoMax, setFiltroPrecoMax] = useState('');
  const { adicionarAoCarrinho } = useCarrinho();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await fetch('http://localhost:3000/api/produtos');
        const data = await response.json();
        setProdutos(data);
        // Extract unique categories recursively
        const extractCategories = (items) => {
          let cats = [];
          items.forEach(item => {
            if (item.categoria) {
              if (typeof item.categoria === 'string') {
                cats.push(item.categoria);
              } else if (item.categoria.nome) {
                cats.push(item.categoria.nome);
              }
              // Recursively check nested categories if any
              if (item.categoria.subcategorias && Array.isArray(item.categoria.subcategorias)) {
                cats = cats.concat(extractCategories(item.categoria.subcategorias));
              }
            }
          });
          return [...new Set(cats)];
        };
        const cats = extractCategories(data);
        setCategorias(cats);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }
    fetchProdutos();
  }, []);

  const filtrarProdutos = () => {
    return produtos.filter(produto => {
      const categoriaMatch = filtroCategoria ? (produto.categoria?.nome === filtroCategoria || produto.categoria === filtroCategoria) : true;
      const preco = parseFloat(produto.preco);
      const precoMinMatch = filtroPrecoMin ? preco >= parseFloat(filtroPrecoMin) : true;
      const precoMaxMatch = filtroPrecoMax ? preco <= parseFloat(filtroPrecoMax) : true;
      return categoriaMatch && precoMinMatch && precoMaxMatch;
    });
  };

  const produtosFiltrados = filtrarProdutos();

  return (
    <main className="maisprodutos-container">
      <h1>Mais Produtos</h1>

      <section className="filtros">
        <label>
          Categoria:
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}>
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label>
          Preço Mínimo:
          <input
            type="number"
            min="0"
            value={filtroPrecoMin}
            onChange={e => setFiltroPrecoMin(e.target.value)}
            placeholder="0"
          />
        </label>

        <label>
          Preço Máximo:
          <input
            type="number"
            min="0"
            value={filtroPrecoMax}
            onChange={e => setFiltroPrecoMax(e.target.value)}
            placeholder="0"
          />
        </label>
      </section>

      <section className="produtos-lista">
        {produtosFiltrados.length === 0 ? (
          <p>Nenhum produto encontrado com os filtros aplicados.</p>
        ) : (
          produtosFiltrados.map(produto => (
            <div key={produto._id} className="produto-card">
              <img src={produto.imagem || '/img/placeholder.png'} alt={produto.nome} />
              <h3>{produto.nome}</h3>
              <p>R$ {parseFloat(produto.preco).toFixed(2)}</p>
              <p>Categoria: {produto.categoria?.nome || produto.categoria || 'Sem Categoria'}</p>
          <button onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              alert('Você precisa estar logado para ver os detalhes do produto.');
              navigate('/login');
            } else {
              navigate(`/produto/${produto._id}`);
            }
          }}>Ver Detalhes</button>
          {/* Removed add to cart button here as per user request */}
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default MaisProdutos;
