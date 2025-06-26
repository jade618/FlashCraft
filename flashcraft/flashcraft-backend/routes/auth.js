const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// 📌 Cadastro de usuário
router.post('/cadastro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }

    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }

    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();

    return res.status(201).json({ mensagem: 'Usuário criado com sucesso.' });
  } catch (err) {
    console.error('Erro no cadastro:', err);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
});

// 📌 Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Email não encontrado.' });
    }

    const senhaOk = await usuario.compararSenha(senha);
    if (!senhaOk) {
      return res.status(401).json({ mensagem: 'Senha incorreta.' });
    }

    // 🎯 Aqui está o token com id, nome e email
    const token = jwt.sign(
      {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      usuario: { nome: usuario.nome, email: usuario.email },
      token
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ mensagem: 'Erro ao fazer login.' });
  }
});

module.exports = router;
