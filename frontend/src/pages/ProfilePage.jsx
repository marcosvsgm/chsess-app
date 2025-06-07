import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_URL } from '../config';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [stats, setStats] = useState({
    totalGames: 0,
    victories: 0,
    defeats: 0,
    draws: 0,
    winRate: 0,
    learningProgress: {
      openings: 0,
      middleGame: 0,
      endGame: 0,
      tactics: 0
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profilePicture: null
      });
      
      // Se o usuário tiver uma foto de perfil, definir a URL de visualização
      if (user.profilePictureUrl) {
        setPreviewUrl(user.profilePictureUrl);
      }
      
      // Buscar estatísticas do usuário
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/statistics`);
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar o tipo de arquivo
      if (!file.type.match('image.*')) {
        setError('Por favor, selecione uma imagem válida.');
        return;
      }
      
      // Verificar o tamanho do arquivo (limite de 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter menos de 5MB.');
        return;
      }
      
      // Atualizar o estado com o arquivo selecionado
      setFormData(prev => ({
        ...prev,
        profilePicture: file
      }));
      
      // Criar URL de visualização
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação
    if (!formData.name || !formData.email) {
      setError('Nome e email são obrigatórios.');
      return;
    }
    
    // Validação de senha (apenas se estiver tentando alterar a senha)
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setError('A senha atual é obrigatória para alterar a senha.');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('As novas senhas não coincidem.');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Criar FormData para envio de arquivo
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      
      if (formData.currentPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
      }
      
      if (formData.newPassword) {
        formDataToSend.append('newPassword', formData.newPassword);
      }
      
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }
      
      // Enviar dados para a API
      const response = await axios.put(`${API_URL}/users/profile`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 200) {
        setSuccess('Perfil atualizado com sucesso!');
        setIsEditing(false);
        
        // Atualizar o contexto de autenticação com os novos dados do usuário
        const updatedUser = response.data;
        // Aqui você precisaria atualizar o contexto de autenticação com os novos dados
        
        // Limpar campos de senha
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          profilePicture: null
        }));
      } else {
        setError('Erro ao atualizar perfil. Tente novamente.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.');
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-8">Carregando informações do perfil...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Perfil do Jogador</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informações do Perfil */}
        <div className="card-ios md:col-span-1">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-4">
                  {success}
                </div>
              )}
              
              {/* Foto de Perfil */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Foto de Perfil</label>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden mb-3">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Prévia da foto de perfil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                        {formData.name.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <label className="btn-ios btn-ios-secondary py-2 px-4 cursor-pointer">
                    Alterar Foto
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="name">Nome</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-ios"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-ios"
                  required
                />
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h3 className="font-medium mb-2">Alterar Senha (opcional)</h3>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2" htmlFor="currentPassword">Senha Atual</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="input-ios"
                  />
                </div>
                
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-2" htmlFor="newPassword">Nova Senha</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input-ios"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="confirmPassword">Confirmar Nova Senha</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-ios"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-ios btn-ios-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-ios btn-ios-primary ${loading ? 'opacity-70' : ''}`}
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="text-center mb-6">
                {user.profilePictureUrl ? (
                  <img 
                    src={user.profilePictureUrl} 
                    alt="Foto de perfil" 
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Partidas Jogadas:</span>
                  <span className="font-medium">{stats.totalGames}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Taxa de Vitória:</span>
                  <span className="font-medium">{stats.winRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Vitórias:</span>
                  <span className="font-medium">{stats.victories}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Derrotas:</span>
                  <span className="font-medium">{stats.defeats}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Empates:</span>
                  <span className="font-medium">{stats.draws}</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(true)}
                className="btn-ios btn-ios-primary w-full mt-6"
              >
                Editar Perfil
              </button>
            </>
          )}
        </div>
        
        {/* Progresso de Aprendizado */}
        <div className="card-ios md:col-span-2 flex flex-col justify-between">
          <h2 className="text-xl font-semibold mb-4">Progresso de Aprendizado</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Aberturas</span>
                <span>{stats.learningProgress?.openings || 0}%</span>
              </div>
              <div className="progress-ios">
                <div 
                  className="progress-bar-ios" 
                  style={{ width: `${stats.learningProgress?.openings || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Meio-jogo</span>
                <span>{stats.learningProgress?.middleGame || 0}%</span>
              </div>
              <div className="progress-ios">
                <div 
                  className="progress-bar-ios bg-green-500" 
                  style={{ width: `${stats.learningProgress?.middleGame || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Final</span>
                <span>{stats.learningProgress?.endGame || 0}%</span>
              </div>
              <div className="progress-ios">
                <div 
                  className="progress-bar-ios bg-yellow-500" 
                  style={{ width: `${stats.learningProgress?.endGame || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Táticas</span>
                <span>{stats.learningProgress?.tactics || 0}%</span>
              </div>
              <div className="progress-ios">
                <div 
                  className="progress-bar-ios bg-purple-500" 
                  style={{ width: `${stats.learningProgress?.tactics || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Resumo rápido */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalGames}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Partidas Jogadas</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.winRate.toFixed(1)}%</div>
              <div className="text-sm text-green-600 dark:text-green-400">Taxa de Vitória</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.victories}</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Vitórias</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.defeats}</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Derrotas</div>
            </div>
          </div>

          {/* Recomendações de estudo */}
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Recomendações de Estudo</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Pratique mais finais de jogo para melhorar sua pontuação nessa área.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Continue estudando táticas para identificar padrões comuns.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Experimente novas aberturas para expandir seu repertório.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

