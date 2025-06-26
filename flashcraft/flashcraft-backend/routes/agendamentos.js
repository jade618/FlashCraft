const express = require('express');
const router = express.Router();

// Esse require precisa bater com o NOME real do arquivo (inclusive maiúsculas e minúsculas)
const {
  listarAgendamentos,
  criarAgendamento
} = require('../controllers/agendamentoController'); // ← esse é o que mais causa erro

router.get('/', listarAgendamentos);
router.post('/', criarAgendamento);

module.exports = router;
