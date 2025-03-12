FROM node:18-alpine

# Installer pnpm globalement
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Installer les dépendances en mode production (sans les devDependencies)
RUN pnpm install --frozen-lockfile --prod

COPY . .

CMD ["pnpm", "start"]
