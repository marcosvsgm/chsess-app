import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Barra de Login/Registro */}
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-end items-center space-x-4">
          <Link 
            to="/login" 
            className="text-white hover:text-blue-400 font-medium"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Registrar
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Xadrez IA</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-700">
            Aprenda xadrez de forma interativa com nossa IA que se adapta ao seu nível e oferece dicas personalizadas para melhorar o seu jogo.
          </p>
          <div className="mt-8">
            <Link 
              to="/game" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
            >
              Começar a Jogar
            </Link>
          </div>
        </section>

        {/* Cards de Benefícios */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              emoji: '🎓',
              title: 'Aprenda Jogando',
              desc: 'Nossa IA fornece dicas e explicações durante o jogo, ajudando você a entender os princípios do xadrez enquanto joga.',
            },
            {
              emoji: '📈',
              title: 'Evolua Constantemente',
              desc: 'A IA se adapta ao seu nível, oferecendo desafios adequados à medida que você melhora suas habilidades.',
            },
            {
              emoji: '🔍',
              title: 'Análise Detalhada',
              desc: 'Receba feedback após cada partida, identificando pontos fortes e áreas para melhorar no seu jogo.',
            },
          ].map(({ emoji, title, desc }, idx) => (
            <article
              key={idx}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4 text-blue-600">{emoji}</div>
              <h2 className="text-2xl font-semibold mb-2">{title}</h2>
              <p className="text-gray-700">{desc}</p>
            </article>
          ))}
        </section>

        {/* Etapas do Processo */}
        <section className="bg-white p-8 rounded-lg shadow-md mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Jogue', desc: 'Comece uma partida contra nossa IA adaptativa' },
              { step: '2', title: 'Receba Dicas', desc: 'Obtenha sugestões e explicações durante o jogo' },
              { step: '3', title: 'Analise', desc: 'Veja a análise detalhada das suas jogadas' },
              { step: '4', title: 'Evolua', desc: 'Acompanhe seu progresso e melhore suas habilidades' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{step}</span>
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para melhorar seu jogo?</h2>
          <Link 
            to="/game" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
          >
            Jogar Agora
          </Link>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
