const express = require('express');
const router = express.Router();
const {
  cadastrar,
  login,
  listarUsuarios
} = require('../controllers/usuarioController');

router.post('/cadastrar', cadastrar);
router.post('/login', login);
router.get('/', listarUsuarios); // ← essa linha permite o GET /usuarios

module.exports = router;
