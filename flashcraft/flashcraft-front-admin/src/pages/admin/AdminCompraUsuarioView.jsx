import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import apiAdmin from '../../services/apiAdmin';
import './AdminCompraUsuarioView.css';

const AdminCompraUsuario = () => {
  const [adminToken] = useState(localStorage.getItem('adminToken'));
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarioEmail, setSelectedUsuarioEmail] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [selectedProdutos, setSelectedProdutos] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from backend
    const fetchUsuarios = async () => {
      try {
        const response = await apiAdmin.get('/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    fetchUsuarios();
  }, []);

  useEffect(() => {
    // Fetch products from backend
    const fetchProdutos = async () => {
      try {
        const response = await apiAdmin.get('/produtos');
        setProdutos(response.data);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    fetchProdutos();
  }, []);

  useEffect(() => {
    // Calculate total price
    let newTotal = 0;
    selectedProdutos.forEach(produtoId => {
      const produto = produtos.find(p => p._id === produtoId);
      const quantity = quantities[produtoId] || 0;
      if (produto && quantity > 0) {
        newTotal += produto.preco * quantity;
      }
    });
    setTotal(newTotal);
  }, [selectedProdutos, quantities, produtos]);

  const handleProdutoChange = (produtoId) => {
    setMessage(null);
    if (selectedProdutos.includes(produtoId)) {
      setSelectedProdutos(selectedProdutos.filter(id => id !== produtoId));
      const newQuantities = { ...quantities };
      delete newQuantities[produtoId];
      setQuantities(newQuantities);
    } else {
      setSelectedProdutos([...selectedProdutos, produtoId]);
      setQuantities({ ...quantities, [produtoId]: 1 });
    }
  };

  const handleQuantityChange = (produtoId, value) => {
    setMessage(null);
    const quantity = parseInt(value, 10);
    if (quantity >= 0) {
      setQuantities({ ...quantities, [produtoId]: quantity });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUsuarioEmail) {
      setMessage({ type: 'error', text: 'Por favor, selecione um cliente.' });
      return;
    }
    if (selectedProdutos.length === 0) {
      setMessage({ type: 'error', text: 'Selecione pelo menos um produto.' });
      return;
    }
    const itens = selectedProdutos.map(produtoId => ({
      produtoId,
      quantidade: quantities[produtoId] || 1,
      precoPersonalizacao3D: parseFloat(quantities[`preco3d_${produtoId}`]) || 0,
    }));

    try {
      await apiAdmin.post('/compras', {
        emailCliente: selectedUsuarioEmail,
        itens,
        valorTotal: total,
      }, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      setMessage({ type: 'success', text: 'Compra criada com sucesso!' });
      // Navigate to dashboard to refresh chart
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Erro ao criar compra:', error);
      setMessage({ type: 'error', text: 'Erro ao criar compra. Verifique os dados e tente novamente.' });
    }
  };

  return (
    <AdminLayout>
      <div className="admin-compra-usuario">
        <h1>Compra em Nome do Usuário</h1>
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="usuarioSelect">Selecione o Cliente:</label>
            <select
              id="usuarioSelect"
              value={selectedUsuarioEmail}
              onChange={(e) => setSelectedUsuarioEmail(e.target.value)}
              required
            >
              <option value="">-- Selecione um cliente --</option>
              {usuarios.map(usuario => (
                <option key={usuario._id} value={usuario.email}>
                  {usuario.nome} ({usuario.email})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group produtos-list">
            <label>Produtos:</label>
            {produtos.length === 0 && <p>Carregando produtos...</p>}
            {produtos.map(produto => (
              <div key={produto._id} className="produto-item">
                <input
                  type="checkbox"
                  id={`produto-${produto._id}`}
                  checked={selectedProdutos.includes(produto._id)}
                  onChange={() => handleProdutoChange(produto._id)}
                />
                <label htmlFor={`produto-${produto._id}`}>
                  {produto.nome} - R$ {produto.preco.toFixed(2)}
                </label>
                {selectedProdutos.includes(produto._id) && (
                  <>
                    <input
                      type="number"
                      min="1"
                      value={quantities[produto._id] || 1}
                      onChange={(e) => handleQuantityChange(produto._id, e.target.value)}
                      className="quantity-input"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Preço Personalização 3D"
                      value={quantities[`preco3d_${produto._id}`] || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        setQuantities(prev => ({ ...prev, [`preco3d_${produto._id}`]: value }));
                      }}
                      className="price-3d-input"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="form-group total">
            <strong>Total: R$ {total.toFixed(2)}</strong>
          </div>
          <button type="submit" className="btn-submit">Registrar Compra</button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCompraUsuario;
