# 🐾 Senti PetStore - Sistema de Gerenciamento

Sistema web completo para gerenciamento de agendamentos em petshops, com controle visual de fila de pets.

## ✨ Funcionalidades

- 📋 **Fila Visual de Agendamentos** - Kanban board com status em tempo real
- 🔄 **Controle de Status** - Acompanhe o pet: Aguardando → Em Serviço → Pronto → Entregue
- 🏢 **Multi-filial** - Gerencia Matriz e Centro
- 🐕 **Gestão de Pets** - Registro de animais com raça e tamanho
- 📅 **Agendamentos** - Agende banho, tosa e hidratação
- 💾 **Banco de Dados** - SQLite local (pronto para migração para PostgreSQL)

## 🚀 Quick Start

### 1️⃣ Pré-requisitos

- **Node.js 16+** - [Baixar](https://nodejs.org/)
- **Git** - [Baixar](https://git-scm.com/)

### 2️⃣ Setup Automático

```bash
# Clone ou extraia a pasta
cd senti-petshop

# Execute o script de setup (faz tudo automaticamente)
bash setup.sh
```

O script vai:
- ✅ Instalar dependências (npm install)
- ✅ Criar banco de dados SQLite
- ✅ Rodar migrations
- ✅ Popular com dados de exemplo
- ✅ Mostrar os próximos passos

### 3️⃣ Iniciar o Projeto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Deve aparecer:
```
🐾 Senti PetStore - Backend
🚀 Server rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Deve abrir em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
senti-petshop/
├── backend/                 # API Node.js + Express
│   ├── prisma/
│   │   ├── schema.prisma   # Modelo de dados
│   │   ├── dev.db          # Banco SQLite (criado automaticamente)
│   │   └── seed.ts         # Dados de exemplo
│   └── src/
│       ├── modules/agendamento/
│       ├── shared/types.ts
│       ├── app.ts
│       └── index.ts
│
├── frontend/                # React + TypeScript
│   ├── src/
│   │   ├── pages/FilaAgendamentos.tsx
│   │   ├── components/KanbanBoard.tsx
│   │   ├── hooks/useAgendamentos.ts
│   │   ├── services/api.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── public/index.html
│
├── setup.sh                 # Script de automação
└── .gitignore
```

## 🎮 Como Usar

### Visualizar Fila

1. Acesse `http://localhost:3000`
2. Selecione a filial (Matriz ou Centro)
3. Veja os pets em diferentes colunas por status

### Mover Pet de Status

1. Clique no botão **➜** (seta) do cartão do pet
2. O pet move para o próximo status automaticamente
3. A fila atualiza em tempo real (a cada 5 segundos)

### Status Disponíveis

| Status | Descrição | Ação |
|--------|-----------|------|
| ⏳ **Aguardando** | Pet chegou, aguardando início | Mover para "Em Serviço" |
| 🛁 **Em Serviço** | Banho/Tosa em andamento | Mover para "Pronto" |
| ✅ **Pronto** | Serviço concluído, aguardando retirada | Mover para "Entregue" |
| 🚚 **Entregue** | Pet retirado pelo dono | Fim do processo |

## 🗂️ Dados de Exemplo

O setup cria automaticamente:

**Filiais:**
- Senti PetStore - Matriz
- Senti PetStore - Centro

**Pets:**
- Thor (Labrador, Grande)
- Bella (Poodle, Pequeno)
- Max (Golden Retriever, Grande)
- Luna (Shih Tzu, Pequeno)
- Rex (Pinscher, Pequeno)

**Serviços:**
- Banho (R$ 50)
- Tosa (R$ 60)
- Hidratação (R$ 40)

**Agendamentos:**
- 5 agendamentos para hoje em diferentes status

## 🔧 Rotas da API

### Agendamentos

```bash
# Listar agendamentos da filial
GET /api/v1/agendamentos?filialId=1&data=2026-06-09

# Criar agendamento
POST /api/v1/agendamentos
Body: {
  "petId": 1,
  "filialId": 1,
  "dataAgendamento": "2026-06-09",
  "horaAgendamento": "10:00",
  "servicosIds": [1, 2],
  "observacoes": "Hipoalergênico se possível"
}

# Mudar status
PATCH /api/v1/agendamentos/1/status
Body: {
  "novoStatus": "EM_SERVICO",
  "usuario": "João"
}

# Listar serviços
GET /api/v1/agendamentos/filial/1/servicos

# Listar pets
GET /api/v1/agendamentos/filial/1/pets
```

## 🐛 Troubleshooting

### Porta 3001 já em uso
```bash
# Matar processo na porta
lsof -ti:3001 | xargs kill -9
# Ou mudar PORT no .env do backend
```

### Erro "Cannot find module"
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Banco de dados corrompido
```bash
rm backend/prisma/dev.db
npm run seed
```

## 📱 Próximos Passos

1. **Criar UI para novos agendamentos** - Modal com formulário
2. **Relatórios** - Estatísticas diárias/semanais
3. **Notificações** - SMS/Email quando status muda
4. **WebSocket** - Atualização em tempo real (ao invés de polling)
5. **Deploy** - Vercel (frontend) + Railway/Render (backend)

## 📚 Stack Tecnológico

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite (desenvolvimento)

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Axios
- Lucide Icons

## 📄 Licença

MIT

## 👥 Suporte

Dúvidas? Abra uma issue no repositório!

---

**Feito com ❤️ para Senti PetStore**
