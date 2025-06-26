const express = require('express');
const router = express.Router();
const { criarAdmin, loginAdmin } = require('../controllers/adminController');

router.post('/cadastrar', criarAdmin); // pode desativar depois
router.post('/login', loginAdmin);

module.exports = router;
