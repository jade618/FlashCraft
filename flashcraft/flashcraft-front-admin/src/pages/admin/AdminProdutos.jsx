import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminProdutos.css';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [tipo, setTipo] = useState('');
  const [disponivel, setDisponivel] = useState(true);
  const [categoria, setCategoria] = useState('');
  // Removendo a opção de nova categoria conforme solicitado
const [novaCategoria, setNovaCategoria] = useState('');
const [imagem, setImagem] = useState(null);

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    buscarProdutos();
    buscarCategorias();
  }, []);

  async function buscarProdutos() {
    const res = await fetch('http://localhost:3000/api/produtos');
    const dados = await res.json();
    setProdutos(dados);
  }

  async function buscarCategorias() {
    const res = await fetch('http://localhost:3000/api/categorias');
    const dados = await res.json();
    setCategorias(dados);
  }

  function handleImagem(e) {
    const file = e.target.files[0];
    setImagem(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e) {
  e.preventDefault();

  let categoriaFinalId = categoria;

  if (novaCategoria.trim()) {
    try {
      const res = await fetch('http://localhost:3000/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novaCategoria })
      });

      const tipo = res.headers.get('Content-Type') || '';
      if (!res.ok) {
        const erro = tipo.includes('application/json')
          ? await res.json()
          : await res.text();

        console.error('Erro ao criar categoria:', erro);
        alert('Erro ao criar categoria: ' + (erro.erro || erro));
        return;
      }

      const nova = await res.json();
      categoriaFinalId = nova._id;
    } catch (err) {
      console.error('Erro de rede ao criar categoria:', err);
      alert('Erro de rede ao criar categoria.');
      return;
    }
  }

  const form = new FormData();
  form.append('nome', nome);
  form.append('descricao', descricao);
  form.append('preco', preco);
  form.append('quantidade', quantidade);
  form.append('tipo', tipo);
  form.append('disponivel', disponivel);
  form.append('categoria', categoriaFinalId);
  if (imagem) form.append('imagem', imagem);

  const url = modoEdicao
    ? `http://localhost:3000/api/produtos/${editandoId}`
    : 'http://localhost:3000/api/produtos';

  const metodo = modoEdicao ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: metodo,
      body: form
    });

    const tipo = res.headers.get('Content-Type') || '';
    if (!res.ok) {
      const erro = tipo.includes('application/json')
        ? await res.json()
        : await res.text();

      console.error('Erro ao salvar produto:', erro);
      alert('Erro ao salvar produto: ' + (erro.erro || erro));
      return;
    }

    resetarFormulario();
    buscarProdutos();
    buscarCategorias();
  } catch (err) {
    console.error('Erro de rede ao salvar produto:', err);
    alert('Erro de rede ao salvar produto.');
  }
}


  function resetarFormulario() {
    setNome('');
    setDescricao('');
    setPreco('');
    setQuantidade(0);
    setTipo('');
    setDisponivel(true);
    setCategoria('');
    setNovaCategoria('');
    setImagem(null);
    setPreview(null);
    setModoEdicao(false);
    setEditandoId(null);
  }

  function editarProduto(prod) {
    setModoEdicao(true);
    setEditandoId(prod._id);
    setNome(prod.nome);
    setDescricao(prod.descricao);
    setPreco(prod.preco);
    setQuantidade(prod.quantidade);
    setTipo(prod.tipo);
    setDisponivel(prod.disponivel);
    setCategoria(prod.categoria?._id || prod.categoria);
    setPreview(prod.imagem || prod.imagemUrl || null);
  }

  async function deletarProduto(id) {
    if (!window.confirm('Deseja realmente excluir este produto?')) return;
    await fetch(`http://localhost:3000/api/produtos/${id}`, { method: 'DELETE' });
    buscarProdutos();
  }

  return (
    <AdminLayout>
      <div className="produtos-painel">
        <form className="form-produto" onSubmit={handleSubmit}>
          <h2>{modoEdicao ? 'Editar Produto' : 'Novo Produto'}</h2>

          <label>Nome
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required />
          </label>

          <label>Descrição
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={2} />
          </label>

          <label>Preço
            <input type="number" step="0.01" value={preco} onChange={e => setPreco(e.target.value)} required />
          </label>

          <label>Quantidade
            <input type="number" value={quantidade} onChange={e => setQuantidade(e.target.value)} min="0" />
          </label>

          <label>Tipo
            <select value={tipo} onChange={e => setTipo(e.target.value)} required>
              <option value="">Selecione</option>
              <option value="padrao">Padrão</option>
              <option value="personalizado">Personalizado</option>
              <option value="agendamento">Agendamento</option>
            </select>
          </label>

          <label>Categoria existente
            <select value={categoria} onChange={e => setCategoria(e.target.value)}>
              <option value="">Selecione</option>
              {categorias.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.nome}</option>
              ))}
            </select>
          </label>

          {/* Removendo a opção de nova categoria conforme solicitado */}
          {/*
          <label>Nova categoria (opcional)
            <input type="text" value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)} />
          </label>
          */}

          <label>
            <input type="checkbox" checked={disponivel} onChange={e => setDisponivel(e.target.checked)} />
            Produto disponível
          </label>

          <label>Imagem
            <input type="file" accept="image/*" onChange={handleImagem} />
          </label>

          {preview && (
            <div className="preview-img">
              <img src={preview} alt="Prévia" />
            </div>
          )}

          <div className="botoes-form">
            <button type="submit">{modoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto'}</button>
            {modoEdicao && (
              <button type="button" className="cancelar" onClick={resetarFormulario}>Cancelar</button>
            )}
          </div>
        </form>

        <div className="lista-produtos">
          <h2>Produtos</h2>
          <div className="grid-produtos">
            {produtos.map(prod => (
              <div key={prod._id} className="card-produto">
                <img src={prod.imagem || prod.imagemUrl || '/img/placeholder.png'} alt={prod.nome} />
                <h3>{prod.nome}</h3>
                <p className="descricao">{prod.descricao}</p>
                <span className="categoria">{prod.categoria?.nome || 'Sem categoria'}</span>
                <span className="preco">R$ {parseFloat(prod.preco).toFixed(2)}</span>
                <span className="estoque">{prod.quantidade} em estoque</span>
                <span className={`disponivel ${prod.disponivel ? 'ok' : 'off'}`}>
                  {prod.disponivel ? 'Disponível' : 'Indisponível'}
                </span>
                <div className="acoes">
                  <button onClick={() => editarProduto(prod)}>Editar</button>
                  <button className="remover" onClick={() => deletarProduto(prod._id)}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Produtos;
