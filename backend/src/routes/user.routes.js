const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Rotas de usuário
router.get('/profile/:id', userController.getUserProfile);
router.put('/profile/:id', userController.updateUserProfile);
router.get('/progress/:id', userController.getLearningProgress);
router.put('/progress/:id', userController.updateLearningProgress);
router.get('/statistics/:id', userController.getUserStatistics);

module.exports = router;
