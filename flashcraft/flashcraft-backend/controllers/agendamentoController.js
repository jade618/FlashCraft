// Atenção: o nome deste arquivo deve ser exatamente "agendamentoController.js"
const AgendamentoCabine   = require('../models/AgendamentoCabine');
const gerarPdfAgendamento = require('../utils/pdfAgendamento');
const nodemailer          = require('nodemailer');
const os                  = require('os');
const path                = require('path');
const fs                  = require('fs');

async function listarAgendamentos(req, res) {
  try {
    const lista = await AgendamentoCabine.find().sort({ dataHora: -1 });
    return res.json(lista);
  } catch (err) {
    console.error('Erro ao listar agendamentos:', err);
    return res.status(500).json({ erro: 'Erro ao listar agendamentos.' });
  }
}

async function criarAgendamento(req, res) {
  try {
    const { nome, email, dataHora } = req.body;
    if (!nome || !email || !dataHora) {
      return res.status(400).json({ erro: 'Nome, email e data/hora são obrigatórios.' });
    }

    const data = new Date(dataHora);
    if (await AgendamentoCabine.findOne({ dataHora: data })) {
      return res.status(400).json({ erro: 'Este horário já foi reservado.' });
    }

    // Add user association if available
    const usuarioId = req.usuario ? req.usuario._id : null;

    const novo = new AgendamentoCabine({ nome, email, dataHora: data, usuario: usuarioId });
    await novo.save();

    // Gera PDF temporário
    const tmpPath = path.join(os.tmpdir(), `agendamento-${novo._id}.pdf`);
    await gerarPdfAgendamento(novo, tmpPath);

    // Envia e-mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ORIGEM,
        pass: process.env.EMAIL_SENHA_APP
      }
    });

    await transporter.sendMail({
      from: `"FlashCraft" <${process.env.EMAIL_ORIGEM}>`,
      to: novo.email,
      subject: '🗓️ Confirmação de Agendamento – Cabine Fotográfica',
      text: `Olá ${novo.nome},\n\nSeu agendamento para ${new Date(novo.dataHora).toLocaleString()} foi confirmado!`,
      attachments: [
        { filename: 'agendamento.pdf', path: tmpPath }
      ]
    });

    // Apaga o PDF temporário
    fs.unlinkSync(tmpPath);

    return res
      .status(201)
      .json({ 
        mensagem: 'Agendamento confirmado e e-mail enviado.', 
        agendamento: novo 
      });
  } catch (err) {
    console.error('Erro ao criar agendamento:', err);
    return res.status(500).json({ erro: 'Erro ao criar agendamento.' });
  }
}

module.exports = {
  listarAgendamentos,
  criarAgendamento
};
