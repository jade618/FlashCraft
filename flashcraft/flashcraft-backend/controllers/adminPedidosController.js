const Pedido = require('../models/Pedido');
const Solicitacao3D = require('../models/Solicitacao3D');
const AgendamentoCabine = require('../models/AgendamentoCabine');
const enviarEmail = require('../utils/enviarEmail');

exports.listarPedidosSeparados = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('produto')
      .lean();

    const solicitacoes3D = await Solicitacao3D.find({}, 'nome email descricao linkReferencia imagemUrl status criadoEm').lean();
    const agendamentosCabine = await AgendamentoCabine.find().lean();

    res.json({ pedidos, solicitacoes3D, agendamentosCabine });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar pedidos' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, type, precoPersonalizacao3D } = req.body;

    if (!status || !type) {
      return res.status(400).json({ error: 'Status e tipo são obrigatórios' });
    }

    let model;
    if (type === 'pedido') {
      model = Pedido;
    } else if (type === 'solicitacao') {
      model = Solicitacao3D;
    } else if (type === 'agendamento') {
      model = AgendamentoCabine;
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const item = await model.findById(id);
    if (!item) {
      return res.status(404).json({ error: `${type} não encontrado` });
    }

    // Update precoPersonalizacao3D if provided and type is pedido
    if (type === 'pedido' && precoPersonalizacao3D !== undefined) {
      item.precoPersonalizacao3D = precoPersonalizacao3D;
    }

    // Only update status if different to avoid unnecessary save
    if (item.status !== status.toLowerCase()) {
      item.status = status.toLowerCase();

      // If status is 'entregue', move pedido to Compra collection and delete from Pedido
      if (item.status === 'entregue') {
        const Compra = require('../models/Compra');
        const Usuario = require('../models/Usuario');

        // Find user by emailCliente if exists
        let usuario = null;
        if (item.usuario) {
          // If item.usuario is an ObjectId object, get its string value
          const usuarioId = typeof item.usuario === 'object' && item.usuario._id ? item.usuario._id : item.usuario;
          usuario = await Usuario.findById(usuarioId);
        } else if (item.emailCliente) {
          // If emailCliente exists, try to find user by email only
          usuario = await Usuario.findOne({ email: item.emailCliente });
          console.log('Pedido:', item);
          console.log('Usuário encontrado:', usuario);
        }

        // If no user found, assign a default user or throw error
        if (!usuario) {
          console.error('Usuário não encontrado para o pedido:', item);
          throw new Error('Usuário é obrigatório para criar uma compra');
        }

        // Prepare product info array for Compra
        let produtosArray = [];

        if (type === 'pedido') {
          produtosArray = [
            {
              nome: item.produto?.nome || 'Produto não informado',
              preco: (item.precoPersonalizacao3D !== undefined && item.precoPersonalizacao3D > 0) ? item.precoPersonalizacao3D : (item.produto?.preco || 0),
              quantidade: item.quantidade || 1
            }
          ];
        } else if (type === 'solicitacao') {
          produtosArray = [
            {
              nome: item.descricao || 'Solicitação 3D',
              preco: 0,
              quantidade: 1
            }
          ];
        } else if (type === 'agendamento') {
          produtosArray = [
            {
              nome: 'Agendamento de Cabine Fotográfica',
              preco: 0,
              quantidade: 1
            }
          ];
        } else {
          produtosArray = [];
        }

        // Create new Compra document with relevant data from pedido
        const novaCompra = new Compra({
          usuario: usuario ? usuario._id : null,
          produtos: produtosArray,
          total: produtosArray.reduce((acc, p) => acc + (p.preco * p.quantidade), 0),
          data: new Date()
        });

        await novaCompra.save();

        // Delete the pedido from its collection
        await model.findByIdAndDelete(id);
      } else {
        await item.save();
      }
    } else {
      // Save precoPersonalizacao3D update if status not changed
      if (type === 'pedido' && precoPersonalizacao3D !== undefined) {
        await item.save();
      }
    }

    // Send email notification
    const email = item.email || item.emailCliente;
    const nome = item.nome || item.nomeCliente;
    const assunto = 'Atualização do status do seu pedido';
    // Include codigoFicha in the email message if available
    const codigoCompra = item.codigoFicha ? `Código da compra: ${item.codigoFicha}\n\n` : '';
    const mensagem = `Olá ${nome},\n\n${codigoCompra}O status do seu pedido foi atualizado para: ${status}.\n\nAtenciosamente,\nEquipe FlashCraft`;

    if (!email) {
      return res.status(400).json({ error: 'Email do destinatário não encontrado' });
    }

    await enviarEmail(process.env.EMAIL_ORIGEM, email, assunto, { nome, mensagem });

    res.json({ message: 'Status atualizado com sucesso e email enviado', item });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
};

exports.cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Tipo é obrigatório' });
    }

    let model;
    if (type === 'pedido') {
      model = Pedido;
    } else if (type === 'solicitacao') {
      model = Solicitacao3D;
    } else if (type === 'agendamento') {
      model = AgendamentoCabine;
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    const item = await model.findById(id);
    if (!item) {
      return res.status(404).json({ error: `${type} não encontrado` });
    }

    // If type is 'pedido', increment product stock and delete pedido
    if (type === 'pedido') {
      const Produto = require('../models/Produto');
      // item.produto is an object, need to get its id
      const produtoId = item.produto.id || item.produto._id || item.produto;
      const produto = await Produto.findById(produtoId);
      if (produto) {
        produto.estoque = (produto.estoque || 0) + (item.quantidade || 1);
        await produto.save();
      }
      await model.findByIdAndDelete(id);
    } else if (type === 'solicitacao') {
      // For solicitacao, no stock increment, just delete
      await model.findByIdAndDelete(id);
    } else if (type === 'agendamento') {
      // For agendamento, no stock increment, just delete
      await model.findByIdAndDelete(id);
    } else {
      // For other types, just update status to 'cancelado'
      item.status = 'cancelado';
      await item.save();
    }

    // Send email notification
    const email = item.email || item.emailCliente;
    const nome = item.nome || item.nomeCliente;
    const assunto = 'Cancelamento do seu pedido';
    const mensagem = `Olá ${nome},\n\nSeu pedido foi cancelado.\n\nAtenciosamente,\nEquipe FlashCraft`;

    if (!email) {
      return res.status(400).json({ error: 'Email do destinatário não encontrado' });
    }

    await enviarEmail(process.env.EMAIL_ORIGEM, email, assunto, { nome, mensagem });

    res.json({ message: 'Pedido cancelado com sucesso e email enviado', item });
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    res.status(500).json({ error: 'Erro ao cancelar pedido' });
  }
};
