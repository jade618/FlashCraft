const express = require('express');
const router = express.Router();
const Produto = require('../models/Produto');
const Categoria = require('../models/Categoria');
const auth = require('../routes/auth'); // ou '../middlewares/auth' dependendo do local
const multer = require('multer');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'produtos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage });


// GET /api/produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find().populate('categoria');
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ erro: 'Erro ao buscar produtos.' });
  }
});

// POST /api/produtos
router.post('/', auth, upload.single('imagem'), async (req, res) => {
  try {
    const {
      nome,
      descricao,
      preco,
      quantidade,
      tipo,
      disponivel,
      categoria
    } = req.body;

    if (!nome || !preco || !tipo || !categoria) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
    }

    let categoriaId = categoria;
    if (!categoria.match(/^[0-9a-fA-F]{24}$/)) {
      const novaCat = await Categoria.create({ nome: categoria });
      categoriaId = novaCat._id;
    }

    const novoProduto = new Produto({
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      tipo,
      disponivel: disponivel === 'true' || disponivel === true,
      categoria: categoriaId
    });

    if (req.file) {
      novoProduto.imagem = req.file.path;
    }

    await novoProduto.save();

    res.status(201).json(novoProduto);
  } catch (err) {
    console.error('Erro ao criar produto:', err);
    res.status(500).json({ erro: 'Erro interno ao criar o produto.' });
  }
});

// DELETE /api/produtos/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByIdAndDelete(id);

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    res.json({ mensagem: 'Produto excluído com sucesso.' });
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).json({ erro: 'Erro interno ao excluir o produto.' });
  }
});


// PUT /api/produtos/:id
router.put('/:id', auth, upload.single('imagem'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      descricao,
      preco,
      quantidade,
      tipo,
      disponivel,
      categoria
    } = req.body;

    if (!nome || !preco || !tipo || !categoria) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes.' });
    }

    let categoriaId = categoria;
    if (!categoria.match(/^[0-9a-fA-F]{24}$/)) {
      const novaCat = await Categoria.create({ nome: categoria });
      categoriaId = novaCat._id;
    }

    const dadosAtualizados = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
      tipo,
      disponivel: disponivel === 'true' || disponivel === true,
      categoria: categoriaId
    };

    if (req.file) {
      dadosAtualizados.imagem = req.file.path;
    }

    const produto = await Produto.findByIdAndUpdate(id, dadosAtualizados, { new: true });

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    res.json(produto);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ erro: 'Erro interno ao atualizar o produto.' });
  }
});


// GET /api/produtos/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validação: ID precisa ser um ObjectId válido do MongoDB
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ erro: 'ID de produto inválido.' });
  }

  try {
    const produto = await Produto.findById(id).populate('categoria');

    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }

    res.json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto por ID:', err);
    res.status(500).json({ erro: 'Erro interno ao buscar produto.' });
  }
});


module.exports = router;
