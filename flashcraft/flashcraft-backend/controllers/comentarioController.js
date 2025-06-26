const Comentario = require('../models/Comentario');

exports.criarComentario = async (req, res) => {
  try {
    const { produtoId, nota, texto } = req.body;

    const existente = await Comentario.findOne({ produto: produtoId, usuario: req.usuarioId });
    if (existente) {
      return res.status(400).json({ erro: 'Você já comentou esse produto.' });
    }

    const novo = new Comentario({
      produto: produtoId,
      usuario: req.usuarioId,
      nota,
      texto
    });

    await novo.save();
    res.status(201).json({ mensagem: 'Comentário enviado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

exports.listarComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find({ produto: req.params.produtoId })
      .populate('usuario', 'nome')
      .sort({ data: -1 });

    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};
