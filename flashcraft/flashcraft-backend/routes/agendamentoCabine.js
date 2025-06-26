const express = require('express');
const router  = express.Router();
const authUsuario = require('../middleware/authUsuario');
const {
  listarAgendamentos,
  criarAgendamento
} = require('../controllers/agendamentoController');

// Rota pública (GET todos os agendamentos)
router.get('/', listarAgendamentos);

// Rota pública (POST novo agendamento)
router.post('/', criarAgendamento);

// ✅ Rota protegida — retorna apenas agendamentos do usuário logado
router.get('/usuario', authUsuario, async (req, res) => {
  try {
    const email = req.usuario.email;
    const lista = await require('../models/AgendamentoCabine')
      .find({ email })
      .sort({ dataHora: -1 });
    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar agendamentos do usuário:', err);
    res.status(500).json({ erro: 'Erro ao buscar seus agendamentos.' });
  }
});

module.exports = router;
