import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminCategorias.css';

function AdminCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('');

  useEffect(() => {
    buscarCategorias();
  }, []);

  async function buscarCategorias() {
    const res = await fetch('http://localhost:3000/api/categorias');
    const dados = await res.json();
    setCategorias(dados);
  }

  function iniciarEdicao(categoria) {
    setEditandoId(categoria._id);
    setNovoNome(categoria.nome);
  }

  async function adicionarCategoria() {
    if (!novaCategoria.trim()) {
      alert('O nome da nova categoria não pode ser vazio.');
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaCategoria }),
      });
      if (!res.ok) {
        const erro = await res.json();
        alert('Erro ao adicionar categoria: ' + (erro.erro || 'Erro desconhecido'));
        return;
      }
      setNovaCategoria('');
      buscarCategorias();
    } catch (err) {
      alert('Erro de rede ao adicionar categoria.');
    }
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNovoNome('');
  }

  async function salvarEdicao() {
    if (!novoNome.trim()) {
      alert('O nome da categoria não pode ser vazio.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:3000/api/categorias/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoNome }),
      });
      if (!res.ok) {
        const erro = await res.json();
        alert('Erro ao salvar categoria: ' + (erro.erro || 'Erro desconhecido'));
        return;
      }
      cancelarEdicao();
      buscarCategorias();
    } catch (err) {
      alert('Erro de rede ao salvar categoria.');
    }
  }

  async function deletarCategoria(id) {
    if (!window.confirm('Deseja realmente excluir esta categoria?')) return;
    try {
      const res = await fetch(`http://localhost:3000/api/categorias/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const erro = await res.json();
        alert('Erro ao deletar categoria: ' + (erro.erro || 'Erro desconhecido'));
        return;
      }
      buscarCategorias();
    } catch (err) {
      alert('Erro de rede ao deletar categoria.');
    }
  }

  return (
    <AdminLayout>
      <div className="admin-categorias">
        <h2>Gerenciar Categorias</h2>
        <div className="adicionar-categoria">
          <input
            type="text"
            placeholder="Nova categoria"
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
          />
          <button onClick={adicionarCategoria}>Adicionar</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat._id}>
                <td>
                  {editandoId === cat._id ? (
                    <input
                      type="text"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                    />
                  ) : (
                    cat.nome
                  )}
                </td>
                <td>
                  {editandoId === cat._id ? (
                    <>
                      <button onClick={salvarEdicao}>Salvar</button>
                      <button onClick={cancelarEdicao}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => iniciarEdicao(cat)}>Editar</button>
                      <button onClick={() => deletarCategoria(cat._id)}>Excluir</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminCategorias;
