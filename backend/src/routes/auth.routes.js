const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authenticateToken = require('../middlewares/authenticateToken');

// Rotas públicas de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Rota protegida: só acessível com token válido
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
