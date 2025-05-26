import React, { useState } from 'react';

const ProfilePage = () => {
  // Dados simulados do perfil do usuário
  // Em uma implementação real, estes dados viriam da API do backend
  const [profile] = useState({
    name: 'Jogador',
    level: 'Intermediário',
    gamesPlayed: 42,
    winRate: 65,
    rating: 1250,
    joinDate: '2025-01-15',
    learningProgress: {
      openings: 70,
      middleGame: 55,
      endGame: 40,
      tactics: 65
    },
    recentAchievements: [
      { id: 1, title: 'Primeira Vitória', date: '2025-01-20', icon: '🏆' },
      { id: 2, title: 'Série de 5 Vitórias', date: '2025-02-10', icon: '🔥' },
      { id: 3, title: 'Mestre das Aberturas', date: '2025-03-05', icon: '📚' },
      { id: 4, title: 'Tático Brilhante', date: '2025-04-01', icon: '⚡' }
    ]
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Perfil do Jogador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-1">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
              {profile.name.charAt(0)}
            </div>
            <h2 className="text-xl font-semibold mt-4">{profile.name}</h2>
            <p className="text-gray-600">Nível: {profile.level}</p>
            <p className="text-gray-600">Rating: {profile.rating}</p>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Partidas Jogadas:</span>
              <span className="font-medium">{profile.gamesPlayed}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Taxa de Vitória:</span>
              <span className="font-medium">{profile.winRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Membro desde:</span>
              <span className="font-medium">{profile.joinDate}</span>
            </div>
          </div>
        </div>
        
        {/* Progresso de Aprendizado */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2 flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Progresso de Aprendizado</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Aberturas</span>
                <span>{profile.learningProgress.openings}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${profile.learningProgress.openings}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Meio-jogo</span>
                <span>{profile.learningProgress.middleGame}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${profile.learningProgress.middleGame}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Final</span>
                <span>{profile.learningProgress.endGame}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-yellow-600 h-2.5 rounded-full" 
                  style={{ width: `${profile.learningProgress.endGame}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Táticas</span>
                <span>{profile.learningProgress.tactics}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${profile.learningProgress.tactics}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Resumo rápido */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{profile.gamesPlayed}</div>
              <div className="text-sm text-blue-700">Partidas Jogadas</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{profile.winRate}%</div>
              <div className="text-sm text-green-700">Taxa de Vitória</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-700">{profile.rating}</div>
              <div className="text-sm text-yellow-700">Rating Atual</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{profile.recentAchievements.length}</div>
              <div className="text-sm text-purple-700">Conquistas</div>
            </div>
          </div>

          {/* Recomendações de estudo */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Recomendações de Estudo</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Pratique mais finais de jogo para melhorar sua pontuação nessa área.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Continue estudando táticas para identificar padrões comuns.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Experimente novas aberturas para expandir seu repertório.</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Conquistas Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Conquistas Recentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {profile.recentAchievements.map(achievement => (
              <div key={achievement.id} className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-medium">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mr-4">
          Editar Perfil
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
          Exportar Estatísticas
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
