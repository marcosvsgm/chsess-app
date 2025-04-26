const stockfish = require('stockfish');
const { Chess } = require('chess.js');

// Inicializar a engine Stockfish
let engine = null;

// Função para inicializar a engine
function initEngine() {
  if (!engine) {
    engine = stockfish();
    
    // Configurar a engine
    engine.postMessage('uci');
    engine.postMessage('isready');
  }
  return engine;
}

// Serviço Stockfish para integração com o backend
const stockfishService = {
  // Obter a melhor jogada para uma posição FEN
  getBestMove: (fen, difficulty = 'beginner') => {
    return new Promise((resolve, reject) => {
      try {
        const engine = initEngine();
        
        // Definir a profundidade de busca com base na dificuldade
        let depth = 5; // Padrão para iniciante
        if (difficulty === 'intermediate') depth = 10;
        if (difficulty === 'advanced') depth = 15;
        
        // Configurar a posição
        engine.postMessage(`position fen ${fen}`);
        
        // Solicitar a melhor jogada
        engine.postMessage(`go depth ${depth}`);
        
        // Ouvir a resposta da engine
        const listener = (line) => {
          if (line.startsWith('bestmove')) {
            const bestMove = line.split(' ')[1];
            
            // Verificar se a jogada é válida
            const chess = new Chess(fen);
            try {
              const move = chess.move({
                from: bestMove.substring(0, 2),
                to: bestMove.substring(2, 4),
                promotion: bestMove.length === 5 ? bestMove[4] : undefined
              });
              
              if (move) {
                engine.removeMessageListener(listener);
                resolve(move.san); // Retornar em notação algébrica padrão
              } else {
                reject(new Error('Jogada inválida retornada pela engine'));
              }
            } catch (error) {
              reject(error);
            }
          }
        };
        
        engine.addMessageListener(listener);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  // Obter uma dica para o jogador
  getHint: async (fen) => {
    try {
      const bestMove = await stockfishService.getBestMove(fen, 'beginner');
      
      // Gerar uma dica educativa com base na jogada
      const chess = new Chess(fen);
      const move = chess.move(bestMove);
      chess.undo(); // Desfazer a jogada para manter a posição original
      
      // Analisar o tipo de jogada para fornecer uma dica contextual
      let hintText = '';
      
      if (move.flags.includes('c')) {
        hintText = 'Considere capturar uma peça do oponente.';
      } else if (move.flags.includes('e')) {
        hintText = 'Um peão en passant pode ser uma boa jogada aqui.';
      } else if (move.flags.includes('k') || move.flags.includes('q')) {
        hintText = 'Considere fazer o roque para proteger seu rei.';
      } else if (move.flags.includes('p')) {
        hintText = 'Promover um peão pode dar uma grande vantagem.';
      } else if (move.piece === 'p') {
        hintText = 'Avançar um peão pode ajudar a controlar o centro.';
      } else if (move.piece === 'n' || move.piece === 'b') {
        hintText = 'Desenvolver suas peças menores é importante no início do jogo.';
      } else if (move.piece === 'r') {
        hintText = 'As torres são mais eficazes em colunas abertas.';
      } else if (move.piece === 'q') {
        hintText = 'A dama é poderosa, mas cuidado para não a expor muito cedo.';
      } else if (move.piece === 'k') {
        hintText = 'A segurança do rei é crucial. Considere movê-lo para uma posição mais segura.';
      }
      
      return {
        move: bestMove,
        from: move.from,
        to: move.to,
        hint: hintText
      };
    } catch (error) {
      console.error('Erro ao gerar dica:', error);
      throw error;
    }
  },
  
  // Avaliar a posição atual
  evaluatePosition: (fen) => {
    return new Promise((resolve, reject) => {
      try {
        const engine = initEngine();
        
        // Configurar a posição
        engine.postMessage(`position fen ${fen}`);
        
        // Solicitar avaliação
        engine.postMessage('go depth 15');
        
        let evaluation = 0;
        
        // Ouvir a resposta da engine
        const listener = (line) => {
          if (line.includes('score cp')) {
            const scoreMatch = line.match(/score cp (-?\d+)/);
            if (scoreMatch && scoreMatch[1]) {
              evaluation = parseInt(scoreMatch[1]) / 100; // Converter centipawns para pawns
            }
          } else if (line.includes('score mate')) {
            const mateMatch = line.match(/score mate (-?\d+)/);
            if (mateMatch && mateMatch[1]) {
              const movesToMate = parseInt(mateMatch[1]);
              evaluation = movesToMate > 0 ? 999 : -999; // Valor alto para xeque-mate
            }
          } else if (line.startsWith('bestmove')) {
            engine.removeMessageListener(listener);
            resolve(evaluation);
          }
        };
        
        engine.addMessageListener(listener);
      } catch (error) {
        reject(error);
      }
    });
  },
  
  // Analisar um jogo completo
  analyzeGame: async (pgn) => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      
      const history = chess.history({ verbose: true });
      const comments = [];
      let mistakes = 0;
      let blunders = 0;
      let totalAccuracy = 0;
      
      // Valores para o progresso de aprendizado
      let openingScore = 0;
      let middleGameScore = 0;
      let endGameScore = 0;
      let tacticsScore = 0;
      
      // Analisar cada jogada
      for (let i = 0; i < history.length; i++) {
        const move = history[i];
        const isWhite = i % 2 === 0;
        
        // Recriar a posição antes da jogada
        const tempChess = new Chess();
        for (let j = 0; j < i; j++) {
          tempChess.move(history[j].san);
        }
        
        // Avaliar a posição antes da jogada
        const positionBefore = tempChess.fen();
        const evalBefore = await stockfishService.evaluatePosition(positionBefore);
        
        // Fazer a jogada
        tempChess.move(move.san);
        
        // Avaliar a posição após a jogada
        const positionAfter = tempChess.fen();
        const evalAfter = await stockfishService.evaluatePosition(positionAfter);
        
        // Calcular a diferença de avaliação
        const evalDiff = isWhite ? evalBefore - evalAfter : evalAfter - evalBefore;
        
        // Classificar a jogada
        let moveQuality = 'Boa jogada';
        let accuracy = 100;
        
        if (evalDiff > 2) {
          moveQuality = 'Erro grave (blunder)';
          blunders++;
          accuracy = 20;
        } else if (evalDiff > 1) {
          moveQuality = 'Erro (mistake)';
          mistakes++;
          accuracy = 50;
        } else if (evalDiff > 0.5) {
          moveQuality = 'Imprecisão';
          accuracy = 70;
        } else if (evalDiff > 0.2) {
          moveQuality = 'Jogada OK';
          accuracy = 85;
        } else {
          moveQuality = 'Boa jogada';
          accuracy = 95;
        }
        
        totalAccuracy += accuracy;
        
        // Adicionar comentário
        comments.push({
          moveNumber: Math.floor(i / 2) + 1,
          color: isWhite ? 'white' : 'black',
          move: move.san,
          evaluation: isWhite ? evalAfter : -evalAfter,
          quality: moveQuality,
          accuracy,
          comment: generateComment(move, moveQuality, i, history.length)
        });
        
        // Atualizar pontuações de aprendizado
        if (i < 10) { // Abertura (primeiras 10 jogadas)
          openingScore += accuracy;
        } else if (i < history.length - 10) { // Meio-jogo
          middleGameScore += accuracy;
        } else { // Final
          endGameScore += accuracy;
        }
        
        // Verificar táticas
        if (move.flags.includes('c') || move.flags.includes('e') || move.flags.includes('p')) {
          tacticsScore += accuracy;
        }
      }
      
      // Calcular médias
      const averageAccuracy = totalAccuracy / history.length;
      
      // Normalizar pontuações de aprendizado
      openingScore = Math.min(100, openingScore / Math.min(10, history.length) || 0);
      middleGameScore = history.length > 10 ? Math.min(100, middleGameScore / (history.length - 20) || 0) : 0;
      endGameScore = history.length > 20 ? Math.min(100, endGameScore / 10 || 0) : 0;
      
      // Contar jogadas táticas
      const tacticalMoves = history.filter(move => 
        move.flags.includes('c') || move.flags.includes('e') || move.flags.includes('p')
      ).length;
      
      tacticsScore = tacticalMoves > 0 ? Math.min(100, tacticsScore / tacticalMoves) : 0;
      
      return {
        comments,
        mistakes,
        blunders,
        accuracy: averageAccuracy,
        openingScore,
        middleGameScore,
        endGameScore,
        tacticsScore
      };
    } catch (error) {
      console.error('Erro ao analisar jogo:', error);
      throw error;
    }
  },
  
  // Gerar feedback educativo
  generateFeedback: async (pgn, analysis) => {
    try {
      const chess = new Chess();
      chess.loadPgn(pgn);
      
      const history = chess.history({ verbose: true });
      
      // Identificar pontos fortes e fracos
      const strengths = [];
      const weaknesses = [];
      const recommendations = [];
      
      // Analisar comentários para identificar padrões
      const comments = analysis.comments;
      
      // Verificar abertura
      const openingMoves = comments.slice(0, Math.min(10, comments.length));
      const openingAccuracy = openingMoves.reduce((sum, c) => sum + c.accuracy, 0) / openingMoves.length;
      
      if (openingAccuracy > 85) {
        strengths.push('Bom conhecimento de aberturas');
      } else if (openingAccuracy < 60) {
        weaknesses.push('Dificuldades nas aberturas');
        recommendations.push('Estude os princípios básicos de abertura: controle do centro, desenvolvimento de peças e segurança do rei.');
      }
      
      // Verificar táticas
      const tacticalComments = comments.filter(c => 
        c.move.includes('x') || // Capturas
        c.move.includes('+') || // Xeques
        c.move.includes('#')    // Xeque-mate
      );
      
      if (tacticalComments.length > 0) {
        const tacticalAccuracy = tacticalComments.reduce((sum, c) => sum + c.accuracy, 0) / tacticalComments.length;
        
        if (tacticalAccuracy > 85) {
          strengths.push('Boas habilidades táticas');
        } else if (tacticalAccuracy < 60) {
          weaknesses.push('Dificuldades em táticas');
          recommendations.push('Pratique exercícios de táticas para melhorar sua visão de jogo e cálculo.');
        }
      }
      
      // Verificar erros graves
      if (analysis.blunders > 0) {
        weaknesses.push(`${analysis.blunders} erro(s) grave(s) cometido(s)`);
        recommendations.push('Verifique suas jogadas com mais cuidado antes de confirmar, procurando ameaças do oponente.');
      }
      
      // Verificar precisão geral
      if (analysis.accuracy > 85) {
        strengths.push(`Alta precisão geral (${analysis.accuracy.toFixed(1)}%)`);
      } else if (analysis.accuracy < 60) {
        weaknesses.push(`Baixa precisão geral (${analysis.accuracy.toFixed(1)}%)`);
        recommendations.push('Tente analisar mais profundamente cada posição antes de jogar.');
      }
      
      // Adicionar recomendações gerais se necessário
      if (recommendations.length === 0) {
        recommendations.push('Continue praticando e estudando diferentes posições para melhorar ainda mais.');
      }
      
      return {
        strengths,
        weaknesses,
        recommendations,
        detailedAnalysis: comments
      };
    } catch (error) {
      console.error('Erro ao gerar feedback:', error);
      throw error;
    }
  }
};

// Função auxiliar para gerar comentários educativos
function generateComment(move, quality, moveIndex, totalMoves) {
  // Comentários para diferentes fases do jogo
  if (moveIndex < 10) {
    // Fase de abertura
    if (move.piece === 'p' && (move.to[1] === '4' || move.to[1] === '5')) {
      return 'Bom controle do centro com este peão.';
    } else if (move.piece === 'n' || move.piece === 'b') {
      return 'Desenvolvimento de peças menores é crucial na abertura.';
    } else if (move.piece === 'q' && moveIndex < 6) {
      return 'Cuidado ao desenvolver a dama muito cedo, ela pode se tornar alvo de ataques.';
    } else if (move.flags.includes('k') || move.flags.includes('q')) {
      return 'Roque é uma boa jogada para proteger o rei e conectar as torres.';
    }
  } else if (moveIndex < totalMoves - 10) {
    // Meio-jogo
    if (move.flags.includes('c')) {
      return 'Boa captura, avaliando corretamente a troca de material.';
    } else if (move.piece === 'n' && (move.to[1] === '5' || move.to[1] === '4')) {
      return 'Cavalos são fortes em posições centrais.';
    } else if (move.piece === 'r' && (move.to[0] === 'd' || move.to[0] === 'e')) {
      return 'Torres em colunas centrais podem controlar importantes áreas do tabuleiro.';
    }
  } else {
    // Final
    if (move.piece === 'k' && quality !== 'Erro grave (blunder)' && quality !== 'Erro (mistake)') {
      return 'No final, o rei deve se tornar uma peça ativa.';
    } else if (move.piece === 'p' && (move.to[1] === '7' || move.to[1] === '2')) {
      return 'Avançar peões no final pode criar peões passados decisivos.';
    }
  }
  
  // Comentários baseados na qualidade da jogada
  switch (quality) {
    case 'Erro grave (blunder)':
      return 'Esta jogada perde material significativo ou posição. Considere analisar alternativas.';
    case 'Erro (mistake)':
      return 'Esta jogada não é ideal. Tente procurar ameaças do oponente antes de jogar.';
    case 'Imprecisão':
      return 'Há uma jogada melhor disponível. Tente calcular mais variantes.';
    case 'Jogada OK':
      return 'Uma jogada razoável que mantém o equilíbrio.';
    case 'Boa jogada':
      return 'Excelente jogada que maximiza suas chances.';
    default:
      return 'Analise cuidadosamente esta posição.';
  }
}

module.exports = stockfishService;
