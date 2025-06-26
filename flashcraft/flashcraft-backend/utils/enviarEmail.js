const nodemailer = require('nodemailer');

const enviarEmail = async (de, para, assunto, dados) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ORIGEM,
      pass: process.env.EMAIL_SENHA_APP
    }
  });

  const htmlBody = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>📦 Nova Solicitação de Modelo 3D</h2>
      <p><strong>Nome:</strong> ${dados.nome}</p>
      <p><strong>Email:</strong> ${dados.email}</p>
      <p><strong>Mensagem:</strong> ${dados.mensagem || '---'}</p>
      <p><strong>Link do modelo:</strong> ${dados.linkModelo || 'não informado'}</p>
      <hr/>
      <p style="font-size: 12px; color: #888;">Recebido automaticamente por Flashcraft</p>
    </div>
  `;

  const mailOptions = {
    from: de || process.env.EMAIL_USER,
    to: para || process.env.EMAIL_DESTINO || process.env.EMAIL_USER,
    subject: assunto,
    html: htmlBody
  };

  await transporter.sendMail(mailOptions);
};

module.exports = enviarEmail;
