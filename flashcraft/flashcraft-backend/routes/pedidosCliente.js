const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const authUsuario = require('../middleware/authUsuario');

// Create a new order
router.post('/', authUsuario, pedidoController.criarPedido);

// List orders for authenticated user
router.get('/', authUsuario, async (req, res) => {
  try {
    const emailUsuario = req.usuario.email;
    const pedidos = await pedidoController.listarPedidosPorEmail(emailUsuario);
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar pedidos do usuário' });
  }
});

// Update order status (optional, if allowed for user)
router.put('/:id/status', authUsuario, pedidoController.atualizarStatus);

// Cancel order
router.put('/:id/cancelar', authUsuario, pedidoController.cancelarPedido);

module.exports = router;
