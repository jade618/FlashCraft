const Produto = require('../models/Produto');

// Criar produto
exports.criarProduto = async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    const salvo = await novoProduto.save();
    res.status(201).json(salvo);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao criar produto', detalhes: erro.message });
  }
};

// Listar todos com categoria
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.find().populate('categoria');
    res.json(produtos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar produtos' });
  }
};

// Buscar por ID
exports.buscarProdutoPorId = async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id).populate('categoria');
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
    res.json(produto);
  } catch (erro) {
    res.status(400).json({ erro: 'ID inválido' });
  }
};

// (Opcional) Deletar
exports.deletarProduto = async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao deletar produto' });
  }
};
