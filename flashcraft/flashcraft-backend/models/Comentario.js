const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  nota: { type: Number, min: 1, max: 5, required: true },
  texto: String,
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comentario', comentarioSchema);
