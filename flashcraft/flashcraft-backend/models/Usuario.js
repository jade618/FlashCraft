// 📁 models/Usuario.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    senha: { type: String, required: true, minlength: 6 }
  },
  { timestamps: true }
);

// 🔐 Criptografar senha antes de salvar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// 🔍 Método para comparar senha
usuarioSchema.methods.compararSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
