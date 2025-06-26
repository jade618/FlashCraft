const Solicitacao3D = require('../models/Solicitacao3D');
const gerarPDFSolicitacao = require('../utils/pdfSolicitacao3D'); // usa o arquivo correto!
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const os = require('os');

exports.criarSolicitacao = async (req, res) => {
  try {
    const { nome, email, descricao, linkReferencia } = req.body;
    const imagemUrl = req.file?.path || null;

    if (!nome || !email || !descricao) {
      return res.status(400).json({ erro: 'Campos obrigatórios não preenchidos.' });
    }

    // Add user association if available
    const usuarioId = req.usuario ? req.usuario._id : null;

    const solicitacao = new Solicitacao3D({
      nome,
      email,
      descricao,
      linkReferencia,
      imagemUrl,
      usuario: usuarioId
    });

    await solicitacao.save();

    // 📄 Gera o PDF com o util atualizado (com aviso final incluso)
    const caminhoPDF = path.join(os.tmpdir(), `solicitacao-${solicitacao._id}.pdf`);
    await gerarPDFSolicitacao(solicitacao, caminhoPDF);

    // 📧 Envia o e-mail com o PDF em anexo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ORIGEM,
        pass: process.env.EMAIL_SENHA_APP
      }
    });

    await transporter.sendMail({
      from: `"FlashCraft" <${process.env.EMAIL_ORIGEM}>`,
      to: email,
      subject: '🎉 Sua solicitação 3D foi recebida!',
      text: `Olá ${nome},\n\nSua ideia foi registrada com sucesso! O produto será entregue durante o evento da escola.\nVocê receberá atualizações por e-mail caso haja alguma mudança.\n\nConfira o PDF em anexo com os detalhes do seu pedido.\n\nEquipe FlashCraft`,
      attachments: [
        {
          filename: 'solicitacao_3d.pdf',
          path: caminhoPDF
        }
      ]
    });

    // 🧼 Limpa o PDF temporário
    fs.unlinkSync(caminhoPDF);

    // Retorna o objeto salvo (pode ser útil pra exibir no frontend diretamente)
    res.status(201).json({ mensagem: 'Solicitação enviada com sucesso!', solicitacao });
  } catch (err) {
    console.error('Erro ao processar solicitação 3D:', err);
    res.status(500).json({ erro: 'Erro ao processar a solicitação.' });
  }
};

exports.listarSolicitacoes = async (req, res) => {
  try {
    const solicitacoes = await Solicitacao3D.find();
    res.status(200).json(solicitacoes);
  } catch (err) {
    console.error('Erro ao listar solicitações 3D:', err);
    res.status(500).json({ erro: 'Erro ao listar as solicitações.' });
  }
};

exports.listarSolicitacoesPorUsuario = async (req, res) => {
  try {
    if (!req.usuario || !req.usuario.email) {
      return res.status(401).json({ erro: 'Usuário não autenticado' });
    }
    const emailUsuario = req.usuario.email;
    const solicitacoes = await Solicitacao3D.find({ email: emailUsuario }).lean();
    res.status(200).json(solicitacoes);
  } catch (err) {
    console.error('Erro ao listar solicitações 3D do usuário:', err);
    res.status(500).json({ erro: 'Erro ao listar as solicitações do usuário.' });
  }
};
