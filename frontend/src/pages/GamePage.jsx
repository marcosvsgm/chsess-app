import React, { useState } from 'react';
import ChessGame from '../components/ChessGame';

const GamePage = () => {
  const [difficulty, setDifficulty] = useState('beginner');
  const [analysis, setAnalysis] = useState([]);
  
  const handleAnalysis = (data) => {
    setAnalysis(prev => [...prev, data]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Jogo de Xadrez Educativo</h1>
      
      <div className="mb-6">
        <label className="bg-black p-6 rounded-lg shadow-md">Nível de Dificuldade:</label>
        <select 
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="bg-black p-6 rounded-lg shadow-md">

          <option value="beginner">Iniciante</option>
          <option value="intermediate">Intermediário</option>
          <option value="advanced">Avançado</option>
        </select>
      </div>
      
      <div cclassName="bg-black p-6 rounded-lg shadow-md">
        <ChessGame 
          difficulty={difficulty} 
          onAnalysis={handleAnalysis} 
        />
      </div>
      
      {analysis.length > 0 && (
        <div className="bg-black p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Análise da Partida</h2>
          <div className="space-y-4">
            {analysis.map((item, index) => (
              <div key={index} className="border-b pb-3">
                <div className="flex justify-between">
                  <span className="font-medium">{item.move}</span>
                  <span className={`font-medium ${item.evaluation > 0 ? 'text-green-600' : item.evaluation < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {item.evaluation > 0 ? '+' : ''}{item.evaluation.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-700 mt-1">{item.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
