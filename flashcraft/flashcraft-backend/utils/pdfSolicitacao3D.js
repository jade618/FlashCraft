const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function gerarPDFSolicitacao(solicitacao, caminhoArquivo) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const stream = fs.createWriteStream(caminhoArquivo);
    doc.pipe(stream);

    // 🔗 Caminho da logo (ex: /public/logo.png)
    const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { width: 100, align: 'center' }).moveDown();
    }

    // Título estilizado
    doc
      .fillColor('#ff005c')
      .fontSize(22)
      .text('Solicitação de Produto 3D Personalizado', {
        align: 'center'
      })
      .moveDown();

    // Dados principais
    doc
      .fontSize(12)
      .fillColor('#000')
      .text(`Data: ${new Date(solicitacao.criadoEm).toLocaleDateString()}`)
      .text(`Nome: ${solicitacao.nome}`)
      .text(`E-mail: ${solicitacao.email}`)
      .moveDown()
      .text(`Descrição:`)
      .font('Times-Roman')
      .text(solicitacao.descricao, {
        align: 'justify',
        indent: 10
      })
      .moveDown();

    // Link (se houver)
    if (solicitacao.linkReferencia) {
      doc
        .fillColor('#007BFF')
        .text(`Link de Referência: ${solicitacao.linkReferencia}`, {
          link: solicitacao.linkReferencia,
          underline: true
        })
        .moveDown();
    }

    // Separador e aviso final
    doc
      .strokeColor('#ccc')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown();

    doc
      .fontSize(11)
      .fillColor('#000')
      .text(
        'Observação: o produto será entregue durante o evento da escola. Quaisquer atualizações importantes serão enviadas para o seu e-mail de cadastro.',
        {
          align: 'justify'
        }
      );

    doc.end();

    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

module.exports = gerarPDFSolicitacao;
