const express = require('express');
const router = express.Router();
const adminPedidosController = require('../controllers/adminPedidosController');
const authAdmin = require('../middleware/authAdmin');

router.get('/', authAdmin, adminPedidosController.listarPedidosSeparados);

// Add route for updating pedido status
router.put('/:id/status', authAdmin, adminPedidosController.updateStatus);

// Add route for canceling pedido
router.put('/:id/cancelar', authAdmin, adminPedidosController.cancelarPedido);

module.exports = router;
