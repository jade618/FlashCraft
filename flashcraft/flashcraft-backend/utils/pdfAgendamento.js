const PDFDocument = require('pdfkit');
const fs = require('fs');

async function gerarPdfAgendamento(agendamento, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    doc
      .fontSize(20)
      .text('Confirmação de Agendamento – Cabine Fotográfica', { align: 'center' })
      .moveDown(2);

    doc
      .fontSize(12)
      .text(`Nome: ${agendamento.nome}`)
      .text(`E-mail: ${agendamento.email}`)
      .text(`Data e Hora: ${new Date(agendamento.dataHora).toLocaleString()}`)
      .moveDown();

    doc
      .fontSize(10)
      .text('Obrigado por agendar conosco! Apresente este comprovante no dia e horário marcados.', {
        align: 'justify'
      });

    doc.end();

    stream.on('finish', () => resolve());
    stream.on('error', reject);
  });
}

module.exports = gerarPdfAgendamento;
