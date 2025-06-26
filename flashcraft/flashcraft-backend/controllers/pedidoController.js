const Pedido = require('../models/Pedido'); // padrão
const Solicitacao3D = require('../models/Solicitacao3D'); // personalizado
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

exports.criarPedido = async (req, res) => {
  try {
    const { nomeCliente, emailCliente, produto, quantidade = 1 } = req.body;

    if (!produto || !produto.id) {
      return res.status(400).json({ erro: 'Dados do produto são obrigatórios.' });
    }

    const novoPedido = new Pedido({
      nomeCliente,
      emailCliente,
      produto,
      quantidade,
      codigoFicha: uuidv4().slice(0, 8)
    });

    const pedidoSalvo = await novoPedido.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ORIGEM,
        pass: process.env.EMAIL_SENHA_APP
      }
    });

    const mailOptions = {
      from: `"FlashCraft" <${process.env.EMAIL_ORIGEM}>`,
      to: emailCliente,
      subject: 'Confirmação do seu pedido',
      text: `Olá ${nomeCliente},\n\nSeu pedido para o produto "${produto.nome}" foi recebido com sucesso.\nQuantidade: ${quantidade}\nCódigo do pedido: ${pedidoSalvo.codigoFicha}\n\nObrigado por comprar conosco!\n\nAtenciosamente,\nEquipe FlashCraft`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json(pedidoSalvo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar pedido.' });
  }
};

exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    const solicitacoes3D = await Solicitacao3D.find();
    const todosPedidos = [...pedidos, ...solicitacoes3D];
    res.json(todosPedidos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar pedidos' });
  }
};

exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let pedido = await Pedido.findById(id);
    if (!pedido) {
      pedido = await Solicitacao3D.findById(id);
      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }
    }

    pedido.status = status;
    await pedido.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ORIGEM,
        pass: process.env.EMAIL_SENHA_APP
      }
    });

    const mailOptions = {
      from: `"FlashCraft" <${process.env.EMAIL_ORIGEM}>`,
      to: pedido.email,
      subject: 'Atualização do status do seu pedido',
      text: `Olá ${pedido.nome || pedido.nomeCliente},\n\nO status do seu pedido foi atualizado para: ${status}.\n\nAtenciosamente,\nEquipe FlashCraft`
    };

    await transporter.sendMail(mailOptions);

    res.json({ mensagem: 'Status atualizado e email enviado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar status do pedido' });
  }
};

exports.cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    let pedido = await Pedido.findById(id);
    if (!pedido) {
      pedido = await Solicitacao3D.findById(id);
      if (!pedido) {
        return res.status(404).json({ erro: 'Pedido não encontrado' });
      }
    }

    pedido.status = 'cancelado';
    await pedido.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ORIGEM,
        pass: process.env.EMAIL_SENHA_APP
      }
    });

    const mailOptions = {
      from: `"FlashCraft" <${process.env.EMAIL_ORIGEM}>`,
      to: pedido.email,
      subject: 'Cancelamento do seu pedido',
      text: `Olá ${pedido.nome || pedido.nomeCliente},\n\nSeu pedido foi cancelado.\n\nAtenciosamente,\nEquipe FlashCraft`
    };

    await transporter.sendMail(mailOptions);

    res.json({ mensagem: 'Pedido cancelado e email enviado' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao cancelar pedido' });
  }
};

exports.criarPedidoPersonalizado = async (req, res) => {
  try {
    const { nome, email, descricao, linkReferencia } = req.body;

    if (!nome || !email || !descricao) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }

    const novoPedido = new Solicitacao3D({
      nome,
      email,
      descricao,
      linkReferencia
    });

    await novoPedido.save();

    res.status(201).json({ mensagem: 'Pedido criado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro interno ao processar pedido personalizado' });
  }
};

exports.listarPedidosPorEmail = async (email) => {
  try {
    const pedidos = await Pedido.find({ emailCliente: email }).lean();
    const solicitacoes3D = await Solicitacao3D.find({ email }).lean();
    return [...pedidos, ...solicitacoes3D];
  } catch (error) {
    throw new Error('Erro ao listar pedidos do usuário');
  }
};
