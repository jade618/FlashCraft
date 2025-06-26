const Compra = require('../models/Compra');
const enviarEmail = require('../utils/enviarEmail');
const Usuario = require('../models/Usuario'); // Ensure Usuario model is imported

exports.getComprasDiarias = async (req, res) => {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const compras = await Compra.aggregate([
      {
        $match: {
          data: { $gte: hoje }
        }
      },
      {
        $unwind: "$produtos"
      },
      {
        $group: {
          _id: { $hour: "$data" },
          total: { $sum: "$total" },
          quantidade: { $sum: "$produtos.quantidade" }
        }
      },
      {
        $project: {
          hora: "$_id",
          total: 1,
          quantidade: 1,
          _id: 0
        }
      },
      {
        $sort: { hora: 1 }
      }
    ]);

    res.json(compras);
  } catch (error) {
    console.error('Erro em getComprasDiarias:', error);
    res.status(500).json({ erro: 'Erro ao obter compras diárias.' });
  }
};

exports.getComprasUsuario = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario.email) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    const emailUsuario = req.usuario.email;
    const compras = await Compra.find({ emailCliente: emailUsuario }).lean();
    res.json(compras);
  } catch (error) {
    console.error('Erro em getComprasUsuario:', error);
    res.status(500).json({ erro: 'Erro ao obter compras do usuário.' });
  }
};

exports.criarCompraAdmin = async (req, res) => {
  try {
    const { emailCliente, itens, valorTotal } = req.body;

    if (!emailCliente || !itens || !valorTotal) {
      return res.status(400).json({ erro: 'Dados incompletos para criar compra.' });
    }

    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ email: emailCliente });
    if (!usuario) {
      return res.status(400).json({ erro: 'Usuário não encontrado para a compra.' });
    }

    // Set status 'entregue' for each product item
    const produtosComStatus = itens.map(item => ({
      ...item,
      status: 'entregue'
    }));

    const novaCompra = new Compra({
      usuario: usuario._id,
      produtos: produtosComStatus,
      total: valorTotal,
      criadoPorAdmin: true,
      criadoEm: new Date()
    });

    await novaCompra.save();

    // Send email notification to user
    const assunto = 'Confirmação da sua compra';
    const nome = usuario.nome || 'Cliente';
    const mensagem = `Olá ${nome},\n\nSua compra foi registrada com sucesso.\n\nAtenciosamente,\nEquipe FlashCraft`;

    if (usuario.email) {
      await enviarEmail(process.env.EMAIL_ORIGEM, usuario.email, assunto, { nome, mensagem });
    }

    res.status(201).json({ mensagem: 'Compra criada com sucesso pelo admin e email enviado.', compra: novaCompra });
  } catch (error) {
    console.error('Erro em criarCompraAdmin:', error);
    res.status(500).json({ erro: 'Erro ao criar compra pelo admin.' });
  }
};

exports.getComprasAdmin = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    // Build filter for produtos array elements
    let produtoFilter = {};
    if (category) {
      produtoFilter.categoria = category;
    }
    if (minPrice || maxPrice) {
      produtoFilter.preco = {};
      if (minPrice) produtoFilter.preco.$gte = parseFloat(minPrice);
      if (maxPrice) produtoFilter.preco.$lte = parseFloat(maxPrice);
    }

    // Find compras with produtos matching filter
    const compras = await Compra.find({
      'produtos': { $elemMatch: produtoFilter }
    })
      .populate('usuario')
      .lean();

    // For each compra, filter produtos array by filter
    const filteredCompras = compras.map(compra => {
      const filteredProdutos = compra.produtos.filter(produto => {
        if (category && produto.categoria !== category) return false;
        if (minPrice && produto.preco < parseFloat(minPrice)) return false;
        if (maxPrice && produto.preco > parseFloat(maxPrice)) return false;
        return true;
      });
      return { ...compra, produtos: filteredProdutos };
    });

    res.json(filteredCompras);
  } catch (error) {
    console.error('Erro em getComprasAdmin:', error);
    res.status(500).json({ erro: 'Erro ao obter compras para admin.' });
  }
};
