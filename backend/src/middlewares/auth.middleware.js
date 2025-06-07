const jwt = require('jsonwebtoken');

// Middleware para verificar o token JWT
exports.authenticateToken = (req, res, next) => {
  // Obter o cabeçalho de autorização
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }
  
  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar o usuário decodificado à requisição
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

