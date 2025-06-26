const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Rotas principais
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/admins', require('./routes/admins'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/produtos', require('./routes/produtos'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/pedidosCliente', require('./routes/pedidosCliente'));
app.use('/api/comentarios', require('./routes/comentarios'));
app.use('/api/agendamentos', require('./routes/agendamentos'));
app.use('/api/categorias', require('./routes/categoriaRoutes'));
app.use('/api/compras', require('./routes/compras'));
app.use('/api/solicitacoes3d', require('./routes/solicitacoes3d'));
app.use('/api/cabine', require('./routes/agendamentoCabine'));
app.use('/api/adminToken', require('./routes/adminToken'));
app.use('/uploads', express.static('uploads'));


module.exports = app;


