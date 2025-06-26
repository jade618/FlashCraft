const Categoria = require('../models/Categoria');

// Criar nova categoria
exports.criarCategoria = async (req, res) => {
  try {
    const novaCategoria = new Categoria(req.body);
    const salva = await novaCategoria.save();
    res.status(201).json(salva);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao criar categoria', detalhes: erro.message });
  }
};

// Listar todas as categorias
exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.json(categorias);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar categorias' });
  }
};

// (Opcional) Buscar categoria por ID
exports.buscarCategoriaPorId = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (erro) {
    res.status(400).json({ erro: 'ID inválido' });
  }
};

// Atualizar categoria por ID
exports.atualizarCategoria = async (req, res) => {
  try {
    const categoriaAtualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!categoriaAtualizada) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json(categoriaAtualizada);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao atualizar categoria', detalhes: erro.message });
  }
};

// Deletar categoria por ID
exports.deletarCategoria = async (req, res) => {
  try {
    const categoriaDeletada = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoriaDeletada) return res.status(404).json({ erro: 'Categoria não encontrada' });
    res.json({ mensagem: 'Categoria deletada com sucesso' });
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao deletar categoria', detalhes: erro.message });
  }
};
