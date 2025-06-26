const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  destaque: { type: Boolean, default: false }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
