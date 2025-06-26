const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true },
  imagem: { type: String },
  quantidade: { type: Number, default: 0 },
  disponivel: { type: Boolean, default: true },

  tipo: {
    type: String,
    enum: ['padrao', 'personalizado', 'agendamento'],
    required: true
  },

  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria'
  },

  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produto', produtoSchema);
