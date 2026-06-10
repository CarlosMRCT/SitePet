#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐾 Senti PetStore - Setup Automático${NC}\n"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js não está instalado!${NC}"
    echo "Baixe em: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} detectado${NC}\n"

# Setup Backend
echo -e "${BLUE}📦 Setup Backend...${NC}"
cd backend

echo "Instalando dependências do backend..."
npm install

echo -e "\n${BLUE}🗄️  Configurando banco de dados...${NC}"
npx prisma generate
npx prisma migrate dev --name init --skip-generate

echo -e "\n${BLUE}🌱 Preenchendo com dados de exemplo...${NC}"
npx prisma db seed

echo -e "${GREEN}✅ Backend pronto!${NC}\n"

# Setup Frontend
echo -e "${BLUE}📦 Setup Frontend...${NC}"
cd ../frontend

echo "Instalando dependências do frontend..."
npm install

echo -e "${GREEN}✅ Frontend pronto!${NC}\n"

# Done
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ Setup Completo! ✨${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Para iniciar o projeto:${NC}\n"

echo "Terminal 1 (Backend):"
echo -e "${BLUE}cd backend && npm run dev${NC}\n"

echo "Terminal 2 (Frontend):"
echo -e "${BLUE}cd frontend && npm start${NC}\n"

echo -e "${GREEN}Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}Backend: http://localhost:3001${NC}\n"

echo -e "${YELLOW}Dados de teste criados automaticamente!${NC}"
echo -e "Filial: ${BLUE}Matriz (ID: 1)${NC}"
echo -e "Pet exemplo: ${BLUE}Thor (Labrador)${NC}\n"
