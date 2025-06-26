// 📁 flashcraft-backend/models/AgendamentoCabine.js
const mongoose = require('mongoose');

const agendamentoCabineSchema = new mongoose.Schema({
  nome:      { type: String, required: true },
  email:     { type: String, required: true },
  dataHora:  { type: Date,   required: true },
  criadoEm:  { type: Date,   default: Date.now }
});

module.exports = mongoose.model('AgendamentoCabine', agendamentoCabineSchema);
