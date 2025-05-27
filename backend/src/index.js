require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const gameRoutes = require('./routes/game.routes');
const analysisRoutes = require('./routes/analysis.routes');
const userRoutes = require('./routes/user.routes');
const authenticateToken = require('./middlewares/authenticateToken');

const app = express();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
app.use('/api/auth', authRoutes); // O próprio auth.route.js protege rotas que precisam (ex: /me)

// Rotas protegidas
app.use('/api/games', authenticateToken, gameRoutes);
app.use('/api/analysis', authenticateToken, analysisRoutes);
app.use('/api/users', authenticateToken, userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API do Xadrez Educativo com IA está funcionando!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ocorreu um erro no servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}`);
});

module.exports = app;
