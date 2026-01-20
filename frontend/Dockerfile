# Utilise une image Node.js officielle
FROM node:18-alpine

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers
COPY . .

# Expose le port
EXPOSE 5173

# Commande de démarrage
CMD ["npm", "run", "dev"]
