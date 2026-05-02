FROM node:20-alpine
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta que o Vite usa por padrão
EXPOSE 5173

# Roda o servidor de desenvolvimento do Vite (expõe para host para funcionar no Docker)
CMD ["npm", "run", "dev", "--", "--host"]
