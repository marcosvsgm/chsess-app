const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Aplicar middleware de autenticação a todas as rotas
router.use(authMiddleware.authenticateToken);

// Rotas de usuário (todas protegidas pelo middleware authenticateToken)
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.uploadProfilePicture, userController.updateUserProfile);
router.get('/progress', userController.getLearningProgress);
router.put('/progress', userController.updateLearningProgress);
router.get('/statistics', userController.getUserStatistics);

module.exports = router;

