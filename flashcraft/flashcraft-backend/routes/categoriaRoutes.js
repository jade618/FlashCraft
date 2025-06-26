const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

router.post('/', categoriaController.criarCategoria);
router.get('/', categoriaController.listarCategorias);
router.get('/:id', categoriaController.buscarCategoriaPorId); // opcional

router.put('/:id', categoriaController.atualizarCategoria);
router.delete('/:id', categoriaController.deletarCategoria);

module.exports = router;
