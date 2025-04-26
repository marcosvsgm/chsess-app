import React, { useState } from 'react';

const HistoryPage = () => {
  // Dados simulados de histórico de partidas
  // Em uma implementação real, estes dados viriam da API do backend
  const [games] = useState([
    {
      id: 1,
      date: '2025-04-20',
      result: 'victory',
      opponent: 'IA Nível Iniciante',
      moves: 24,
      evaluation: 0.8
    },
    {
      id: 2,
      date: '2025-04-19',
      result: 'defeat',
      opponent: 'IA Nível Intermediário',
      moves: 32,
      evaluation: -1.2
    },
    {
      id: 3,
      date: '2025-04-18',
      result: 'draw',
      opponent: 'IA Nível Iniciante',
      moves: 45,
      evaluation: 0.1
    },
    {
      id: 4,
      date: '2025-04-17',
      result: 'victory',
      opponent: 'IA Nível Iniciante',
      moves: 18,
      evaluation: 2.3
    }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Histórico de Partidas</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resultado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Oponente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jogadas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avaliação
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {games.map((game) => (
              <tr key={game.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{game.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${game.result === 'victory' ? 'bg-green-100 text-green-800' : 
                      game.result === 'defeat' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {game.result === 'victory' ? 'Vitória' : 
                     game.result === 'defeat' ? 'Derrota' : 'Empate'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{game.opponent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{game.moves}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    game.evaluation > 0 ? 'text-green-600' : 
                    game.evaluation < 0 ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    {game.evaluation > 0 ? '+' : ''}{game.evaluation.toFixed(1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    Ver Detalhes
                  </button>
                  <button className="text-blue-600 hover:text-blue-900">
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Total de Partidas</h3>
            <p className="text-3xl font-bold">{games.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Vitórias</h3>
            <p className="text-3xl font-bold">
              {games.filter(game => game.result === 'victory').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-2">Derrotas</h3>
            <p className="text-3xl font-bold">
              {games.filter(game => game.result === 'defeat').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
