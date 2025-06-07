import React, { useState } from 'react';
import ChessGame from '../components/ChessGame';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';


const GamePage = () => {
  const [difficulty, setDifficulty] = useState('beginner');
  const [analysis, setAnalysis] = useState([]);
  const [moves, setMoves] = useState([]);

  const handleAnalysis = (data) => {
    setAnalysis(prev => [...prev, data]);
  };

  const handleNewMove = (move) => {
    setMoves(prev => [...prev, move]);
  };

  const resetAnalysis = () => setAnalysis([]);
  const resetMoves = () => setMoves([]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800 drop-shadow-lg">
        🧠 Jogo de Xadrez Educativo
      </h1>

      <div className="flex flex-col justify-center items-center gap-12 md:flex-row md:gap-8">
        {/* Painel do jogo */}
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-xl">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              🎯 Nível de Dificuldade:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-white text-gray-800 shadow focus:ring-2 focus:ring-blue-400"
            >
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermediário</option>
              <option value="advanced">Avançado</option>
            </select>
          </div>

          <div className="rounded-lg overflow-hidden border shadow-inner">
            <ChessGame
              difficulty={difficulty}
              onAnalysis={handleAnalysis}
              onNewMove={handleNewMove}
            />
          </div>

          <div className="flex justify-between mt-4 gap-2">
            <button
              onClick={resetMoves}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
            >
              🔄 Reiniciar
            </button>
            <button
              onClick={resetAnalysis}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              🧹 Limpar Análise
            </button>
          </div>
        </div>

        {/* Painel lateral de análise */}
        <AnimatePresence>
          {analysis.length > 0 && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full md:max-w-lg bg-white p-6 rounded-2xl shadow-xl h-fit"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                📊 Análise da Partida
              </h2>
              <div className="divide-y divide-gray-200 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {analysis.map((item, index) => (
                  <div key={index} className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">{item.move}</span>
                      <span
                        className={`text-sm font-bold ${
                          item.evaluation > 0
                            ? 'text-green-600'
                            : item.evaluation < 0
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {item.evaluation > 0 ? '+' : ''}
                        {item.evaluation.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.comment && item.comment.trim() !== ''
                        ? item.comment
                        : 'Sem análise para este lance.'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gráfico de evolução da partida */}
        {analysis.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-xl max-w-4xl w-full"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📈 Evolução da Partida
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analysis.map((a, i) => ({ name: `L${i + 1}`, eval: a.evaluation }))}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis domain={[-5, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="eval" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
