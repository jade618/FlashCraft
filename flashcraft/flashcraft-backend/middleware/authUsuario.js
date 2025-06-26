const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = {
      id: decoded.id,
      nome: decoded.nome,
      email: decoded.email
    };
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};
