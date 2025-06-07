import React, { useState, useEffect } from 'react';

const HistoryPage = () => {
  const [games] = useState([
    { id: 1, date: '2025-04-20', result: 'victory', opponent: 'IA Nível Iniciante', moves: 24, evaluation: 0.8, opening: 'Defesa Siciliana', timeSpent: '12m', mistakes: 1, blunders: 0, accuracy: 92 },
    { id: 2, date: '2025-04-19', result: 'defeat', opponent: 'IA Nível Intermediário', moves: 32, evaluation: -1.2, opening: 'Abertura Italiana', timeSpent: '18m', mistakes: 2, blunders: 1, accuracy: 78 },
    { id: 3, date: '2025-04-18', result: 'draw', opponent: 'IA Nível Iniciante', moves: 45, evaluation: 0.1, opening: 'Defesa Francesa', timeSpent: '25m', mistakes: 0, blunders: 0, accuracy: 88 },
    { id: 4, date: '2025-04-17', result: 'victory', opponent: 'IA Nível Iniciante', moves: 18, evaluation: 2.3, opening: 'Abertura Espanhola', timeSpent: '9m', mistakes: 0, blunders: 0, accuracy: 97 }
  ]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const isDark = theme === 'auto'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (e) => setTheme(e.target.value);

  const openModal = (game, type) => {
    setSelectedGame(game);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedGame(null);
    setModalType(null);
  };

  const StatCard = ({ title, value, color }) => (
    <div className={`p-4 rounded-xl shadow-md bg-${color}-100 dark:bg-${color}-900`}>
      <h3 className={`text-md font-medium text-${color}-800 dark:text-${color}-200`}>{title}</h3>
      <p className={`text-3xl font-bold text-${color}-900 dark:text-${color}-100`}>{value}</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900 dark:text-gray-100">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Histórico de Partidas</h1>
        <select
          value={theme}
          onChange={handleThemeChange}
          className="mt-4 p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="auto">Automático</option>
        </select>
      </header>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-2">Minhas Partidas</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Clique em <strong>"Ver Detalhes"</strong> ou <strong>"Analisar"</strong> para mais informações sobre cada partida.
        </p>

        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {['Data', 'Resultado', 'Oponente', 'Jogadas', 'Avaliação', 'Ações'].map((col) => (
                  <th key={col} className="px-6 py-3 text-left font-semibold tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <td className="px-6 py-4">{game.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      game.result === 'victory' ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      game.result === 'defeat' ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-100' :
                      'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                    }`}>
                      {game.result === 'victory' ? 'Vitória' : game.result === 'defeat' ? 'Derrota' : 'Empate'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{game.opponent}</td>
                  <td className="px-6 py-4">{game.moves}</td>
                  <td className={`px-6 py-4 ${
                    game.evaluation > 0 ? 'text-green-600' :
                    game.evaluation < 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {game.evaluation > 0 ? '+' : ''}{game.evaluation.toFixed(1)}
                  </td>
                  <td className="px-6 py-4 space-x-2 text-blue-600 dark:text-blue-400">
                    <button onClick={() => openModal(game, 'detalhes')} className="hover:underline">Ver Detalhes</button>
                    <button onClick={() => openModal(game, 'analise')} className="hover:underline">Analisar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-xl transition-all duration-300">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4">{modalType === 'detalhes' ? 'Detalhes da Partida' : 'Análise da Partida'}</h2>
            <ul className="space-y-2 text-sm">
              {Object.entries(selectedGame).map(([key, value]) => (
                <li key={key}>
                  <strong className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</strong> {typeof value === 'number' && key === 'evaluation' ? (value > 0 ? '+' : '') + value.toFixed(1) : value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <section className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Estatísticas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard title="Total de Partidas" value={games.length} color="blue" />
          <StatCard title="Vitórias" value={games.filter(g => g.result === 'victory').length} color="green" />
          <StatCard title="Derrotas" value={games.filter(g => g.result === 'defeat').length} color="red" />
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;
