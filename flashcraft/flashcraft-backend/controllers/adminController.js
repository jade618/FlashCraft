const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ erro: 'Admin não encontrado.' });

    const senhaCorreta = await admin.compararSenha(senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Senha incorreta.' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, nome: admin.nome } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.criarAdmin = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const existe = await Admin.findOne({ email });
    if (existe) return res.status(400).json({ erro: 'Email já está cadastrado.' });

    const novo = new Admin({ nome, email, senha });
    await novo.save();
    res.status(201).json({ mensagem: 'Admin cadastrado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
