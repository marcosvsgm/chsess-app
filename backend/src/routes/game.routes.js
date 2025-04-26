const express = require('express');
const router = express.Router();
const gameController = require('../controllers/game.controller');

// Rotas de jogos
router.post('/', gameController.createGame);
router.get('/', gameController.getGames);
router.get('/:id', gameController.getGameById);
router.post('/:id/move', gameController.makeMove);
router.get('/:id/hint', gameController.getHint);
router.get('/:id/evaluation', gameController.getEvaluation);

module.exports = router;
