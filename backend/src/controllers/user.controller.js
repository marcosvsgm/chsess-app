const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Controlador de usuário
exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Remover senha do objeto retornado
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email
      }
    });
    
    // Remover senha do objeto retornado
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil do usuário' });
  }
};

exports.getLearningProgress = async (req, res) => {
  try {
    const { id } = req.params;
    
    const learningProgress = await prisma.learningProgress.findUnique({
      where: { userId: id }
    });
    
    if (!learningProgress) {
      return res.status(404).json({ message: 'Progresso de aprendizado não encontrado' });
    }
    
    res.status(200).json(learningProgress);
  } catch (error) {
    console.error('Erro ao buscar progresso de aprendizado:', error);
    res.status(500).json({ message: 'Erro ao buscar progresso de aprendizado' });
  }
};

exports.updateLearningProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { openings, middleGame, endGame, tactics } = req.body;
    
    // Verificar se o progresso existe
    const progress = await prisma.learningProgress.findUnique({
      where: { userId: id }
    });
    
    if (!progress) {
      // Criar novo progresso se não existir
      const newProgress = await prisma.learningProgress.create({
        data: {
          userId: id,
          openings: openings || 0,
          middleGame: middleGame || 0,
          endGame: endGame || 0,
          tactics: tactics || 0
        }
      });
      
      return res.status(201).json(newProgress);
    }
    
    // Atualizar progresso existente
    const updatedProgress = await prisma.learningProgress.update({
      where: { userId: id },
      data: {
        openings: openings !== undefined ? openings : progress.openings,
        middleGame: middleGame !== undefined ? middleGame : progress.middleGame,
        endGame: endGame !== undefined ? endGame : progress.endGame,
        tactics: tactics !== undefined ? tactics : progress.tactics
      }
    });
    
    res.status(200).json(updatedProgress);
  } catch (error) {
    console.error('Erro ao atualizar progresso de aprendizado:', error);
    res.status(500).json({ message: 'Erro ao atualizar progresso de aprendizado' });
  }
};

exports.getUserStatistics = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Buscar todos os jogos do usuário
    const games = await prisma.game.findMany({
      where: { userId: id }
    });
    
    // Calcular estatísticas
    const totalGames = games.length;
    const victories = games.filter(game => game.result === 'victory').length;
    const defeats = games.filter(game => game.result === 'defeat').length;
    const draws = games.filter(game => game.result === 'draw').length;
    
    // Calcular taxa de vitória
    const winRate = totalGames > 0 ? (victories / totalGames) * 100 : 0;
    
    // Buscar progresso de aprendizado
    const learningProgress = await prisma.learningProgress.findUnique({
      where: { userId: id }
    });
    
    res.status(200).json({
      totalGames,
      victories,
      defeats,
      draws,
      winRate,
      learningProgress
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas do usuário' });
  }
};
