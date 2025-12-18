# ÉTAPE 1 : Build de l'application React
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copie des fichiers de configuration npm
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source et build de l'application
COPY . .
RUN npm run build

# ÉTAPE 2 : Serveur de production Nginx
FROM nginx:stable-alpine

# Copie des fichiers buildés de l'étape précédente vers le dossier Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html


# On remplace la config par défaut de Nginx par la nôtre
COPY nginx.conf /etc/nginx/conf.d/default.conf

# (Optionnel) Copie d'une configuration Nginx personnalisée pour gérer le routage React
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]