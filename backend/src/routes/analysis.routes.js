const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

// Rotas de análise
router.post('/games/:id', analysisController.createAnalysis);
router.get('/games/:id', analysisController.getAnalysisByGameId);
router.get('/user/:userId', analysisController.getUserAnalytics);
router.get('/feedback/:gameId', analysisController.getGameFeedback);
router.post('/', analysisController.createAnalysis);

module.exports = router;
