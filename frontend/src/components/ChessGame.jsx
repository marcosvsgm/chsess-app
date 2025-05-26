import React, { useState, useEffect, useCallback } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessGame = ({ difficulty = 'beginner', onAnalysis }) => {
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState('start');
  const [moveHistory, setMoveHistory] = useState([]);
  const [hint, setHint] = useState(null);
  const [tip, setTip] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  
  // Verificar se o jogador está demorando muito para jogar
  useEffect(() => {
    if (game.turn() === 'w' && !game.isGameOver()) {
      const timer = setTimeout(() => {
        if (Date.now() - lastMoveTime > 30000) { // 30 segundos
          provideTip();
        }
      }, 30000);
      
      return () => clearTimeout(timer);
    }
  }, [game, lastMoveTime]);
  
  // Função para fornecer dicas baseadas na posição atual
  const provideTip = useCallback(() => {
    // Aqui seria integrado com a IA para fornecer dicas educativas
    const tips = [
      "Tente controlar o centro do tabuleiro com seus peões e cavalos.",
      "Desenvolva suas peças antes de avançar com a dama.",
      "Proteja seu rei fazendo o roque o mais cedo possível.",
      "Observe as ameaças do seu oponente antes de fazer sua jogada.",
      "Cavalos são mais fortes em posições centrais do que nas bordas."
    ];
    
    setTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);
  
  // Função para mostrar uma dica de movimento
  const showHintMove = () => {
    setThinking(true);
    // Aqui seria integrado com a engine Stockfish para calcular a melhor jogada
    setTimeout(() => {
      // Simulação de uma dica (seria substituída pela análise real da engine)
      const possibleMoves = game.moves({ verbose: true });
      if (possibleMoves.length > 0) {
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        setHint({
          from: randomMove.from,
          to: randomMove.to
        });
        setShowHint(true);
      }
      setThinking(false);
    }, 1000);
  };
  
  // Função para fazer uma jogada
  const makeMove = (move) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      
      if (result) {
        setGame(gameCopy);
        setPosition(gameCopy.fen());
        setMoveHistory([...moveHistory, result.san]);
        setLastMoveTime(Date.now());
        setShowHint(false);
        setHint(null);
        
        // Após a jogada do jogador, a IA responde
        setTimeout(() => {
          makeAIMove(gameCopy);
        }, 500);
        
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };
  
  // Função para a IA fazer uma jogada
  const makeAIMove = (currentGame) => {
    if (currentGame.isGameOver() || currentGame.isDraw()) return;
    
    setThinking(true);
    // Aqui seria integrado com a engine Stockfish
    setTimeout(() => {
      try {
        const possibleMoves = currentGame.moves({ verbose: true });
        if (possibleMoves.length > 0) {
          // Simulação de jogada da IA (seria substituída pela análise real da engine)
          const aiMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          const newGame = new Chess(currentGame.fen());
          const move = newGame.move({
            from: aiMove.from,
            to: aiMove.to,
            promotion: 'q' // sempre promove para rainha
          });
          
          setGame(newGame);
          setPosition(newGame.fen());
          setMoveHistory([...moveHistory, move.san]);
          
          // Análise educativa após a jogada da IA
          if (onAnalysis) {
            onAnalysis({
              move: move.san,
              evaluation: Math.random() * 2 - 1, // simulação de avaliação
              comment: "Esta jogada controla o centro e desenvolve uma peça."
            });
          }
        }
      } catch (e) {
        console.error("Erro ao fazer jogada da IA:", e);
      }
      setThinking(false);
    }, 1000);
  };
  
  // Função para lidar com o movimento de peças pelo jogador
  const onDrop = (sourceSquare, targetSquare) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // sempre promove para rainha
    };
    
    return makeMove(move);
  };
  
  // Função para reiniciar o jogo
  const resetGame = () => {
    setGame(new Chess());
    setPosition('start');
    setMoveHistory([]);
    setHint(null);
    setShowHint(false);
    setTip('');
  };
  
  return (
    <div className="chess-game">
      <div className="chess-board">
        <Chessboard 
          position={position} 
          onPieceDrop={onDrop}
          customSquareStyles={
            showHint && hint ? {
              [hint.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
              [hint.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
            } : {}
          }
        />
      </div>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4">
      <div className="move-history bg-gray-400 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Histórico de Jogadas</h3>
          <div className="move-history bg-gray-100 p-3 rounded">
            {moveHistory.map((move, index) => (
              <span key={index} className="inline-block mr-2 mb-1">
                {index % 2 === 0 ? `${Math.floor(index/2) + 1}.` : ''} {move}
              </span>
            ))}
            {moveHistory.length === 0 && <p className="text-gray-500">Nenhuma jogada ainda.</p>}
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h3 className="text-lg font-semibold mb-2">Assistente de Xadrez</h3>
          
          {tip && (
            <div className="tip-container p-3 mb-3">
              <p className="font-medium">Dica:</p>
              <p>{tip}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <button 
              onClick={showHintMove}
              disabled={thinking || game.isGameOver()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {thinking ? 'Pensando...' : 'Mostrar Dica'}
            </button>
            
            <button 
              onClick={provideTip}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Pedir Ajuda
            </button>
            
            <button 
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Reiniciar
            </button>
          </div>
          
          {game.isGameOver() && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
              <p className="font-bold">Jogo finalizado!</p>
              <p>
                {game.isCheckmate() 
                  ? `Xeque-mate! ${game.turn() === 'w' ? 'Pretas' : 'Brancas'} vencem!` 
                  : game.isDraw() 
                    ? `Empate: ${
                        game.isStalemate() ? 'por afogamento' : 
                        game.isThreefoldRepetition() ? 'por repetição' : 
                        game.isInsufficientMaterial() ? 'por material insuficiente' : 
                        'regra dos 50 movimentos'
                      }`
                    : 'Jogo finalizado.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
