import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Produtos.css';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch('http://localhost:3000/api/produtos');
        const dados = await resposta.json();
        setProdutos(dados);
      } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
      }
    }

    carregarProdutos();
  }, []);

  return (
    <main className="pagina-produtos">
      {/* Cabeçalho */}
      <section className="cabecalho">
        <h1>
          Transforme <span className="destaque">ideias</span> em realidade
        </h1>
        <p>Crie seus produtos em destaque e personalize sua experiência</p>
      </section>

      {/* Sobre a FlashCraft */}
      <section className="sobre">
        <h2>Sobre a FlashCraft</h2>
        <p>Somos apaixonados por transformar criatividade em realidade com tecnologia e estilo.</p>
        <div className="cartoes-sobre">
          <div className="cartao">Impressão 3D personalizada</div>
          <div className="cartao">Cabine fotográfica com design único</div>
          <div className="cartao">Brindes exclusivos</div>
          <div className="cartao">Modelos criativos sob demanda</div>
        </div>
      </section>

      {/* Todos os Produtos */}
      <section className="produtos-loja">
        <h2>Todos os Produtos</h2>
        <div className="produtos-grid">
          {produtos.length > 0 ? (
            produtos.map((produto) => (
              <div
                key={produto._id}
                className="card-produto"
                onClick={() => navigate(`/produto/${produto._id}`)}
              >
                <img
                  src={produto.imagem || '/img/placeholder.png'}
                  alt={produto.nome}
                />
                <h3>{produto.nome}</h3>
              </div>
            ))
          ) : (
            <p>Carregando produtos...</p>
          )}
        </div>

        <div className="mais-produtos">
          <Link to="/mais-produtos" className="btn-rosa-claro">
            Ver Mais Produtos
          </Link>
        </div>
      </section>

      {/* Guia de Compras */}
      <section className="guia-compras">
        <h2>Guia de Compras</h2>
        <div className="blocos-guia">
          <div className="bloco">
            <span className="icone">📦</span>
            <h4>Escolher sua impressão 3D</h4>
            <button onClick={() => navigate('/mais-produtos')}>Ver mais</button>
          </div>
          <div className="bloco">
            <span className="icone">📸</span>
            <h4>Melhorar poses com cabine</h4>
            <button onClick={() => navigate('/agendamento-cabine')}>Ver mais</button>
          </div>
          <div className="bloco">
            <span className="icone">🧱</span>
            <h4>Criar seu modelo do zero</h4>
            <button onClick={() => navigate('/personalizar')}>Ver mais</button>
          </div>
        </div>
      </section>

      {/* Cabine de Fotos */}
      <section className="cabine">
        <h2>Cabine de Fotos</h2>
        <p>Capture memórias com estilo e criatividade.</p>
        <button className="btn-rosa" onClick={() => navigate('/agendamento-cabine')}>
          Agendar Horário
        </button>
      </section>

      {/* Rodapé */}
      <footer className="rodape">
        <div className="rodape-grid">
          <div>
            <h4>FlashCraft</h4>
            <ul>
              <li>Sobre</li>
              <li>Política de Privacidade</li>
              <li>Termos de uso</li>
            </ul>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>
              <li>Início</li>
              <li>Produtos</li>
              <li>Contato</li>
            </ul>
          </div>
          <div>
            <h4>Redes & Contato</h4>
            <ul>
              <li>Instagram</li>
              <li>Facebook</li>
              <li>WhatsApp</li>
            </ul>
          </div>
        </div>
        <p className="copy">© 2024 FlashCraft. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

export default Produtos;
