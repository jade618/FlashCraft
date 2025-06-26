const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Token não fornecido.' });

  try {
    // Use JWT_SECRET instead of JWT_SECRET_ADMIN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};
