import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Ocorreu um erro durante o login. Tente novamente.');
      console.error('Erro de login:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ios-background">
      {/* Formulário centralizado */}
      <main className="flex flex-1 items-center justify-center p-6">
        <form 
          onSubmit={handleSubmit}
          className="card-ios w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-ios"
              placeholder="Digite seu email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="input-ios"
              placeholder="Digite sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`btn-ios btn-ios-primary w-full ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
            Não tem conta?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Cadastre-se
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default LoginPage;

