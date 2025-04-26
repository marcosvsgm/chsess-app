import React from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Xadrez</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Aprenda xadrez de forma interativa com nossa IA que se adapta ao seu nível e oferece dicas personalizadas para melhorar o seu jogo.
        </p>
        <div className="mt-8">
          <Link 
            to="/game" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium inline-block"
          >
            Começar a Jogar
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4 text-blue-600">🎓</div>
          <h2 className="text-2xl font-semibold mb-2">Aprenda Jogando</h2>
          <p>
            Nossa IA fornece dicas e explicações durante o jogo, ajudando você a entender os princípios do xadrez enquanto joga.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4 text-blue-600">📈</div>
          <h2 className="text-2xl font-semibold mb-2">Evolua Constantemente</h2>
          <p>
            A IA se adapta ao seu nível, oferecendo desafios adequados à medida que você melhora suas habilidades.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4 text-blue-600">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">Análise Detalhada</h2>
          <p>
            Receba feedback após cada partida, identificando pontos fortes e áreas para melhorar no seu jogo.
          </p>
        </div>
      </section>

      <section className="bg-gray-100 p-8 rounded-lg mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Como Funciona</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Jogue</h3>
            <p>Comece uma partida contra nossa IA adaptativa</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Receba Dicas</h3>
            <p>Obtenha sugestões e explicações durante o jogo</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Analise</h3>
            <p>Veja a análise detalhada das suas jogadas</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">4</span>
            </div>
            <h3 className="font-semibold mb-2">Evolua</h3>
            <p>Acompanhe seu progresso e melhore suas habilidades</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">Pronto para melhorar seu jogo?</h2>
        <Link 
          to="/game" 
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium inline-block"
        >
          Jogar Agora
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
