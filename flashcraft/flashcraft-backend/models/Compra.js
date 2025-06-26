const mongoose = require('mongoose');
const connectSalesDB = require('../config/dbSales');

const salesConnection = connectSalesDB();

const compraSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  produtos: [
    {
      nome: String,
      preco: Number,
      quantidade: Number,
      status: {
        type: String,
        default: 'entregue'  // Default status set to 'entregue' for local purchases
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    default: Date.now
  }
});

module.exports = salesConnection.model('Compra', compraSchema);
