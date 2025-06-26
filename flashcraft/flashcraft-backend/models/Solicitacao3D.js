const mongoose = require('mongoose');

const solicitacao3DSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true },
  descricao: { type: String, required: true },
  linkReferencia: { type: String },
  imagemUrl: { type: String },
  status: { type: String, default: 'Aguardando Produção' }, // ← NOVO!
  criadoEm: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Solicitacao3D', solicitacao3DSchema);
