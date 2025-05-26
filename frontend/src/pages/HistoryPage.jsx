import React, { useState } from 'react';

const HistoryPage = () => {
  const [games] = useState([
    {
      id: 1,
      date: '2025-04-20',
      result: 'victory',
      opponent: 'IA Nível Iniciante',
      moves: 24,
      evaluation: 0.8,
      opening: 'Defesa Siciliana',
      timeSpent: '12m',
      mistakes: 1,
      blunders: 0,
      accuracy: 92
    },
    {
      id: 2,
      date: '2025-04-19',
      result: 'defeat',
      opponent: 'IA Nível Intermediário',
      moves: 32,
      evaluation: -1.2,
      opening: 'Abertura Italiana',
      timeSpent: '18m',
      mistakes: 2,
      blunders: 1,
      accuracy: 78
    },
    {
      id: 3,
      date: '2025-04-18',
      result: 'draw',
      opponent: 'IA Nível Iniciante',
      moves: 45,
      evaluation: 0.1,
      opening: 'Defesa Francesa',
      timeSpent: '25m',
      mistakes: 0,
      blunders: 0,
      accuracy: 88
    },
    {
      id: 4,
      date: '2025-04-17',
      result: 'victory',
      opponent: 'IA Nível Iniciante',
      moves: 18,
      evaluation: 2.3,
      opening: 'Abertura Espanhola',
      timeSpent: '9m',
      mistakes: 0,
      blunders: 0,
      accuracy: 97
    }
  ]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [modalType, setModalType] = useState(null); // 'detalhes' ou 'analise'

  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  React.useEffect(() => {
    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const openModal = (game, type) => {
    setSelectedGame(game);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedGame(null);
    setModalType(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Histórico de Partidas</h1>
      
      <div className="flex justify-end mb-4">
        <label className="mr-2 font-medium text-gray-700 dark:text-gray-200">Tema:</label>
        <select
          value={theme}
          onChange={handleThemeChange}
          className="border rounded px-2 py-1"
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="auto">Automático</option>
        </select>
      </div>

      <div className="bg-black p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-white mb-4">Minhas Partidas</h2>
        <p className="text-gray-300 mb-4">Aqui estão suas partidas recentes. Clique em "Ver Detalhes" para mais informações.</p>
        <p className="text-gray-300 mb-4">Você pode analisar suas jogadas e melhorar sua estratégia.</p>
        <p className="text-gray-300 mb-4">Use as dicas para aprimorar seu jogo.</p>
        <p className="text-gray-300 mb-4">Acompanhe seu progresso e veja como você está se saindo contra diferentes oponentes.</p>
        <p className="text-gray-300 mb-4">Aproveite o aprendizado e divirta-se jogando!</p>
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
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => openModal(game, 'detalhes')}
                  >
                    Ver Detalhes
                  </button>
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => openModal(game, 'analise')}
                  >
                    Analisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={closeModal}
              title="Fechar"
            >
              &times;
            </button>
            {modalType === 'detalhes' ? (
              <>
                <h2 className="text-xl font-bold mb-4">Detalhes da Partida</h2>
                <ul className="mb-4 space-y-1">
                  <li><strong>Data:</strong> {selectedGame.date}</li>
                  <li><strong>Resultado:</strong> {selectedGame.result === 'victory' ? 'Vitória' : selectedGame.result === 'defeat' ? 'Derrota' : 'Empate'}</li>
                  <li><strong>Oponente:</strong> {selectedGame.opponent}</li>
                  <li><strong>Jogadas:</strong> {selectedGame.moves}</li>
                  <li><strong>Avaliação final:</strong> {selectedGame.evaluation > 0 ? '+' : ''}{selectedGame.evaluation.toFixed(1)}</li>
                  <li><strong>Abertura:</strong> {selectedGame.opening}</li>
                  <li><strong>Tempo gasto:</strong> {selectedGame.timeSpent}</li>
                  <li><strong>Erros:</strong> {selectedGame.mistakes}</li>
                  <li><strong>Erros graves:</strong> {selectedGame.blunders}</li>
                  <li><strong>Precisão:</strong> {selectedGame.accuracy}%</li>
                </ul>
                <div className="bg-gray-100 rounded p-3 text-sm text-gray-700">
                  <strong>Dica:</strong> {selectedGame.mistakes === 0 && selectedGame.blunders === 0
                    ? 'Parabéns! Você não cometeu erros nesta partida.'
                    : selectedGame.mistakes > 0
                      ? 'Tente revisar suas jogadas para reduzir o número de erros nas próximas partidas.'
                      : 'Continue praticando para melhorar ainda mais sua precisão!'}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Análise da Partida</h2>
                <ul className="mb-4 space-y-1">
                  <li><strong>ID da partida:</strong> {selectedGame.id}</li>
                  <li><strong>Abertura:</strong> {selectedGame.opening}</li>
                  <li><strong>Precisão:</strong> {selectedGame.accuracy}%</li>
                  <li><strong>Erros:</strong> {selectedGame.mistakes}</li>
                  <li><strong>Erros graves:</strong> {selectedGame.blunders}</li>
                  <li><strong>Tempo gasto:</strong> {selectedGame.timeSpent}</li>
                  <li><strong>Jogadas:</strong> {selectedGame.moves}</li>
                  <li><strong>Avaliação final:</strong> {selectedGame.evaluation > 0 ? '+' : ''}{selectedGame.evaluation.toFixed(1)}</li>
                </ul>
                <div className="bg-blue-50 rounded p-3 text-sm text-blue-800 mb-2">
                  <strong>Sugestão:</strong> {selectedGame.accuracy >= 90
                    ? 'Excelente precisão! Continue assim.'
                    : selectedGame.accuracy >= 80
                      ? 'Muito bom! Tente revisar os lances críticos para chegar ainda mais longe.'
                      : 'Que tal analisar os principais erros e estudar aberturas para melhorar seu desempenho?'}
                </div>
                <div className="bg-yellow-50 rounded p-3 text-sm text-yellow-800">
                  <strong>Próximos passos:</strong> Reveja as jogadas onde a avaliação mudou drasticamente e tente entender o motivo.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 bg-black rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Estatísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">Total de Partidas</h3>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{games.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Vitórias</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              {games.filter(game => game.result === 'victory').length}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Derrotas</h3>
            <p className="text-3xl font-bold text-red-900 dark:text-red-100">
              {games.filter(game => game.result === 'defeat').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
