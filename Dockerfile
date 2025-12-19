# Build stage#
# compilation d'une image légère contenant Node.js 18 pour compiler le projet
FROM node:18-alpine AS build-stage

# on se place dans le dossier /app à l'interieur de la machine Docker
WORKDIR /app

# on copie les fichier de dépendance 
COPY package*.json ./

# on installe les bibliothèques nécessaires
RUN npm install

# on copie le reste du code dans la machine
COPY . .
# on compile le projet --> crée le dossier /dist dans lequel on transforme le code react en fichier static optimisé
RUN npm run build

# Production stage
# création de l'image finale légère avec Nginx pour servir les fichiers static
FROM nginx:stable-alpine

# on copie les fichiers static depuis l'image de build
COPY --from=build-stage /app/dist /usr/share/nginx/html

# on copie la configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# on indique que le conteneur écoute sur le port standard du web : 80
EXPOSE 80

# on lance Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]
 # -g directive global
 # daemon off : permet de garder Nginx au premier plan pour que le conteneur reste actif