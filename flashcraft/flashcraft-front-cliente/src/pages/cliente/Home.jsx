import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-conteudo">
          <h1>Transforme ideias em realidade: peça, crie e imprima em 3D!</h1>
          <p>
            Seja para negócios, presentes personalizados, protótipos ou soluções criativas, nossa impressão 3D garante{' '}
            <strong>qualidade, agilidade e inovação</strong> em cada camada.
          </p>
          <button className="btn-loja" onClick={() => navigate('/produtos')}>
            Acesse a loja
          </button>
        </div>
        <div className="hero-img">
          <img src="/hero.png" alt="Impressão 3D criativa" />
        </div>
      </section>

      {/* PRODUTOS PERSONALIZADOS */}
      <section className="produtos">
        <h2 className="titulo-secao">Nossos Produtos Personalizados</h2>
        <div className="produtos-grid">
          <div
            className="card-produto"
            onClick={() => navigate('/personalizar')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/3d-personalizada.png"
              alt="Impressão 3D"
              className="imagem-produto"
            />
            <h3>Impressão 3D Personalizada</h3>
            <p>Dê vida às suas ideias com precisão e originalidade.</p>
          </div>

          <div
            className="card-produto"
            onClick={() => navigate('/agendamento-cabine')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/cabine.png"
              alt="Cabine fotográfica"
              className="imagem-produto"
            />
            <h3>Cabine Fotográfica</h3>
            <p>Registre o momento com estilo e praticidade.</p>
          </div>

          <div
            className="card-produto"
            onClick={() => navigate('/personalizar')}
            style={{ cursor: 'pointer' }}
          >
            <img
              src="/funko-personalizado.png"
              alt="Funko Pop personalizado"
              className="imagem-produto"
            />
            <h3>Funko Pop Personalizado</h3>
            <p>A sua miniatura com muito charme e personalidade.</p>
          </div>
        </div>
      </section>

      {/* GUIA DE COMPRAS */}
      <section className="guia">
        <h2 className="titulo-secao">Guia de Compras</h2>
        <p className="texto-destaque">Descubra um novo mundo com as impressões 3D!</p>
        <p>
          Na <strong>FlashCraft</strong>, acreditamos que cada ideia merece ganhar forma.
          Com a impressão 3D, transformamos esboços em realidade.
        </p>
      </section>

      {/* DIA DE VENDAS */}
      <section className="evento">
        <img src="/img/logo-escola.png" alt="Logo da escola" className="logo-escola" />
        <h2>Dia de Vendas</h2>
        <p><strong>26 de junho</strong> na EEEP Sandra Carvalho Costa</p>
        <p className="evento-destaque">Não perca a oportunidade!</p>
      </section>

      {/* RODAPÉ */}
      <footer className="rodape">
        <div className="rodape-grid">
          <div>
            <h3>FlashCraft</h3>
            <p>Inovação em impressão 3D para projetos únicos e criativos.</p>
          </div>
          <div>
            <h4>Redes Sociais</h4>
            <ul>
              <li>Instagram</li>
              <li>Facebook</li>
              <li>WhatsApp</li>
            </ul>
          </div>
          <div>
            <h4>Empresa</h4>
            <ul>
              <li>Sobre nós</li>
              <li>Contato</li>
              <li>Parcerias</li>
              <li>Termos de uso</li>
            </ul>
          </div>
          <div>
            <h4>Serviços</h4>
            <ul>
              <li>Impressão 3D</li>
              <li>Cabine Fotográfica</li>
              <li>Consultoria Criativa</li>
            </ul>
          </div>
          <div>
            <h4>Ajuda</h4>
            <ul>
              <li>Suporte</li>
              <li>Dúvidas Frequentes</li>
              <li>Política de devolução</li>
            </ul>
          </div>
        </div>
        <p className="copy">© 2024 FlashCraft — Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

export default Home;
