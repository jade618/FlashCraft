const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Cadastrar novo usuário
exports.cadastrar = async (req, res) => {
  try {
    const { nome, email, senha, senhaPadrao } = req.body;
    const jaExiste = await Usuario.findOne({ email });
    if (jaExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    if (!senhaPadrao || senhaPadrao !== '123') {
      return res.status(400).json({ erro: 'Senha padrão incorreta.' });
    }

    const novoUsuario = new Usuario({ nome, email, senha });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Login de usuário
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Senha incorreta.' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

// Listar todos os usuários (para painel admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar usuários.' });
  }
};
