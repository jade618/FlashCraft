const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const authAdmin = require('../middleware/authAdmin');

// Endpoint para admin gerar token JWT para um usuário específico
router.post('/generate-user-token', authAdmin, async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ erro: 'userId é obrigatório' });
  }

  try {
    const usuario = await Usuario.findById(userId);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    const token = jwt.sign(
      {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('Erro ao gerar token para usuário:', err);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
