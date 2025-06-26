const express = require('express');
const router = express.Router();
const { criarComentario, listarComentarios } = require('../controllers/comentarioController');
const authUsuario = require('../middleware/authUsuario');

router.post('/', authUsuario, criarComentario);
router.get('/:produtoId', listarComentarios);

module.exports = router;
