const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  nomeCliente: { type: String, required: true },
  emailCliente: { type: String, required: true },
  produto: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
    nome: String,
    imagem: String,
    preco: Number
  },
  quantidade: { type: Number, default: 1 },
  codigoFicha: { type: String, required: true },
  status: { type: String, default: 'Aguardando' }, // Aguardando, Em Produção, Pronto, Entregue...
  dataPedido: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
