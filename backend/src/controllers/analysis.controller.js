const { PrismaClient } = require('@prisma/client');
const stockfishService = require('../services/stockfish.service');

const prisma = new PrismaClient();

// Controlador de análise
exports.createAnalysis = async (req, res) => {
  try {
    const { gameId, pgn } = req.body;

    const game = await prisma.game.findUnique({
      where: { id: String(gameId) } // <- conversão garantida
    });

    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }

    const analysis = await prisma.analysis.create({
      data: {
        gameId: game.id,
        pgn
      }
    });

    res.status(201).json(analysis);
  } catch (error) {
    console.error('Erro ao criar análise:', error);
    res.status(500).json({ message: 'Erro ao criar análise' });
  }
};

exports.getAnalysisByGameId = async (req, res) => {
  try {
    const { id } = req.params; // ID do jogo
    
    const analysis = await prisma.analysis.findUnique({
      where: { gameId: id }
    });
    
    if (!analysis) {
      return res.status(404).json({ message: 'Análise não encontrada' });
    }
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Erro ao buscar análise:', error);
    res.status(500).json({ message: 'Erro ao buscar análise' });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Buscar todos os jogos do usuário
    const games = await prisma.game.findMany({
      where: { userId },
      include: { analysis: true }
    });
    
    // Calcular estatísticas
    const totalGames = games.length;
    const victories = games.filter(game => game.result === 'victory').length;
    const defeats = games.filter(game => game.result === 'defeat').length;
    const draws = games.filter(game => game.result === 'draw').length;
    
    // Calcular médias de precisão, erros, etc.
    const gamesWithAnalysis = games.filter(game => game.analysis);
    const averageAccuracy = gamesWithAnalysis.length > 0
      ? gamesWithAnalysis.reduce((sum, game) => sum + game.analysis.accuracy, 0) / gamesWithAnalysis.length
      : 0;
    
    // Buscar progresso de aprendizado
    const learningProgress = await prisma.learningProgress.findUnique({
      where: { userId }
    });
    
    res.status(200).json({
      totalGames,
      victories,
      defeats,
      draws,
      winRate: totalGames > 0 ? (victories / totalGames) * 100 : 0,
      averageAccuracy,
      learningProgress
    });
  } catch (error) {
    console.error('Erro ao buscar análise do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar análise do usuário' });
  }
};

exports.getGameFeedback = async (req, res) => {
  try {
    const { gameId } = req.params;
    
    // Buscar o jogo e sua análise
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { analysis: true }
    });
    
    if (!game) {
      return res.status(404).json({ message: 'Jogo não encontrado' });
    }
    
    if (!game.analysis) {
      return res.status(404).json({ message: 'Análise não encontrada para este jogo' });
    }
    
    // Gerar feedback educativo com base na análise
    const feedback = await stockfishService.generateFeedback(game.pgn, game.analysis);
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Erro ao gerar feedback:', error);
    res.status(500).json({ message: 'Erro ao gerar feedback' });
  }
};

// Função auxiliar para atualizar o progresso de aprendizado
async function updateLearningProgress(userId, analysisResult) {
  try {
    // Buscar progresso atual
    const currentProgress = await prisma.learningProgress.findUnique({
      where: { userId }
    });

    if (!currentProgress) {
      // Criar novo progresso se não existir
      return await prisma.learningProgress.create({
        data: {
          userId,
          openings: analysisResult.openingScore || 0,
          middleGame: analysisResult.middleGameScore || 0,
          endGame: analysisResult.endGameScore || 0,
          tactics: analysisResult.tacticsScore || 0
        }
      });
    }

    // Calcular novos valores de progresso (média ponderada)
    const weight = 0.3; // Peso para o novo resultado
    const newOpenings = currentProgress.openings * (1 - weight) + (analysisResult.openingScore || 0) * weight;
    const newMiddleGame = currentProgress.middleGame * (1 - weight) + (analysisResult.middleGameScore || 0) * weight;
    const newEndGame = currentProgress.endGame * (1 - weight) + (analysisResult.endGameScore || 0) * weight;
    const newTactics = currentProgress.tactics * (1 - weight) + (analysisResult.tacticsScore || 0) * weight;

    // Atualizar progresso
    return await prisma.learningProgress.update({
      where: { userId },
      data: {
        openings: newOpenings,
        middleGame: newMiddleGame,
        endGame: newEndGame,
        tactics: newTactics
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar progresso de aprendizado:', error);
    throw error;
  }
}
