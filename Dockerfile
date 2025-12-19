# Build stage#
# compilation d'une image légère contenant Node.js 18 pour compiler le projet
FROM node:22-alpine

# on se place dans le dossier /app à l'interieur de la machine Docker
WORKDIR /app

# on copie les fichier de dépendance 
COPY package*.json ./

# on installe les bibliothèques nécessaires
RUN npm install

# on copie le reste du code dans la machine
COPY . .

# Doc Stage

# on indique que le conteneur écoute sur le port standard du web : 80
EXPOSE 5173

# on lance Nginx en mode foreground
CMD ["npm", "run", "dev"]