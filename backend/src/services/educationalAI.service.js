const { PrismaClient } = require('@prisma/client');
const stockfishService = require('./stockfish.service');

const prisma = new PrismaClient();

// Serviço de IA educativa que se adapta ao desempenho do jogador
const educationalAIService = {
  // Obter dificuldade adaptada ao nível do jogador
  getAdaptiveDifficulty: async (userId) => {
    try {
      // Buscar histórico de jogos do usuário
      const games = await prisma.game.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5, // Considerar os últimos 5 jogos
        include: { analysis: true }
      });
      
      // Se não houver jogos suficientes, retornar dificuldade padrão
      if (games.length < 3) {
        return 'beginner';
      }
      
      // Calcular média de precisão dos últimos jogos
      const gamesWithAnalysis = games.filter(game => game.analysis);
      const averageAccuracy = gamesWithAnalysis.length > 0
        ? gamesWithAnalysis.reduce((sum, game) => sum + game.analysis.accuracy, 0) / gamesWithAnalysis.length
        : 0;
      
      // Calcular taxa de vitória
      const victories = games.filter(game => game.result === 'victory').length;
      const winRate = (victories / games.length) * 100;
      
      // Determinar dificuldade com base na precisão e taxa de vitória
      if (averageAccuracy > 85 && winRate > 70) {
        return 'advanced';
      } else if (averageAccuracy > 65 && winRate > 40) {
        return 'intermediate';
      } else {
        return 'beginner';
      }
    } catch (error) {
      console.error('Erro ao calcular dificuldade adaptativa:', error);
      return 'beginner'; // Retornar dificuldade padrão em caso de erro
    }
  },
  
  // Gerar dica educativa adaptada ao nível do jogador
  getAdaptiveHint: async (fen, userId) => {
    try {
      // Buscar progresso de aprendizado do jogador
      const learningProgress = await prisma.learningProgress.findUnique({
        where: { userId }
      });
      
      if (!learningProgress) {
        // Se não houver progresso registrado, usar dica padrão
        return stockfishService.getHint(fen);
      }
      
      // Analisar a posição atual
      const chess = new Chess(fen);
      const moveCount = chess.history().length;
      
      // Determinar a fase do jogo
      let gamePhase = 'opening';
      if (moveCount > 20) {
        gamePhase = 'endgame';
      } else if (moveCount > 10) {
        gamePhase = 'middlegame';
      }
      
      // Identificar áreas de fraqueza do jogador
      const weakestArea = getWeakestArea(learningProgress);
      
      // Obter dica básica da engine
      const basicHint = await stockfishService.getHint(fen);
      
      // Personalizar a dica com base na fase do jogo e áreas de fraqueza
      let enhancedHint = basicHint.hint;
      
      if (gamePhase === 'opening' && weakestArea === 'openings') {
        enhancedHint += ' Lembre-se dos princípios de abertura: controle do centro, desenvolvimento de peças e segurança do rei.';
      } else if (gamePhase === 'middlegame' && weakestArea === 'middleGame') {
        enhancedHint += ' No meio-jogo, procure por oportunidades táticas e mantenha suas peças coordenadas.';
      } else if (gamePhase === 'endgame' && weakestArea === 'endGame') {
        enhancedHint += ' Nos finais, ative seu rei e tente criar peões passados.';
      } else if (weakestArea === 'tactics') {
        enhancedHint += ' Verifique se há oportunidades táticas como garfos, espetos ou ataques duplos.';
      }
      
      return {
        ...basicHint,
        hint: enhancedHint,
        adaptedTo: weakestArea
      };
    } catch (error) {
      console.error('Erro ao gerar dica adaptativa:', error);
      // Em caso de erro, retornar dica padrão
      return stockfishService.getHint(fen);
    }
  },
  
  // Gerar feedback educativo adaptado ao nível do jogador
  getAdaptiveFeedback: async (gameId, userId) => {
    try {
      // Buscar o jogo e sua análise
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { analysis: true }
      });
      
      if (!game || !game.analysis) {
        throw new Error('Jogo ou análise não encontrados');
      }
      
      // Buscar histórico de jogos do usuário
      const userGames = await prisma.game.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { analysis: true }
      });
      
      // Identificar padrões de erro recorrentes
      const recurrentErrors = identifyRecurrentErrors(userGames);
      
      // Obter feedback básico
      const basicFeedback = await stockfishService.generateFeedback(game.pgn, game.analysis);
      
      // Adicionar recomendações personalizadas com base nos padrões de erro
      const enhancedRecommendations = [...basicFeedback.recommendations];
      
      recurrentErrors.forEach(error => {
        if (!enhancedRecommendations.includes(error.recommendation)) {
          enhancedRecommendations.push(error.recommendation);
        }
      });
      
      // Adicionar recursos de aprendizado personalizados
      const learningResources = generateLearningResources(recurrentErrors, game.analysis);
      
      return {
        ...basicFeedback,
        recommendations: enhancedRecommendations,
        recurrentErrors: recurrentErrors.map(e => e.type),
        learningResources
      };
    } catch (error) {
      console.error('Erro ao gerar feedback adaptativo:', error);
      // Em caso de erro, tentar retornar feedback básico
      try {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
          include: { analysis: true }
        });
        
        if (game && game.analysis) {
          return stockfishService.generateFeedback(game.pgn, game.analysis);
        }
      } catch (innerError) {
        console.error('Erro ao gerar feedback básico:', innerError);
      }
      
      throw error;
    }
  },
  
  // Atualizar o modelo de aprendizado do jogador com base em uma nova partida
  updateLearningModel: async (gameId, userId) => {
    try {
      // Buscar o jogo e sua análise
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { analysis: true }
      });
      
      if (!game || !game.analysis) {
        throw new Error('Jogo ou análise não encontrados');
      }
      
      // Extrair pontuações de aprendizado da análise
      const {
        openingScore,
        middleGameScore,
        endGameScore,
        tacticsScore
      } = game.analysis;
      
      // Buscar progresso atual
      const currentProgress = await prisma.learningProgress.findUnique({
        where: { userId }
      });
      
      // Calcular novos valores de progresso (média ponderada)
      const weight = 0.3; // Peso para o novo resultado
      
      // Se não houver progresso atual, criar novo
      if (!currentProgress) {
        await prisma.learningProgress.create({
          data: {
            userId,
            openings: openingScore || 0,
            middleGame: middleGameScore || 0,
            endGame: endGameScore || 0,
            tactics: tacticsScore || 0
          }
        });
        
        return {
          message: 'Modelo de aprendizado criado com sucesso',
          newProgress: {
            openings: openingScore || 0,
            middleGame: middleGameScore || 0,
            endGame: endGameScore || 0,
            tactics: tacticsScore || 0
          }
        };
      }
      
      // Calcular novos valores
      const newOpenings = currentProgress.openings * (1 - weight) + (openingScore || 0) * weight;
      const newMiddleGame = currentProgress.middleGame * (1 - weight) + (middleGameScore || 0) * weight;
      const newEndGame = currentProgress.endGame * (1 - weight) + (endGameScore || 0) * weight;
      const newTactics = currentProgress.tactics * (1 - weight) + (tacticsScore || 0) * weight;
      
      // Atualizar progresso
      const updatedProgress = await prisma.learningProgress.update({
        where: { userId },
        data: {
          openings: newOpenings,
          middleGame: newMiddleGame,
          endGame: newEndGame,
          tactics: newTactics
        }
      });
      
      return {
        message: 'Modelo de aprendizado atualizado com sucesso',
        previousProgress: {
          openings: currentProgress.openings,
          middleGame: currentProgress.middleGame,
          endGame: currentProgress.endGame,
          tactics: currentProgress.tactics
        },
        newProgress: updatedProgress
      };
    } catch (error) {
      console.error('Erro ao atualizar modelo de aprendizado:', error);
      throw error;
    }
  },
  
  // Gerar plano de estudo personalizado para o jogador
  generateStudyPlan: async (userId) => {
    try {
      // Buscar progresso de aprendizado
      const learningProgress = await prisma.learningProgress.findUnique({
        where: { userId }
      });
      
      if (!learningProgress) {
        // Plano de estudo padrão para iniciantes
        return {
          focus: 'fundamentals',
          recommendations: [
            'Aprenda os movimentos básicos de cada peça',
            'Pratique os princípios de abertura: controle do centro, desenvolvimento de peças e segurança do rei',
            'Estude padrões táticos simples como garfos e espetos'
          ],
          exercises: [
            'Pratique finais básicos de rei e peão',
            'Resolva problemas de xeque-mate em 1 jogada',
            'Jogue partidas focando no desenvolvimento correto das peças'
          ]
        };
      }
      
      // Identificar área mais fraca
      const weakestArea = getWeakestArea(learningProgress);
      
      // Gerar plano de estudo personalizado
      const studyPlan = {
        focus: weakestArea,
        recommendations: [],
        exercises: []
      };
      
      // Personalizar recomendações com base na área mais fraca
      switch (weakestArea) {
        case 'openings':
          studyPlan.recommendations = [
            'Estude os princípios de abertura: controle do centro, desenvolvimento de peças e segurança do rei',
            'Aprenda uma abertura sólida para as peças brancas (ex: Abertura Italiana ou Ruy Lopez)',
            'Aprenda uma resposta confiável para 1.e4 (ex: Defesa Siciliana ou Francesa)'
          ];
          studyPlan.exercises = [
            'Pratique as primeiras 10 jogadas de uma abertura específica',
            'Analise partidas de mestres que usam suas aberturas preferidas',
            'Jogue partidas focando apenas no desenvolvimento correto da abertura'
          ];
          break;
          
        case 'middleGame':
          studyPlan.recommendations = [
            'Estude planos estratégicos no meio-jogo',
            'Aprenda a avaliar posições e identificar fraquezas',
            'Pratique a coordenação de peças e ataques ao rei'
          ];
          studyPlan.exercises = [
            'Resolva problemas táticos de dificuldade média',
            'Analise posições de meio-jogo e identifique o melhor plano',
            'Pratique partidas temáticas focadas em ataques ao rei'
          ];
          break;
          
        case 'endGame':
          studyPlan.recommendations = [
            'Estude os princípios básicos de finais',
            'Aprenda finais essenciais de rei e peão',
            'Pratique a ativação do rei no final'
          ];
          studyPlan.exercises = [
            'Pratique finais básicos contra o computador',
            'Estude posições de finais clássicos',
            'Resolva problemas de finais com soluções precisas'
          ];
          break;
          
        case 'tactics':
          studyPlan.recommendations = [
            'Estude padrões táticos comuns: garfos, espetos, ataques duplos, etc.',
            'Pratique cálculo de variantes',
            'Aprenda a identificar oportunidades táticas'
          ];
          studyPlan.exercises = [
            'Resolva problemas táticos diariamente',
            'Pratique exercícios de visualização',
            'Analise suas partidas para identificar oportunidades táticas perdidas'
          ];
          break;
      }
      
      return studyPlan;
    } catch (error) {
      console.error('Erro ao gerar plano de estudo:', error);
      // Retornar plano de estudo padrão em caso de erro
      return {
        focus: 'fundamentals',
        recommendations: [
          'Aprenda os movimentos básicos de cada peça',
          'Pratique os princípios de abertura',
          'Estude padrões táticos simples'
        ],
        exercises: [
          'Pratique finais básicos',
          'Resolva problemas de xeque-mate simples',
          'Jogue partidas regulares para ganhar experiência'
        ]
      };
    }
  }
};

// Função auxiliar para identificar a área mais fraca do jogador
function getWeakestArea(learningProgress) {
  const areas = [
    { name: 'openings', value: learningProgress.openings },
    { name: 'middleGame', value: learningProgress.middleGame },
    { name: 'endGame', value: learningProgress.endGame },
    { name: 'tactics', value: learningProgress.tactics }
  ];
  
  // Ordenar áreas por valor (do menor para o maior)
  areas.sort((a, b) => a.value - b.value);
  
  // Retornar a área com menor valor
  return areas[0].name;
}

// Função auxiliar para identificar padrões de erro recorrentes
function identifyRecurrentErrors(games) {
  const errors = [];
  const errorCounts = {
    openingMistakes: 0,
    tacticalMisses: 0,
    endgameMistakes: 0,
    positionalErrors: 0,
    timeManagement: 0
  };
  
  // Analisar jogos com análise disponível
  const gamesWithAnalysis = games.filter(game => game.analysis);
  
  gamesWithAnalysis.forEach(game => {
    const comments = game.analysis.comments || [];
    
    // Verificar erros na abertura (primeiros 10 movimentos)
    const openingComments = comments.filter(c => c.moveNumber <= 5);
    const openingMistakes = openingComments.filter(c => 
      c.quality === 'Erro (mistake)' || c.quality === 'Erro grave (blunder)'
    ).length;
    
    if (openingMistakes > 0) {
      errorCounts.openingMistakes++;
    }
    
    // Verificar erros táticos
    const tacticalMisses = comments.filter(c => 
      (c.quality === 'Erro (mistake)' || c.quality === 'Erro grave (blunder)') &&
      (c.comment.includes('tática') || c.comment.includes('captura'))
    ).length;
    
    if (tacticalMisses > 0) {
      errorCounts.tacticalMisses++;
    }
    
    // Verificar erros no final
    const endgameComments = comments.filter(c => c.moveNumber > 20);
    const endgameMistakes = endgameComments.filter(c => 
      c.quality === 'Erro (mistake)' || c.quality === 'Erro grave (blunder)'
    ).length;
    
    if (endgameMistakes > 0) {
      errorCounts.endgameMistakes++;
    }
  });
  
  // Identificar erros recorrentes (presentes em pelo menos 50% dos jogos)
  const threshold = gamesWithAnalysis.length * 0.5;
  
  if (errorCounts.openingMistakes >= threshold) {
    errors.push({
      type: 'openingMistakes',
      count: errorCounts.openingMistakes,
      recommendation: 'Foque em estudar princípios de abertura e evite mover a mesma peça várias vezes no início.'
    });
  }
  
  if (errorCounts.tacticalMisses >= threshold) {
    errors.push({
      type: 'tacticalMisses',
      count: errorCounts.tacticalMisses,
      recommendation: 'Pratique exercícios táticos diariamente para melhorar sua visão de jogo.'
    });
  }
  
  if (errorCounts.endgameMistakes >= threshold) {
    errors.push({
      type: 'endgameMistakes',
      count: errorCounts.endgameMistakes,
      recommendation: 'Estude os princípios básicos de finais e pratique posições de finais comuns.'
    });
  }
  
  return errors;
}

// Função auxiliar para gerar recursos de aprendizado personalizados
function generateLearningResources(recurrentErrors, analysis) {
  const resources = [];
  
  // Adicionar recursos com base nos erros recorrentes
  recurrentErrors.forEach(error => {
    switch (error.type) {
      case 'openingMistakes':
        resources.push({
          type: 'article',
          title: 'Princípios de Abertura no Xadrez',
          description: 'Aprenda os fundamentos para um bom início de partida'
        });
        resources.push({
          type: 'exercise',
          title: 'Treino de Aberturas',
          description: 'Pratique as primeiras 10 jogadas de aberturas populares'
        });
        break;
        
      case 'tacticalMisses':
        resources.push({
          type: 'exercise',
          title: 'Exercícios Táticos',
          description: 'Resolva problemas táticos para melhorar sua visão de jogo'
        });
        resources.push({
          type: 'article',
          title: 'Padrões Táticos Comuns',
          description: 'Aprenda a reconhecer garfos, espetos e outros padrões táticos'
        });
        break;
        
      case 'endgameMistakes':
        resources.push({
          type: 'article',
          title: 'Fundamentos de Finais',
          description: 'Princípios essenciais para jogar bem no final da partida'
        });
        resources.push({
          type: 'exercise',
          title: 'Finais Básicos',
          description: 'Pratique finais de rei e peão e outras posições fundamentais'
        });
        break;
    }
  });
  
  // Adicionar recursos com base na análise específica do jogo
  if (analysis.accuracy < 60) {
    resources.push({
      type: 'exercise',
      title: 'Cálculo de Variantes',
      description: 'Melhore sua capacidade de calcular jogadas futuras'
    });
  }
  
  if (analysis.blunders > 2) {
    resources.push({
      type: 'article',
      title: 'Como Evitar Erros Graves',
      description: 'Técnicas para verificar suas jogadas e evitar blunders'
    });
  }
  
  return resources;
}

module.exports = educationalAIService;
