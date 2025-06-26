import { useEffect, useState } from 'react';
import './Perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const dados = localStorage.getItem('usuario');
    if (dados) {
      setUsuario(JSON.parse(dados));
    }
  }, []);

  return (
    <main className="perfil-container">
      <div className="perfil-card">
        {usuario ? (
            <div className="perfil-info">
              <h2>{usuario.nome}</h2>
              <p>{usuario.email}</p>
              <button className="perfil-btn">Sair da Conta</button>
            </div>
         ) : (
          <p className="loading-text">Carregando informações...</p>
        )}
      </div>
    </main>
  );
}

export default Perfil;
