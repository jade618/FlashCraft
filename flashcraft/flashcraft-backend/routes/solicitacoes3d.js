const express = require('express');
const router = express.Router();
const authUsuario = require('../middleware/authUsuario');
const { criarSolicitacao, listarSolicitacoes, listarSolicitacoesPorUsuario } = require('../controllers/solicitacao3DController');
const upload = require('../middleware/uploadCloudinary');

// Rota POST para criar solicitação
router.post('/', authUsuario, upload.single('arquivo'), criarSolicitacao);

// Rota GET para listar todas as solicitações (admin)
router.get('/', authUsuario, listarSolicitacoes);

// Rota GET para listar solicitações do usuário autenticado
router.get('/usuario', authUsuario, listarSolicitacoesPorUsuario);

module.exports = router;
