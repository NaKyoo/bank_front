# ==========================================
# Stage 1: Build & Setup
# ==========================================
FROM node:22-alpine AS build-stage

WORKDIR /app

# Copie des dépendances
COPY package*.json ./

# Installation propre (npm ci respecte le lockfile)
RUN npm ci

# Copie du code source
COPY . .

# On lance un build pour vérifier qu'il n'y a pas d'erreurs de syntaxe
RUN npm run build

# ==========================================
# Stage 2: Doc Stage
# ==========================================
FROM build-stage AS doc-stage
WORKDIR /app

# Création du dossier pour l'artefact de doc
RUN mkdir -p /app/docs/out

# On copie le résultat du build dans le dossier de sortie de doc
# (Ou remplacez par votre commande de génération de doc si vous en avez une)
RUN cp -r dist/* /app/docs/out/

# ==========================================
# Stage 3: Final Stage (Lancement Dev)
# ==========================================
# On reste sur l'image build-stage qui contient déjà node_modules
FROM build-stage AS final

# Port standard de Vite
EXPOSE 5173

# Lancement en mode DEV
# IMPORTANT : "-- --host" permet d'écouter sur 0.0.0.0 (extérieur du conteneur)
CMD ["npm", "run", "dev", "--", "--host"]