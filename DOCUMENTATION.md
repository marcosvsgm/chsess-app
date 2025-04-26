# Documentação do Projeto de Xadrez Educativo com IA

## Visão Geral

Este projeto é um jogo de xadrez web educativo com IA adaptativa que ensina o jogador e oferece análise e feedback. O sistema é composto por um frontend React, um backend Node.js/Express, e utiliza a engine de xadrez Stockfish para análise e jogadas da IA.

## Estrutura do Projeto

```
chess-app/
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── assets/         # Recursos estáticos
│   │   ├── App.jsx         # Componente principal
│   │   └── main.jsx        # Ponto de entrada
│   ├── public/             # Arquivos públicos
│   ├── index.html          # HTML principal
│   ├── vite.config.js      # Configuração do Vite
│   └── package.json        # Dependências do frontend
│
└── backend/                # Servidor Node.js/Express
    ├── src/
    │   ├── controllers/    # Controladores da API
    │   ├── models/         # Modelos de dados
    │   ├── routes/         # Rotas da API
    │   ├── services/       # Serviços (Stockfish, IA educativa)
    │   ├── utils/          # Utilitários
    │   ├── config/         # Configurações
    │   └── index.js        # Ponto de entrada do servidor
    ├── prisma/
    │   └── schema.prisma   # Schema do banco de dados
    └── package.json        # Dependências do backend
```

## Requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- NPM ou Yarn

## Instalação e Execução Local

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd chess-app
```

### 2. Configurar o Backend

```bash
# Entrar no diretório do backend
cd backend

# Instalar dependências
npm install

# Copiar o arquivo de ambiente de exemplo
cp .env.example .env

# Editar o arquivo .env com suas configurações de banco de dados
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/chess_app"

# Executar as migrações do Prisma para criar o banco de dados
npx prisma migrate dev --name init

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```

O servidor backend estará disponível em `http://localhost:5000`.

### 3. Configurar o Frontend

```bash
# Em outro terminal, entrar no diretório do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O aplicativo frontend estará disponível em `http://localhost:3000`.

## Funcionalidades Principais

### Frontend

1. **Tabuleiro Interativo**
   - Arrastar e soltar peças
   - Visualização de jogadas legais
   - Animações de movimento

2. **Modo de Ensino**
   - Dicas durante o jogo
   - Feedback visual para jogadas boas e ruins
   - Sugestões de jogadas alternativas

3. **Análise de Partidas**
   - Visualização de erros e acertos
   - Gráfico de avaliação da partida
   - Recomendações personalizadas

4. **Perfil do Jogador**
   - Histórico de partidas
   - Estatísticas de desempenho
   - Progresso de aprendizado

### Backend

1. **API RESTful**
   - Autenticação de usuários
   - Gerenciamento de partidas
   - Análise de jogadas

2. **Integração com Stockfish**
   - Avaliação de posições
   - Geração de melhores jogadas
   - Análise completa de partidas

3. **IA Educativa Adaptativa**
   - Ajuste de dificuldade baseado no desempenho
   - Dicas personalizadas conforme o nível do jogador
   - Feedback educativo após as partidas
   - Planos de estudo personalizados

## Deploy em Produção

### Deploy do Backend

#### Opção 1: Railway

1. Crie uma conta no [Railway](https://railway.app/)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `PORT`: 5000
   - `NODE_ENV`: production
   - `DATABASE_URL`: URL fornecida pelo PostgreSQL do Railway
   - `JWT_SECRET`: Sua chave secreta para JWT
4. Adicione um serviço PostgreSQL
5. Deploy automático a partir do seu repositório

#### Opção 2: Render

1. Crie uma conta no [Render](https://render.com/)
2. Crie um novo Web Service e conecte seu repositório
3. Configure:
   - Build Command: `cd backend && npm install && npx prisma generate`
   - Start Command: `cd backend && npm start`
   - Environment Variables (mesmas do Railway)
4. Adicione um banco de dados PostgreSQL
5. Deploy o serviço

### Deploy do Frontend

#### Opção 1: Vercel

1. Crie uma conta no [Vercel](https://vercel.com/)
2. Importe seu repositório GitHub
3. Configure:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: dist
4. Configure variáveis de ambiente:
   - `VITE_API_URL`: URL do seu backend (ex: https://seu-backend.railway.app)
5. Deploy o projeto

#### Opção 2: Netlify

1. Crie uma conta no [Netlify](https://netlify.com/)
2. Importe seu repositório GitHub
3. Configure:
   - Base directory: frontend
   - Build command: `npm run build`
   - Publish directory: dist
4. Configure variáveis de ambiente (mesmas do Vercel)
5. Deploy o site

## Considerações de Segurança

- Mantenha o `JWT_SECRET` seguro e único para cada ambiente
- Utilize HTTPS para todas as comunicações em produção
- Implemente rate limiting para prevenir abusos na API
- Valide todas as entradas de usuário no backend
- Nunca exponha credenciais de banco de dados no código-fonte

## Manutenção e Escalabilidade

- Monitore o uso de recursos do servidor
- Configure backups regulares do banco de dados
- Considere implementar cache para melhorar o desempenho
- Para escalar, considere:
  - Separar o serviço Stockfish em um microserviço dedicado
  - Implementar balanceamento de carga para o backend
  - Utilizar CDN para o frontend

## Próximos Passos e Melhorias Futuras

- Implementar modo multijogador
- Adicionar mais recursos educativos (vídeos, lições)
- Desenvolver uma IA própria para substituir o Stockfish
- Implementar análise de partidas em tempo real
- Adicionar suporte para torneios e competições

## Solução de Problemas

### Problemas Comuns

1. **Erro de conexão com o banco de dados**
   - Verifique se o PostgreSQL está em execução
   - Confirme se a URL do banco de dados está correta no arquivo .env
   - Verifique permissões do usuário do banco de dados

2. **Erro ao iniciar o servidor**
   - Verifique se todas as dependências foram instaladas
   - Confirme se as portas necessárias estão disponíveis
   - Verifique logs de erro para mais detalhes

3. **Problemas com a engine Stockfish**
   - Verifique se o pacote stockfish foi instalado corretamente
   - Em alguns ambientes, pode ser necessário compilar a engine localmente

## Contato e Suporte

Para questões, sugestões ou problemas, entre em contato através de:
- GitHub Issues
- Email: [seu-email@exemplo.com]

---

© 2025 Projeto de Xadrez Educativo com IA. Todos os direitos reservados.
