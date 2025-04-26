const { PrismaClient } = require('@prisma/client');
const { Chess } = require('chess.js');
const stockfishService = require('../services/stockfish.service');

const prisma = new PrismaClient();

// Controlador de jogos
exports.createGame = async (req, res) => {
  try {
    const { userId, difficulty = 'beginner' } = req.body;

    // Iniciar um novo jogo de xadrez
    const chess = new Chess();
    
    // Criar o jogo no banco de dados
    const newGame = await prisma.game.create({
      data: {
        userId,
        difficulty,
        result: 'ongoing',
        moves: [],
        pgn: chess.pgn(),
        evaluation: 0.0
      }
    });
    
    res.status(201).json(newGame);
  } catch (error) {
    console.error('Erro ao criar jogo:', error);
    res.status(500).json({ message: 'Erro ao criar jogo' });
  }
};

exports.getGames = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const games = await prisma.game.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.status(200).json(games);
  } catch (error) {
    console.error('Erro ao buscar jogos:', error);
    res.status(500).json({ message: 'Erro ao buscar jogos' });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        analysis: true
      }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    
    res.status(200).json(game);
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    res.status(500).json({ message: 'Erro ao buscar jogo' });
  }
};

exports.makeMove = async (req, res) => {
  try {
    const { id } = req.params;
    const { move, userId } = req.body;
    
    // Buscar o jogo atual
    const game = await prisma.game.findUnique({
      where: { id }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    
    // Verificar se o usuário é o dono do jogo
    if (game.userId !== userId) {
      return res.status(403).json({ message: 'Não autorizado' });
    }
    
    // Recriar o estado atual do jogo
    const chess = new Chess();
    if (game.moves.length > 0) {
      game.moves.forEach(move => chess.move(move));
    }
    
    // Verificar se o jogo já acabou
    if (chess.isGameOver()) {
      return res.status(400).json({ message: 'Jogo já finalizado' });
    }
    
    // Fazer a jogada do usuário
    try {
      const result = chess.move(move);
      if (!result) {
        return res.status(400).json({ message: 'Jogada inválida' });
      }
      
      // Atualizar a lista de movimentos
      const updatedMoves = [...game.moves, move];
      
      // Verificar se o jogo acabou após a jogada do usuário
      let gameResult = 'ongoing';
      if (chess.isGameOver()) {
        if (chess.isDraw()) {
          gameResult = 'draw';
        } else {
          gameResult = 'victory'; // O usuário venceu
        }
      } else {
        // Fazer a jogada da IA
        const aiMove = await stockfishService.getBestMove(chess.fen(), game.difficulty);
        chess.move(aiMove);
        updatedMoves.push(aiMove);
        
        // Verificar se o jogo acabou após a jogada da IA
        if (chess.isGameOver()) {
          if (chess.isDraw()) {
            gameResult = 'draw';
          } else {
            gameResult = 'defeat'; // A IA venceu
          }
        }
      }
      
      // Obter avaliação atual da posição
      const evaluation = await stockfishService.evaluatePosition(chess.fen());
      
      // Atualizar o jogo no banco de dados
      const updatedGame = await prisma.game.update({
        where: { id },
        data: {
          moves: updatedMoves,
          pgn: chess.pgn(),
          result: gameResult,
          evaluation
        }
      });
      
      res.status(200).json({
        ...updatedGame,
        fen: chess.fen(),
        isGameOver: chess.isGameOver(),
        turn: chess.turn()
      });
    } catch (error) {
      return res.status(400).json({ message: 'Jogada inválida', error: error.message });
    }
  } catch (error) {
    console.error('Erro ao fazer jogada:', error);
    res.status(500).json({ message: 'Erro ao fazer jogada' });
  }
};

exports.getHint = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar o jogo atual
    const game = await prisma.game.findUnique({
      where: { id }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    
    // Recriar o estado atual do jogo
    const chess = new Chess();
    if (game.moves.length > 0) {
      game.moves.forEach(move => chess.move(move));
    }
    
    // Verificar se o jogo já acabou
    if (chess.isGameOver()) {
      return res.status(400).json({ message: 'Jogo já finalizado' });
    }
    
    // Verificar se é a vez do usuário
    if (chess.turn() !== 'w') {
      return res.status(400).json({ message: 'Não é a vez do usuário' });
    }
    
    // Obter dica da engine
    const hint = await stockfishService.getHint(chess.fen());
    
    res.status(200).json({ hint });
  } catch (error) {
    console.error('Erro ao obter dica:', error);
    res.status(500).json({ message: 'Erro ao obter dica' });
  }
};

exports.getEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar o jogo atual
    const game = await prisma.game.findUnique({
      where: { id }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    
    // Recriar o estado atual do jogo
    const chess = new Chess();
    if (game.moves.length > 0) {
      game.moves.forEach(move => chess.move(move));
    }
    
    // Obter avaliação da posição atual
    const evaluation = await stockfishService.evaluatePosition(chess.fen());
    
    res.status(200).json({ evaluation });
  } catch (error) {
    console.error('Erro ao obter avaliação:', error);
    res.status(500).json({ message: 'Erro ao obter avaliação' });
  }
};
