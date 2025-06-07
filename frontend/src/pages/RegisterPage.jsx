import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Limpa o erro quando o usuário começa a digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação dos campos
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const result = await register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Erro ao criar conta. Tente novamente.');
      console.error('Erro ao registrar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ios-background">
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="card-ios w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome"
                className="input-ios"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Digite seu email"
                className="input-ios"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Digite sua senha"
                className="input-ios"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium" htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                className="input-ios"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-ios btn-ios-primary w-full mt-6 ${loading ? 'opacity-70' : ''}`}
            >
              {loading ? 'Criando conta...' : 'Registrar'}
            </button>
            
            <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Faça login
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;

