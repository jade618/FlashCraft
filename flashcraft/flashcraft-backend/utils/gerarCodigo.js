module.exports = function gerarCodigo(prefixo = 'FCRAFT') {
  const sufixo = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefixo}-${sufixo}`;
};
