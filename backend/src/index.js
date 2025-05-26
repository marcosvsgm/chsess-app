require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar rotas
const authRoutes = require('./routes/auth.routes');
const gameRoutes = require('./routes/game.routes');
const analysisRoutes = require('./routes/analysis.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

// Corrigido: usar nomes consistentes
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/users', userRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API do Xadrez Educativo com IA está funcionando!' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ocorreu um erro no servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor (corrigido para usar a variável correta)
app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});

module.exports = app;
