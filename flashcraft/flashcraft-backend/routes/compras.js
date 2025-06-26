const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

const authUsuario = require('../middleware/authUsuario');
const authAdmin = require('../middleware/authAdmin');

router.get('/daily', compraController.getComprasDiarias);
router.get('/', authUsuario, compraController.getComprasUsuario);

// Rota para admin criar compra em nome de usuário
router.post('/', authAdmin, compraController.criarCompraAdmin);

router.get('/admin', authAdmin, compraController.getComprasAdmin);


module.exports = router;
