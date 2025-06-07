const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/profile');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome de arquivo único baseado no timestamp e ID do usuário
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}_${timestamp}${ext}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas!'), false);
  }
};

// Configuração do upload
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // limite de 5MB
  },
  fileFilter: fileFilter
});

// Middleware para upload de imagem de perfil
exports.uploadProfilePicture = upload.single('profilePicture');

// Controlador de usuário
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Remover senha do objeto retornado
    const { password, ...userWithoutPassword } = user;
    
    // Adicionar URL completa da imagem de perfil, se existir
    if (userWithoutPassword.profilePicture) {
      userWithoutPassword.profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profile/${userWithoutPassword.profilePicture}`;
    }
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    const { name, email, currentPassword, newPassword } = req.body;
    
    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Preparar dados para atualização
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    
    // Se o usuário está tentando alterar a senha
    if (newPassword && currentPassword) {
      // Verificar se a senha atual está correta
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }
      
      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }
    
    // Se foi enviada uma imagem de perfil
    if (req.file) {
      // Remover a imagem antiga, se existir
      if (user.profilePicture) {
        const oldImagePath = path.join(__dirname, '../../uploads/profile', user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Salvar o nome do arquivo no banco de dados
      updateData.profilePicture = req.file.filename;
    }

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });
    
    // Remover senha do objeto retornado
    const { password, ...userWithoutPassword } = updatedUser;
    
    // Adicionar URL completa da imagem de perfil, se existir
    if (userWithoutPassword.profilePicture) {
      userWithoutPassword.profilePictureUrl = `${req.protocol}://${req.get('host')}/uploads/profile/${userWithoutPassword.profilePicture}`;
    }
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil do usuário' });
  }
};

exports.getLearningProgress = async (req, res) => {
  try {
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    
    const learningProgress = await prisma.learningProgress.findUnique({
      where: { userId }
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
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    const { openings, middleGame, endGame, tactics } = req.body;
    
    // Verificar se o progresso existe
    const progress = await prisma.learningProgress.findUnique({
      where: { userId }
    });
    
    if (!progress) {
      // Criar novo progresso se não existir
      const newProgress = await prisma.learningProgress.create({
        data: {
          userId,
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
      where: { userId },
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
    const userId = req.user.id; // Obtém o ID do usuário do token JWT
    
    // Buscar todos os jogos do usuário
    const games = await prisma.game.findMany({
      where: { userId }
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
      where: { userId }
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

