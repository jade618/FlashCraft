const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

module.exports = async function gerarPdf(pedido) {
  const doc = new PDFDocument();
  const caminho = path.join(__dirname, '..', 'uploads', `${pedido.codigoFicha}.pdf`);
  doc.pipe(fs.createWriteStream(caminho));

  doc.fontSize(22).text(`FlashCraft - Pedido ${pedido.codigoFicha}`, { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Cliente: ${pedido.nomeCliente}`);
  doc.text(`Produto: ${pedido.produto.nome}`);
  doc.text(`Quantidade: ${pedido.quantidade}`);
  doc.text(`Preço: R$ ${pedido.produto.preco.toFixed(2)}`);
  doc.text(`Status: ${pedido.status}`);
  doc.text(`Data: ${new Date(pedido.dataPedido).toLocaleDateString('pt-BR')}`);

  doc.end();
  return caminho;
};
