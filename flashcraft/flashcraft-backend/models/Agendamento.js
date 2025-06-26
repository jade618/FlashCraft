const mongoose = require('mongoose');

const agendamentoSchema = new mongoose.Schema({
  nome: String,
  email: String,
  data: String,
  horario: String,
  tipo: String // Ex: cabine fotográfica, impressão 3D
});

module.exports = mongoose.model('Agendamento', agendamentoSchema);
