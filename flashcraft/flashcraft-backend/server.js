const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nomeDoBanco', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado ao MongoDB com sucesso!');
  
  // Só inicia o servidor depois que a conexão for feita
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
})
.catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
});
